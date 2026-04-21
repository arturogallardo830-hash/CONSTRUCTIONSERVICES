import { useWorkers } from '../context/WorkersContext'
import { useApp } from '../context/AppContext'
import { statusConfig } from '../data/mockData'
import TopBar from '../components/TopBar'
import { Download, Users, Cpu, ClipboardList, AlertTriangle, Clock } from 'lucide-react'

function calcHours(checkIn, checkOut) {
  if (!checkIn) return 0
  const start = checkIn instanceof Date ? checkIn : new Date(checkIn)
  const end = checkOut ? (checkOut instanceof Date ? checkOut : new Date(checkOut)) : new Date()
  return (end - start) / 3600000
}

function formatHours(h) {
  const hh = Math.floor(h)
  const mm = Math.floor((h - hh) * 60)
  return `${hh}h ${mm}m`
}

export default function DailyReport() {
  const { workers } = useWorkers()
  const { tasks, machines, sosAlerts } = useApp()

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  // Compute stats
  const present = workers.filter(w => w.checkIn)
  const absent = workers.filter(w => !w.checkIn)
  const totalHours = workers.reduce((acc, w) => acc + calcHours(w.checkIn, w.checkOut), 0)
  const completedTasks = tasks.filter(t => t.status === 'completed')
  const pendingTasks = tasks.filter(t => t.status !== 'completed')
  const operatingMachines = machines.filter(m => m.status === 'operating' || m.status === 'maintenance')
  const incidents = sosAlerts.length

  const handlePrint = () => window.print()

  const exportCSV = () => {
    const rows = [
      ['Daily Report', today],
      [],
      ['=== ATTENDANCE ==='],
      ['Name', 'Role', 'Check-in', 'Check-out', 'Hours'],
      ...workers.map(w => [
        w.name, w.role,
        w.checkIn ? (w.checkIn instanceof Date ? w.checkIn : new Date(w.checkIn)).toLocaleTimeString() : '—',
        w.checkOut ? (w.checkOut instanceof Date ? w.checkOut : new Date(w.checkOut)).toLocaleTimeString() : '—',
        formatHours(calcHours(w.checkIn, w.checkOut)),
      ]),
      [],
      ['=== TASKS ==='],
      ['Worker', 'Task', 'Priority', 'Status', 'Due Date'],
      ...tasks.map(t => {
        const w = workers.find(ww => ww.id === t.workerId)
        return [w?.name || 'N/A', t.title, t.priority, t.status, t.dueDate || '—']
      }),
      [],
      ['=== MACHINERY ==='],
      ['Name', 'Status', 'Operator', 'Hours Used'],
      ...machines.map(m => [m.name, m.status, m.operator, m.hoursUsed + 'h']),
      [],
      ['=== SUMMARY ==='],
      ['Present workers', present.length],
      ['Absent workers', absent.length],
      ['Total hours worked', formatHours(totalHours)],
      ['Tasks completed', completedTasks.length],
      ['Tasks pending', pendingTasks.length],
      ['SOS incidents', incidents],
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `daily-report-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopBar
        title="Daily Report"
        subtitle={today}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={exportCSV}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-light)'; e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              <Download size={13} /> CSV
            </button>
            <button onClick={handlePrint}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6, border: 'none', background: 'var(--blue)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <Download size={13} /> Export PDF
            </button>
          </div>
        }
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }} id="print-area">
        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { icon: Users,         label: 'Present',        value: present.length,           sub: `of ${workers.length}`,    color: 'var(--green)' },
            { icon: Users,         label: 'Absent',         value: absent.length,            sub: 'workers',                  color: 'var(--red)' },
            { icon: Clock,         label: 'Total Hours',    value: formatHours(totalHours),  sub: 'all workers',              color: 'var(--blue)' },
            { icon: ClipboardList, label: 'Tasks Done',     value: completedTasks.length,    sub: `of ${tasks.length} total`, color: 'var(--green)' },
            { icon: ClipboardList, label: 'Tasks Pending',  value: pendingTasks.length,      sub: 'remaining',                color: 'var(--amber)' },
            { icon: Cpu,           label: 'Machinery Used', value: operatingMachines.length, sub: `of ${machines.length}`,    color: 'var(--blue)' },
            { icon: AlertTriangle, label: 'SOS Incidents',  value: incidents,                sub: 'today',                    color: incidents > 0 ? 'var(--red)' : 'var(--green)' },
          ].map((stat) => {
            const StatIcon = stat.icon
            return (
            <div key={stat.label} style={{ padding: '16px 18px', borderRadius: 10, background: 'var(--white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <StatIcon size={14} style={{ color: 'var(--text-tertiary)' }} />
                <p style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{stat.label}</p>
              </div>
              <p style={{ fontSize: 22, fontWeight: 700, color: stat.color, lineHeight: 1.2 }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{stat.sub}</p>
            </div>
            )
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Attendance section */}
          <div style={{ background: 'var(--white)', borderRadius: 10, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={14} style={{ color: 'var(--blue)' }} />
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Worker Attendance</h3>
            </div>
            <div style={{ overflowY: 'auto', maxHeight: 280 }}>
              {workers.map((w, i) => {
                const hours = calcHours(w.checkIn, w.checkOut)
                const cfg = statusConfig[w.status] || statusConfig['inactivo']
                return (
                  <div key={w.id} style={{
                    padding: '10px 18px', borderBottom: i < workers.length - 1 ? '1px solid var(--border)' : 'none',
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
                      {w.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{w.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{w.role}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: w.checkIn ? 'var(--green)' : 'var(--red)' }}>
                        {w.checkIn ? formatHours(hours) : 'Absent'}
                      </p>
                      {w.checkIn && (
                        <p style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                          {(w.checkIn instanceof Date ? w.checkIn : new Date(w.checkIn)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          {w.checkOut ? ' – ' + (w.checkOut instanceof Date ? w.checkOut : new Date(w.checkOut)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ' (active)'}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tasks section */}
          <div style={{ background: 'var(--white)', borderRadius: 10, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ClipboardList size={14} style={{ color: 'var(--blue)' }} />
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Task Summary</h3>
            </div>
            <div style={{ overflowY: 'auto', maxHeight: 280 }}>
              {tasks.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>No tasks today</p>
                </div>
              )}
              {tasks.map((task, i) => {
                const worker = workers.find(w => w.id === task.workerId)
                const sColors = { completed: 'var(--green)', 'in-progress': 'var(--blue)', pending: 'var(--amber)' }
                const sBgs = { completed: '#E8F9EE', 'in-progress': '#EBF3FF', pending: '#FEF3C7' }
                const pColors = { high: 'var(--red)', medium: 'var(--amber)', low: 'var(--green)' }
                return (
                  <div key={task.id} style={{ padding: '10px 18px', borderBottom: i < tasks.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: pColors[task.priority], flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{worker?.name || 'Unassigned'}</p>
                    </div>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: sBgs[task.status], color: sColors[task.status], fontWeight: 500, flexShrink: 0 }}>
                      {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Machinery section */}
        <div style={{ background: 'var(--white)', borderRadius: 10, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Cpu size={14} style={{ color: 'var(--blue)' }} />
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Machinery Used Today</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, padding: 16 }}>
            {machines.map(m => {
              const mColors = { operating: 'var(--green)', maintenance: 'var(--amber)', 'out-of-service': 'var(--red)', available: 'var(--blue)' }
              const mBgs = { operating: '#E8F9EE', maintenance: '#FEF3C7', 'out-of-service': '#FEE2E2', available: '#EBF3FF' }
              return (
                <div key={m.id} style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>🏗️</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{m.hoursUsed}h total · {m.operator}</p>
                  </div>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: mBgs[m.status], color: mColors[m.status], fontWeight: 600, flexShrink: 0 }}>
                    {m.status === 'out-of-service' ? 'OOS' : m.status === 'in-progress' ? '—' : m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Incidents */}
        {sosAlerts.length > 0 && (
          <div style={{ background: '#FFF5F5', borderRadius: 10, border: '1px solid #FECACA', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #FECACA', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={14} style={{ color: 'var(--red)' }} />
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--red)' }}>SOS Incidents Today</h3>
            </div>
            <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sosAlerts.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--white)', borderRadius: 8, border: '1px solid #FECACA' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FEE2E2', color: '#DF2036', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>{a.workerAvatar}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{a.workerName}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{a.time.toLocaleTimeString('en-US')} · {a.lat.toFixed(4)}, {a.lng.toFixed(4)}</p>
                  </div>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: a.acknowledged ? '#E8F9EE' : '#FEE2E2', color: a.acknowledged ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
                    {a.acknowledged ? 'Resolved' : 'Active'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          aside, header { display: none !important; }
          #print-area { overflow: visible !important; height: auto !important; }
          body { background: white !important; }
          .leaflet-container { display: none !important; }
        }
      `}</style>
    </div>
  )
}
