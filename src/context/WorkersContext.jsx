import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { mockWorkers } from '../data/mockData'
import { db, FIREBASE_ENABLED } from '../firebase.js'

const WorkersCtx = createContext(null)

const REPLIES = [
  "Understood, on my way.", "Received.", "Can you repeat? Call dropped.",
  "Coming, give me 5 minutes.", "Done, all set.", "There's an issue, can you come?",
  "Perfect, thanks.",
]

const NO_SIGNAL_TIMEOUT = 5 * 60 * 1000 // 5 minutes

export function WorkersProvider({ children }) {
  const [workers, setWorkers] = useState(mockWorkers)
  const workersRef = useRef(workers)
  useEffect(() => { workersRef.current = workers }, [workers])

  const [liveAlert, setLiveAlert] = useState(null) // { name, lat, lng }
  const clearLiveAlert = useCallback(() => setLiveAlert(null), [])
  const knownFirebaseKeys = useRef(new Set())
  const firebaseFirstLoad = useRef(false)

  const [chats, setChats] = useState(() => {
    const obj = {}
    mockWorkers.forEach(w => { obj[w.id] = [...w.messages] })
    return obj
  })

  const [unread, setUnread] = useState(() => {
    const obj = {}
    mockWorkers.forEach(w => { obj[w.id] = w.messages.filter(m => m.from === 'worker').length })
    return obj
  })

  // Real-time Firebase listener for /colaboradores (workers sharing GPS from trabajador.html)
  useEffect(() => {
    if (!FIREBASE_ENABLED || !db) return
    let unsub = null

    import('firebase/database').then(({ ref, onValue }) => {
      unsub = onValue(ref(db, 'colaboradores'), (snapshot) => {
        const data = snapshot.val()
        if (!data) return

        const isFirst = !firebaseFirstLoad.current
        firebaseFirstLoad.current = true

        // Detect newly connected workers (skip on first load to avoid spurious alerts)
        if (!isFirst) {
          Object.entries(data).forEach(([key, info]) => {
            if (info?.status === 'activo' && info.lat != null && !knownFirebaseKeys.current.has(key)) {
              setLiveAlert({ name: info.nombre || key, lat: info.lat, lng: info.lng })
            }
            if (info?.status === 'inactivo') knownFirebaseKeys.current.delete(key)
          })
        }
        // Always sync known keys
        Object.entries(data).forEach(([key, info]) => {
          if (info?.status === 'activo') knownFirebaseKeys.current.add(key)
          else knownFirebaseKeys.current.delete(key)
        })

        setWorkers(prev => {
          let updated = [...prev]

          Object.entries(data).forEach(([key, info]) => {
            if (!info || !info.nombre) return
            const nombre = info.nombre
            const idx = updated.findIndex(
              w => w.name.toLowerCase() === nombre.toLowerCase()
            )

            if (info.status === 'activo' && info.lat != null && info.lng != null) {
              if (idx >= 0) {
                updated[idx] = {
                  ...updated[idx],
                  lat: info.lat,
                  lng: info.lng,
                  status: 'activo',
                  lastUpdate: new Date(info.timestamp || Date.now()),
                }
              } else {
                const parts = nombre.trim().split(' ')
                const avatar = ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '??'
                updated = [{
                  id: `fb-${key}`,
                  name: nombre,
                  role: 'Colaborador',
                  phone: '',
                  route: 'GPS en vivo',
                  status: 'activo',
                  battery: 100,
                  speed: 0,
                  lat: info.lat,
                  lng: info.lng,
                  avatar,
                  lastUpdate: new Date(info.timestamp || Date.now()),
                  checkIn: info.horaInicio ? new Date(info.horaInicio) : new Date(),
                  checkOut: null,
                  messages: [],
                }, ...updated]
              }
            } else if (info.status === 'inactivo' && idx >= 0) {
              updated[idx] = {
                ...updated[idx],
                status: 'inactivo',
                lastUpdate: new Date(info.timestamp || Date.now()),
              }
            }
          })

          return updated
        })
      })
    })

    return () => { if (unsub) unsub() }
  }, [])

  // GPS simulation (replaces Firebase when FIREBASE_ENABLED=false)
  useEffect(() => {
    const t = setInterval(() => {
      setWorkers(prev => prev.map(w =>
        w.status === 'en-ruta'
          ? { ...w, lat: w.lat + (Math.random() - 0.5) * 0.0008, lng: w.lng + (Math.random() - 0.5) * 0.0008, lastUpdate: new Date() }
          : w
      ))
    }, 3000)
    return () => clearInterval(t)
  }, [])

  // "No signal" detection — mark workers inactive after 5 min without update
  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now()
      setWorkers(prev => prev.map(w => {
        const lastMs = w.lastUpdate instanceof Date ? w.lastUpdate.getTime() : new Date(w.lastUpdate).getTime()
        if (now - lastMs > NO_SIGNAL_TIMEOUT && w.status !== 'sin-senal' && w.status !== 'inactivo') {
          return { ...w, status: 'sin-senal' }
        }
        return w
      }))
    }, 30000)
    return () => clearInterval(t)
  }, [])

  // Incoming message simulation
  useEffect(() => {
    const t = setInterval(() => {
      if (Math.random() > 0.65) {
        const list = workersRef.current
        const w = list[Math.floor(Math.random() * list.length)]
        const msg = {
          id: Date.now() + Math.random(), from: 'worker',
          text: REPLIES[Math.floor(Math.random() * REPLIES.length)],
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }
        setChats(c => ({ ...c, [w.id]: [...(c[w.id] || []), msg] }))
        setUnread(u => ({ ...u, [w.id]: (u[w.id] || 0) + 1 }))
      }
    }, 7000)
    return () => clearInterval(t)
  }, [])

  // ── Worker CRUD ────────────────────────────────────────────────────────────
  const addWorker = useCallback((data) => {
    const parts = data.name.trim().split(' ')
    const avatar = ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '??'
    const w = {
      id: Date.now(),
      name: data.name.trim(), role: data.role,
      phone: data.phone || '(no phone)', route: data.site,
      status: 'activo', battery: 100, speed: 0,
      lat: 39.755 + (Math.random() - 0.5) * 0.04,
      lng: -104.990 + (Math.random() - 0.5) * 0.04,
      avatar, lastUpdate: new Date(),
      checkIn: null, checkOut: null,
      messages: [],
    }
    setWorkers(prev => [w, ...prev])
    setChats(c => ({ ...c, [w.id]: [] }))
    setUnread(u => ({ ...u, [w.id]: 0 }))
  }, [])

  const deleteWorker = useCallback((id) => {
    setWorkers(prev => prev.filter(w => w.id !== id))
  }, [])

  const updateRoute = useCallback((id, route) => {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, route } : w))
  }, [])

  const updateStatus = useCallback((id, status) => {
    setWorkers(prev => prev.map(w =>
      w.id === id ? { ...w, status, speed: status !== 'en-ruta' ? 0 : w.speed } : w
    ))
  }, [])

  const refreshTimestamps = useCallback(() => {
    setWorkers(prev => prev.map(w => ({ ...w, lastUpdate: new Date() })))
  }, [])

  // ── Check-In / Check-Out ───────────────────────────────────────────────────
  const checkIn = useCallback((id) => {
    setWorkers(prev => prev.map(w =>
      w.id === id ? { ...w, checkIn: new Date(), checkOut: null, status: 'activo', lastUpdate: new Date() } : w
    ))
  }, [])

  const checkOut = useCallback((id) => {
    setWorkers(prev => prev.map(w =>
      w.id === id ? { ...w, checkOut: new Date(), status: 'inactivo', lastUpdate: new Date() } : w
    ))
  }, [])

  // ── Chat ───────────────────────────────────────────────────────────────────
  const sendMessage = useCallback((workerId, content) => {
    const isPhoto = typeof content === 'object' && content.type === 'photo'
    const msg = {
      id: Date.now() + Math.random(),
      from: 'supervisor',
      ...(isPhoto
        ? { type: 'photo', imageUrl: content.imageUrl, caption: content.caption }
        : { text: content.trim() }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
    setChats(c => ({ ...c, [workerId]: [...(c[workerId] || []), msg] }))
  }, [])

  const sendWorkerPhoto = useCallback((workerId, imageUrl, caption) => {
    const msg = {
      id: Date.now() + Math.random(),
      from: 'worker',
      type: 'photo',
      imageUrl,
      caption: caption || '',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
    setChats(c => ({ ...c, [workerId]: [...(c[workerId] || []), msg] }))
    setUnread(u => ({ ...u, [workerId]: (u[workerId] || 0) + 1 }))
  }, [])

  const markRead = useCallback((workerId) => {
    setUnread(u => ({ ...u, [workerId]: 0 }))
  }, [])

  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0)

  return (
    <WorkersCtx.Provider value={{
      workers, chats, unread, totalUnread,
      addWorker, deleteWorker, updateRoute, updateStatus,
      sendMessage, sendWorkerPhoto, markRead, refreshTimestamps,
      checkIn, checkOut,
      liveAlert, clearLiveAlert,
    }}>
      {children}
    </WorkersCtx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkers() {
  const ctx = useContext(WorkersCtx)
  if (!ctx) throw new Error('useWorkers must be used inside WorkersProvider')
  return ctx
}
