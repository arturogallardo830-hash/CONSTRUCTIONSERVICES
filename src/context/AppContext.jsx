import { createContext, useContext, useState, useCallback } from 'react'
import { mockMachines, mockZones, mockGroups, mockTasks } from '../data/mockData'

const AppCtx = createContext(null)

export function AppProvider({ children }) {
  // ── Machinery ──────────────────────────────────────────────────────────────
  const [machines, setMachines] = useState(mockMachines)

  const updateMachine = useCallback((id, updates) => {
    setMachines(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
  }, [])

  // ── Danger Zones ───────────────────────────────────────────────────────────
  const [zones, setZones] = useState(mockZones)

  const addZone = useCallback((zone) => {
    setZones(prev => [...prev, { id: 'z' + Date.now(), ...zone }])
  }, [])

  const removeZone = useCallback((id) => {
    setZones(prev => prev.filter(z => z.id !== id))
  }, [])

  // ── Tasks ──────────────────────────────────────────────────────────────────
  const [tasks, setTasks] = useState(mockTasks)

  const addTask = useCallback((task) => {
    setTasks(prev => [{ id: 't' + Date.now(), status: 'pending', ...task }, ...prev])
  }, [])

  const updateTaskStatus = useCallback((id, status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const tasksForWorker = useCallback((workerId) => {
    return tasks.filter(t => t.workerId === workerId)
  }, [tasks])

  const pendingCountForWorker = useCallback((workerId) => {
    return tasks.filter(t => t.workerId === workerId && t.status !== 'completed').length
  }, [tasks])

  // ── SOS Alerts ─────────────────────────────────────────────────────────────
  const [sosAlerts, setSosAlerts] = useState([])

  const triggerSOS = useCallback((worker) => {
    const alert = {
      id: Date.now(),
      workerId: worker.id,
      workerName: worker.name,
      workerAvatar: worker.avatar,
      lat: worker.lat,
      lng: worker.lng,
      time: new Date(),
      acknowledged: false,
    }
    setSosAlerts(prev => [alert, ...prev])
  }, [])

  const acknowledgeSOS = useCallback((id) => {
    setSosAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a))
  }, [])

  const activeSOSCount = sosAlerts.filter(a => !a.acknowledged).length
  const activeSOSWorkerIds = sosAlerts.filter(a => !a.acknowledged).map(a => a.workerId)

  // ── Group Messages ─────────────────────────────────────────────────────────
  const [groups] = useState(mockGroups)

  const [groupChats, setGroupChats] = useState(() => {
    const obj = {}
    mockGroups.forEach(g => { obj[g.id] = [] })
    return obj
  })

  const [groupUnread, setGroupUnread] = useState(() => {
    const obj = {}
    mockGroups.forEach(g => { obj[g.id] = 0 })
    return obj
  })

  const sendGroupMessage = useCallback((groupId, text, isAnnouncement = false) => {
    const msg = {
      id: Date.now() + Math.random(),
      from: 'supervisor',
      text: text.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isAnnouncement,
      readBy: ['supervisor'],
    }
    setGroupChats(c => ({ ...c, [groupId]: [...(c[groupId] || []), msg] }))
  }, [])

  const markGroupMessageRead = useCallback((groupId, msgId) => {
    setGroupChats(c => ({
      ...c,
      [groupId]: (c[groupId] || []).map(m =>
        m.id === msgId && !m.readBy.includes('worker-1')
          ? { ...m, readBy: [...m.readBy, 'worker-1'] }
          : m
      ),
    }))
  }, [])

  const markGroupRead = useCallback((groupId) => {
    setGroupUnread(u => ({ ...u, [groupId]: 0 }))
  }, [])

  const totalGroupUnread = Object.values(groupUnread).reduce((a, b) => a + b, 0)

  return (
    <AppCtx.Provider value={{
      machines, updateMachine,
      zones, addZone, removeZone,
      tasks, addTask, updateTaskStatus, deleteTask, tasksForWorker, pendingCountForWorker,
      sosAlerts, triggerSOS, acknowledgeSOS, activeSOSCount, activeSOSWorkerIds,
      groups, groupChats, groupUnread, totalGroupUnread, sendGroupMessage, markGroupRead, markGroupMessageRead,
    }}>
      {children}
    </AppCtx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
