import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { machineStatusConfig } from '../data/mockData'
import TopBar from '../components/TopBar'
import { Cpu, Clock, Wrench, MapPin, ChevronDown, X, Check } from 'lucide-react'

const STATUS_OPTIONS = Object.entries(machineStatusConfig)

function hoursUntilMaintenance(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const days = Math.ceil((d - now) / 86400000)
  if (days < 0) return { label: 'Overdue', color: 'var(--red)' }
  if (days === 0) return { label: 'Today', color: 'var(--red)' }
  if (days <= 7) return { label: `${days}d`, color: 'var(--amber)' }
  return { label: `${days}d`, color: 'var(--green)' }
}

export default function Machinery() {
  const { machines, updateMachine } = useApp()
  const [statusDropdown, setStatusDropdown] = useState(null)
  const [editPanel, setEditPanel] = useState(null)
  const [editForm, setEditForm] = useState({})

  const totalOperating = machines.filter(m => m.status === 'operating').length
  const totalMaintenance = machines.filter(m => m.status === 'maintenance').length
  const totalOutOfService = machines.filter(m => m.status === 'out-of-service').length
  const totalAvailable = machines.filter(m => m.status === 'available').length

  const openEdit = (machine) => {
    setEditForm({ operator: machine.operator, location: machine.location, hoursUsed: machine.hoursUsed, nextMaintenance: machine.nextMaintenance })
    setEditPanel(machine.id)
  }

  const saveEdit = () => {
    if (!editPanel) return
    updateMachine(editPanel, {
      operator: editForm.operator,
      location: editForm.location,
      hoursUsed: Number(editForm.hoursUsed),
      nextMaintenance: editForm.nextMaintenance,
    })
    setEditPanel(null)
  }

  const editMachine = machines.find(m => m.id === editPanel)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopBar title="Machinery" subtitle={`${machines.length} units`} />

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }} onClick={() => setStatusDropdown(null)}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Operating',       value: totalOperating,    color: 'var(--green)' },
            { label: 'In Maintenance',  value: totalMaintenance,  color: 'var(--amber)' },
            { label: 'Out of Service',  value: totalOutOfService, color: 'var(--red)' },
            { label: 'Available',       value: totalAvailable,    color: 'var(--blue)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding: '14px 18px', borderRadius: 8, background: 'var(--white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Machine cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {machines.map(machine => {
            const cfg = machineStatusConfig[machine.status]
            const maint = hoursUntilMaintenance(machine.nextMaintenance)
            const showDrop = statusDropdown === machine.id

            return (
              <div key={machine.id}
                style={{ background: 'var(--white)', borderRadius: 10, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                      🏗️
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{machine.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>ID: {machine.id}</p>
                    </div>
                  </div>

                  {/* Status dropdown */}
                  <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setStatusDropdown(showDrop ? null : machine.id)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: cfg.bg, color: cfg.color, border: 'none', cursor: 'pointer' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color }} />
                      {cfg.label}
                      <ChevronDown size={11} />
                    </button>
                    {showDrop && (
                      <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 50, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, boxShadow: 'var(--shadow-md)', overflow: 'hidden', minWidth: 150 }}>
                        {STATUS_OPTIONS.map(([key, s]) => (
                          <button key={key}
                            onClick={() => { updateMachine(machine.id, { status: key }); setStatusDropdown(null) }}
                            style={{ width: '100%', padding: '8px 12px', background: machine.status === key ? 'var(--blue-light)' : 'transparent', color: machine.status === key ? 'var(--blue)' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}
                            onMouseEnter={e => { if (machine.status !== key) e.currentTarget.style.background = 'var(--bg)' }}
                            onMouseLeave={e => { if (machine.status !== key) e.currentTarget.style.background = 'transparent' }}
                          >
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Info grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Operator</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{machine.operator}</p>
                  </div>
                  <div style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={9} /> Hours Used
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{machine.hoursUsed}h</p>
                  </div>
                  <div style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Wrench size={9} /> Next Maint.
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: maint.color }}>
                      {machine.nextMaintenance} <span style={{ fontSize: 11 }}>({maint.label})</span>
                    </p>
                  </div>
                  <div style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={9} /> Location
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{machine.location}</p>
                  </div>
                </div>

                {/* Hours usage bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Usage until maintenance</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: machine.hoursUsed > 300 ? 'var(--red)' : machine.hoursUsed > 150 ? 'var(--amber)' : 'var(--green)' }}>
                      {machine.hoursUsed}h / 400h
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, width: `${Math.min((machine.hoursUsed / 400) * 100, 100)}%`, background: machine.hoursUsed > 300 ? 'var(--red)' : machine.hoursUsed > 150 ? 'var(--amber)' : 'var(--green)', transition: 'width 0.4s ease' }} />
                  </div>
                </div>

                {/* Edit button */}
                <button onClick={() => openEdit(machine)}
                  style={{ padding: '7px 0', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-light)'; e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                >
                  <Wrench size={13} /> Edit Details
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Edit panel */}
      {editPanel && editMachine && (
        <>
          <div onClick={() => setEditPanel(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, backdropFilter: 'blur(2px)' }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 400, background: 'var(--white)', zIndex: 101, display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 30px rgba(0,0,0,0.15)', animation: 'slide-in-right 0.25s ease' }}>
            <div style={{ padding: '0 20px', height: 56, flexShrink: 0, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>🏗️</span>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{editMachine.name}</p>
              </div>
              <button onClick={() => setEditPanel(null)} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={16} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Operator', field: 'operator', type: 'text' },
                { label: 'Location', field: 'location', type: 'text' },
                { label: 'Hours Used', field: 'hoursUsed', type: 'number' },
                { label: 'Next Maintenance', field: 'nextMaintenance', type: 'date' },
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
                  <input
                    type={type}
                    value={editForm[field] || ''}
                    onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-primary)', background: 'var(--white)', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              ))}
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
              <button onClick={() => setEditPanel(null)} style={{ flex: 1, padding: '10px 0', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveEdit} style={{ flex: 1, padding: '10px 0', borderRadius: 6, border: 'none', background: 'var(--blue)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Check size={14} /> Save
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`@keyframes slide-in-right { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  )
}
