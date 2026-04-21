import { useState } from 'react'
import { useWorkers } from '../context/WorkersContext'
import { statusConfig } from '../data/mockData'
import TopBar from '../components/TopBar'
import { Download, LogIn, LogOut, Clock } from 'lucide-react'

function formatTime(date) {
  if (!date) return '—'
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function calcHours(checkIn, checkOut) {
  if (!checkIn) return null
  const start = checkIn instanceof Date ? checkIn : new Date(checkIn)
  const end = checkOut ? (checkOut instanceof Date ? checkOut : new Date(checkOut)) : new Date()
  const ms = end - start
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return `${h}h ${m}m`
}

function attendanceStatus(worker) {
  if (!worker.checkIn) return { label: 'Absent', color: 'var(--red)', bg: '#FEE2E2' }
  if (worker.checkIn && !worker.checkOut) return { label: 'Present', color: 'var(--green)', bg: '#E8F9EE' }
  return { label: 'Completed', color: '#6B7280', bg: '#F3F4F6' }
}

export default function Attendance() {
  const { workers, checkIn, checkOut } = useWorkers()
  const [search, setSearch] = useState('')
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const filtered = workers.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.role.toLowerCase().includes(search.toLowerCase())
  )

  const present = workers.filter(w => w.checkIn).length
  const absent = workers.filter(w => !w.checkIn).length
  const completed = workers.filter(w => w.checkIn && w.checkOut).length

  const exportCSV = () => {
    const header = ['Name', 'Role', 'Status', 'Check-in', 'Check-out', 'Hours Worked', 'Attendance']
    const rows = workers.map(w => {
      const att = attendanceStatus(w)
      return [
        w.name,
        w.role,
        (statusConfig[w.status] || statusConfig['inactivo']).label,
        formatTime(w.checkIn),
        formatTime(w.checkOut),
        calcHours(w.checkIn, w.checkOut) || '—',
        att.label,
      ]
    })
    const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopBar
        title="Attendance"
        subtitle={today}
        actions={
          <button onClick={exportCSV}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-light)'; e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            <Download size={13} /> Export CSV
          </button>
        }
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total Workers', value: workers.length, color: 'var(--text-primary)' },
            { label: 'Present',       value: present,         color: 'var(--green)' },
            { label: 'Absent',        value: absent,          color: 'var(--red)' },
            { label: 'Completed',     value: completed,       color: '#6B7280' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding: '14px 18px', borderRadius: 8, background: 'var(--white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom: 16, maxWidth: 340 }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)} placeholder="Search worker..."
            style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, outline: 'none', color: 'var(--text-primary)', background: 'var(--white)' }}
            onFocus={e => e.target.style.borderColor = 'var(--blue)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Table */}
        <div style={{ background: 'var(--white)', borderRadius: 8, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.2fr 1.2fr 1.2fr 1.2fr 1.2fr', padding: '10px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
            {['Worker', 'Status', 'Check-in', 'Check-out', 'Hours', 'Attendance'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
            ))}
          </div>

          {filtered.map((worker, i) => {
            const cfg = statusConfig[worker.status] || statusConfig['inactivo']
            const att = attendanceStatus(worker)
            const hours = calcHours(worker.checkIn, worker.checkOut)

            return (
              <div key={worker.id}
                style={{
                  display: 'grid', gridTemplateColumns: '2.2fr 1.2fr 1.2fr 1.2fr 1.2fr 1.2fr',
                  padding: '13px 20px', alignItems: 'center',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Worker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>{worker.avatar}</div>
                    <span style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: cfg.dot, border: '2px solid var(--white)' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{worker.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{worker.role}</p>
                  </div>
                </div>

                {/* Status */}
                <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 20, background: cfg.bg, color: cfg.color, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot }} />{cfg.label}
                </span>

                {/* Check-in */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {worker.checkIn ? (
                    <>
                      <Clock size={12} style={{ color: 'var(--green)' }} />
                      <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{formatTime(worker.checkIn)}</span>
                    </>
                  ) : (
                    <button onClick={() => checkIn(worker.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 5, border: '1px solid var(--green)', background: 'var(--green-bg)', color: 'var(--green)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                      <LogIn size={11} /> Check in
                    </button>
                  )}
                </div>

                {/* Check-out */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {worker.checkOut ? (
                    <>
                      <Clock size={12} style={{ color: 'var(--text-tertiary)' }} />
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{formatTime(worker.checkOut)}</span>
                    </>
                  ) : worker.checkIn ? (
                    <button onClick={() => checkOut(worker.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 5, border: '1px solid var(--amber)', background: 'var(--amber-bg)', color: '#92400E', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                      <LogOut size={11} /> Check out
                    </button>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>—</span>
                  )}
                </div>

                {/* Hours */}
                <span style={{ fontSize: 13, color: hours ? 'var(--text-primary)' : 'var(--text-tertiary)', fontWeight: hours ? 500 : 400 }}>
                  {hours || '—'}
                </span>

                {/* Attendance */}
                <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 20, background: att.bg, color: att.color, fontWeight: 500, display: 'inline-block' }}>
                  {att.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
