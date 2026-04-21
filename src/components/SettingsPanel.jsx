import { X, User, Bell, Shield, Palette, Globe, Moon, Sun, ChevronRight, Save, Check } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPanel({ onClose, user }) {
  const [tab, setTab] = useState('perfil')
  const [dark, setDark] = useState(() => localStorage.getItem('hnd_theme') === 'dark')

  const applyTheme = (val) => {
    setDark(val)
    localStorage.setItem('hnd_theme', val ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light')
  }
  const [notif, setNotif] = useState({ mensajes: true, ruta: true, bateria: false, inactividad: true })
  const [perfil, setPerfil] = useState({
    nombre: user?.name || 'Supervisor',
    empresa: user?.company || 'H&D Factory',
    turno: 'Mañana',
    email: user?.email || 'supervisor@hdfactory.com',
  })
  const [savedMsg, setSavedMsg] = useState('')
  const [passFields, setPassFields] = useState({ current: '', nueva: '' })
  const [passMsg, setPassMsg] = useState({ text: '', ok: true })

  const handleGuardar = () => {
    setSavedMsg('Changes saved')
    setTimeout(() => setSavedMsg(''), 2000)
  }

  const handleCambiarPassword = () => {
    if (!passFields.current.trim() || !passFields.nueva.trim()) {
      setPassMsg({ text: 'Please fill in both fields to continue.', ok: false })
    } else {
      setPassMsg({ text: 'Password updated successfully.', ok: true })
      setPassFields({ current: '', nueva: '' })
    }
    setTimeout(() => setPassMsg({ text: '', ok: true }), 2500)
  }

  const tabs = [
    { key: 'perfil', label: 'Profile', icon: User },
    { key: 'notificaciones', label: 'Notifications', icon: Bell },
    { key: 'apariencia', label: 'Appearance', icon: Palette },
    { key: 'seguridad', label: 'Security', icon: Shield },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          zIndex: 100, backdropFilter: 'blur(2px)',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 480, background: 'var(--white)',
        zIndex: 101, display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 30px rgba(0,0,0,0.15)',
        animation: 'slide-in-right 0.25s ease',
      }}>

        {/* Header */}
        <div style={{
          padding: '0 24px', height: 56, flexShrink: 0,
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Settings</h2>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)',
            background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)',
          }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Tab list */}
          <div style={{
            width: 160, flexShrink: 0, borderRight: '1px solid var(--border)',
            padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2,
            background: 'var(--bg)',
          }}>
            {tabs.map((tab_item) => {
              const TabIcon = tab_item.icon
              return (
              <button key={tab_item.key} onClick={() => setTab(tab_item.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 6, border: 'none',
                  background: tab === tab_item.key ? 'var(--white)' : 'transparent',
                  color: tab === tab_item.key ? 'var(--blue)' : 'var(--text-secondary)',
                  fontSize: 13, fontWeight: tab === tab_item.key ? 600 : 400,
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  boxShadow: tab === tab_item.key ? 'var(--shadow-sm)' : 'none',
                  borderLeft: tab === tab_item.key ? '2px solid var(--blue)' : '2px solid transparent',
                }}>
                <TabIcon size={15} />
                {tab_item.label}
              </button>
              )
            })}
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

            {/* PERFIL */}
            {tab === 'perfil' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 800, color: '#fff',
                  }}>{user?.initials || 'U'}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{perfil.nombre}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{perfil.empresa}</p>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 10,
                      background: 'var(--green-bg)', color: 'var(--green)', fontWeight: 600, marginTop: 4, display: 'inline-block',
                    }}>Active Supervisor</span>
                  </div>
                </div>

                {[
                  { label: 'Name', key: 'nombre', type: 'text' },
                  { label: 'Company', key: 'empresa', type: 'text' },
                  { label: 'Email', key: 'email', type: 'email' },
                  { label: 'Shift', key: 'turno', type: 'text' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
                    <input
                      type={type}
                      value={perfil[key]}
                      onChange={e => setPerfil(p => ({ ...p, [key]: e.target.value }))}
                      style={{
                        width: '100%', padding: '9px 12px', borderRadius: 6,
                        border: '1px solid var(--border)', fontSize: 13,
                        color: 'var(--text-primary)', background: 'var(--white)', outline: 'none',
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>
                ))}

                {savedMsg && (
                  <div style={{
                    padding: '9px 14px', borderRadius: 6,
                    background: 'var(--green-bg)', border: '1px solid var(--green)',
                    color: 'var(--green)', fontSize: 13, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <Check size={14} /> {savedMsg}
                  </div>
                )}
                <button onClick={handleGuardar} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '10px 0', borderRadius: 6, border: 'none',
                  background: 'var(--blue)', color: '#fff',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>
                  <Save size={14} />
                  Save changes
                </button>
              </div>
            )}

            {/* NOTIFICACIONES */}
            {tab === 'notificaciones' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                  Choose which events generate a notification for you.
                </p>
                {[
                  { key: 'mensajes', label: 'New messages', desc: 'When a worker sends you a message' },
                  { key: 'ruta', label: 'Route change', desc: 'When a worker\'s route is modified' },
                  { key: 'bateria', label: 'Low battery', desc: 'When a device battery drops below 20%' },
                  { key: 'inactividad', label: 'Inactivity', desc: 'When a worker does not report their position for more than 10 min' },
                ].map(({ key, label, desc }) => (
                  <div key={key} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px', borderRadius: 8,
                    border: '1px solid var(--border)', background: 'var(--bg)',
                  }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{desc}</p>
                    </div>
                    <div
                      onClick={() => setNotif(n => ({ ...n, [key]: !n[key] }))}
                      style={{
                        width: 40, height: 22, borderRadius: 11, cursor: 'pointer',
                        background: notif[key] ? 'var(--blue)' : 'var(--border)',
                        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                      }}>
                      <div style={{
                        position: 'absolute', top: 3,
                        left: notif[key] ? 21 : 3,
                        width: 16, height: 16, borderRadius: '50%',
                        background: '#fff', transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* APARIENCIA */}
            {tab === 'apariencia' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Customize how the application looks.</p>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Theme</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[{ label: 'Light', icon: Sun, val: false }, { label: 'Dark', icon: Moon, val: true }].map((theme) => {
                      const ThemeIcon = theme.icon
                      return (
                        <button key={theme.label} onClick={() => applyTheme(theme.val)}
                          style={{
                            flex: 1, padding: '16px 12px', borderRadius: 8,
                            border: `2px solid ${dark === theme.val ? 'var(--blue)' : 'var(--border)'}`,
                            background: dark === theme.val ? 'var(--blue-light)' : 'var(--bg)',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', gap: 8,
                            color: dark === theme.val ? 'var(--blue)' : 'var(--text-secondary)',
                          }}>
                          <ThemeIcon size={20} />
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{theme.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Language</label>
                  <select style={{
                    width: '100%', padding: '9px 12px', borderRadius: 6,
                    border: '1px solid var(--border)', fontSize: 13,
                    color: 'var(--text-primary)', background: 'var(--white)', outline: 'none',
                  }}>
                    <option>English</option>
                    <option>Spanish (Argentina)</option>
                    <option>Spanish (Spain)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Map refresh interval</label>
                  <select style={{
                    width: '100%', padding: '9px 12px', borderRadius: 6,
                    border: '1px solid var(--border)', fontSize: 13,
                    color: 'var(--text-primary)', background: 'var(--white)', outline: 'none',
                  }}>
                    <option>Every 3 seconds</option>
                    <option>Every 5 seconds</option>
                    <option>Every 10 seconds</option>
                    <option>Every 30 seconds</option>
                  </select>
                </div>
              </div>
            )}

            {/* SEGURIDAD */}
            {tab === 'seguridad' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Manage your account access and security.</p>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passFields.current}
                    onChange={e => setPassFields(p => ({ ...p, current: e.target.value }))}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: 6,
                      border: '1px solid var(--border)', fontSize: 13,
                      color: 'var(--text-primary)', background: 'var(--white)', outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>New password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passFields.nueva}
                    onChange={e => setPassFields(p => ({ ...p, nueva: e.target.value }))}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: 6,
                      border: '1px solid var(--border)', fontSize: 13,
                      color: 'var(--text-primary)', background: 'var(--white)', outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                {passMsg.text && (
                  <div style={{
                    padding: '9px 14px', borderRadius: 6,
                    background: passMsg.ok ? 'var(--green-bg)' : '#FEF2F2',
                    border: `1px solid ${passMsg.ok ? 'var(--green)' : 'var(--red)'}`,
                    color: passMsg.ok ? 'var(--green)' : 'var(--red)',
                    fontSize: 13, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    {passMsg.ok ? <Check size={14} /> : <X size={14} />} {passMsg.text}
                  </div>
                )}
                <button onClick={handleCambiarPassword} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '10px 0', borderRadius: 6, border: 'none',
                  background: 'var(--blue)', color: '#fff',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>
                  <Save size={14} />
                  Change password
                </button>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Active sessions</p>
                  {[
                    { device: 'Chrome — Windows 11', time: 'Now', current: true },
                    { device: 'Safari — iPhone', time: '2 hours ago', current: false },
                  ].map(({ device, time, current }) => (
                    <div key={device} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', borderRadius: 8, marginBottom: 6,
                      background: 'var(--bg)', border: '1px solid var(--border)',
                    }}>
                      <div>
                        <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{device}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{time}</p>
                      </div>
                      {current
                        ? <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'var(--green-bg)', color: 'var(--green)', fontWeight: 600 }}>Current</span>
                        : <button style={{ fontSize: 12, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Close</button>
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  )
}
