import { Bell, AlertTriangle, X, Check } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { useWorkers } from '../context/WorkersContext'

export default function TopBar({ title, subtitle, actions }) {
  const [time, setTime] = useState(new Date())
  const [showNotif, setShowNotif] = useState(false)
  const [showSOS, setShowSOS] = useState(false)
  const bellRef = useRef(null)
  const sosRef = useRef(null)
  const { sosAlerts, acknowledgeSOS, activeSOSCount } = useApp()
  const { workers } = useWorkers()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (!showNotif && !showSOS) return
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setShowNotif(false)
      if (sosRef.current && !sosRef.current.contains(e.target)) setShowSOS(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showNotif, showSOS])

  // Check-in alert — workers who haven't checked in after 8am
  const now = new Date()
  const lateWorkers = workers.filter(w => {
    const h = now.getHours()
    return h >= 8 && !w.checkIn && w.status !== 'inactivo'
  })

  const notifications = [
    ...lateWorkers.map(w => ({
      id: `late-${w.id}`, text: `${w.name} hasn't checked in yet`, dot: 'var(--amber)', urgent: false,
    })),
    ...sosAlerts.filter(a => !a.acknowledged).map(a => ({
      id: `sos-${a.id}`, text: `🚨 SOS from ${a.workerName}`, dot: 'var(--red)', urgent: true,
    })),
  ]

  return (
    <>
      {/* SOS Banner */}
      {activeSOSCount > 0 && (
        <div style={{
          background: '#DF2036', color: '#fff',
          padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 13, fontWeight: 600, flexShrink: 0,
          animation: 'sos-blink 1.5s ease-in-out infinite',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} />
            {activeSOSCount} EMERGENCY SOS ALERT{activeSOSCount > 1 ? 'S' : ''} — Immediate action required
          </div>
          <button
            onClick={() => setShowSOS(v => !v)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '4px 12px', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            View
          </button>
        </div>
      )}

      <header style={{
        height: 56,
        background: 'var(--white)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 16, flexShrink: 0,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>{title}</h1>
            {subtitle && (
              <span style={{
                fontSize: 12, color: 'var(--text-tertiary)',
                padding: '2px 8px', borderRadius: 20,
                background: 'var(--bg)', border: '1px solid var(--border)',
              }}>{subtitle}</span>
            )}
          </div>
        </div>

        {actions}

        {/* Live indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 20,
          background: '#E8F9EE', border: '1px solid #BBF7D0',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'block', animation: 'pulse-dot 2s infinite' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)' }}>Live</span>
        </div>

        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>
          {time.toLocaleTimeString('en-US')}
        </span>

        {/* SOS button */}
        {activeSOSCount > 0 && (
          <div ref={sosRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSOS(v => !v)}
              style={{
                height: 34, padding: '0 12px', borderRadius: 8,
                border: '1px solid #DF2036',
                background: '#FEE2E2',
                display: 'flex', alignItems: 'center', gap: 6,
                color: '#DF2036', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                animation: 'sos-blink 1.5s ease-in-out infinite',
              }}>
              <AlertTriangle size={14} />
              SOS {activeSOSCount > 1 ? `(${activeSOSCount})` : ''}
            </button>

            {showSOS && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                width: 340, background: 'var(--white)',
                border: '1px solid var(--border)', borderRadius: 10,
                boxShadow: 'var(--shadow-md)', zIndex: 200, overflow: 'hidden',
              }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', background: '#FEE2E2', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={14} style={{ color: '#DF2036' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#DF2036' }}>Emergency Alerts</span>
                </div>
                {sosAlerts.map(a => (
                  <div key={a.id} style={{
                    padding: '12px 16px', borderBottom: '1px solid var(--border)',
                    background: a.acknowledged ? 'transparent' : '#FFF5F5',
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                  }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: a.acknowledged ? 'var(--bg)' : '#FEE2E2',
                      color: a.acknowledged ? 'var(--text-tertiary)' : '#DF2036',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 12, flexShrink: 0,
                    }}>{a.workerAvatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: a.acknowledged ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{a.workerName}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                        {a.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        {' · '}{a.lat.toFixed(4)}, {a.lng.toFixed(4)}
                      </p>
                    </div>
                    {!a.acknowledged ? (
                      <button onClick={() => acknowledgeSOS(a.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6,
                          border: '1px solid var(--green)', background: 'var(--green-bg)',
                          color: 'var(--green)', fontSize: 11, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                        }}>
                        <Check size={11} /> Attend
                      </button>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 500, flexShrink: 0 }}>Attended</span>
                    )}
                  </div>
                ))}
                {sosAlerts.length === 0 && (
                  <div style={{ padding: '24px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>No active alerts</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Bell */}
        <div ref={bellRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotif(v => !v)}
            style={{
              width: 34, height: 34, borderRadius: 8,
              border: '1px solid var(--border)',
              background: showNotif ? 'var(--blue-light)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: showNotif ? 'var(--blue)' : 'var(--text-secondary)', position: 'relative',
              cursor: 'pointer',
            }}>
            <Bell size={16} />
            {notifications.length > 0 && (
              <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: 'var(--red)' }} />
            )}
          </button>

          {showNotif && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              width: 300, background: 'var(--white)',
              border: '1px solid var(--border)', borderRadius: 10,
              boxShadow: 'var(--shadow-md)', zIndex: 200, overflow: 'hidden',
            }}>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</span>
                {notifications.length > 0 && (
                  <span style={{ fontSize: 11, padding: '1px 7px', borderRadius: 10, background: 'var(--blue-light)', color: 'var(--blue)', fontWeight: 600 }}>{notifications.length}</span>
                )}
              </div>
              {notifications.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>No notifications</p>
                </div>
              )}
              {notifications.map(n => (
                <div key={n.id} style={{
                  padding: '11px 16px', borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  background: n.urgent ? '#FFF5F5' : 'transparent',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = n.urgent ? '#FEE2E2' : 'var(--bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = n.urgent ? '#FFF5F5' : 'transparent'}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: n.dot, flexShrink: 0, marginTop: 4 }} />
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      <style>{`
        @keyframes sos-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </>
  )
}
