import { useState } from 'react'
import { statusConfig } from '../data/mockData'
import { useWorkers } from '../context/WorkersContext'
import { useApp } from '../context/AppContext'
import { MapPin, MessageSquare, Battery, Navigation, Edit3, Plus, Search, X, Check, Trash2, ChevronDown, LogIn, LogOut, ClipboardList, AlertTriangle, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import TopBar from '../components/TopBar'

const ROLES = ['Mason', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Other']
const SITES = ['Site North', 'Site South', 'Site Center', 'Site East', 'Site West']
const PRIORITIES = ['high', 'medium', 'low']
const emptyForm = { nombre: '', rol: ROLES[0], telefono: '', obra: SITES[0] }
const emptyTask = { title: '', priority: 'medium', dueDate: '' }

const priorityConfig = {
  high:   { label: 'High',   color: '#DF2036', bg: '#FEE2E2' },
  medium: { label: 'Medium', color: '#F59E0B', bg: '#FEF3C7' },
  low:    { label: 'Low',    color: '#0DAB41', bg: '#E8F9EE' },
}

const taskStatusConfig = {
  pending:     { label: 'Pending',     color: '#6B7280', bg: '#F3F4F6' },
  'in-progress': { label: 'In Progress', color: '#0369EA', bg: '#EBF3FF' },
  completed:   { label: 'Completed',   color: '#0DAB41', bg: '#E8F9EE' },
}

function hoursWorked(checkIn) {
  if (!checkIn) return null
  const ms = Date.now() - (checkIn instanceof Date ? checkIn : new Date(checkIn)).getTime()
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return `${h}h ${m}m`
}

export default function Workers() {
  const { workers, addWorker, deleteWorker, updateRoute, updateStatus, checkIn, checkOut } = useWorkers()
  const { addTask, updateTaskStatus, deleteTask, tasksForWorker, pendingCountForWorker, triggerSOS } = useApp()

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [editRoute, setEditRoute] = useState(null)
  const [routeInput, setRouteInput] = useState('')
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [statusDropdown, setStatusDropdown] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [taskPanel, setTaskPanel] = useState(null) // workerId
  const [taskForm, setTaskForm] = useState(emptyTask)
  const [taskFormError, setTaskFormError] = useState('')

  const handleAddWorker = (e) => {
    e.preventDefault()
    if (!form.nombre.trim()) { setFormError('Name is required.'); return }
    addWorker({ name: form.nombre, role: form.rol, phone: form.telefono, site: form.obra })
    setForm(emptyForm)
    setFormError('')
    setShowAddPanel(false)
  }

  const handleAddTask = (e) => {
    e.preventDefault()
    if (!taskForm.title.trim()) { setTaskFormError('Title is required.'); return }
    addTask({ workerId: taskPanel, title: taskForm.title.trim(), priority: taskForm.priority, dueDate: taskForm.dueDate })
    setTaskForm(emptyTask)
    setTaskFormError('')
  }

  const filtered = workers.filter(w => {
    const q = search.toLowerCase()
    return (w.name.toLowerCase().includes(q) || w.role.toLowerCase().includes(q)) &&
      (filterStatus === 'todos' || w.status === filterStatus)
  })

  const saveRoute = (id) => {
    if (!routeInput.trim()) return
    updateRoute(id, routeInput.trim())
    setEditRoute(null)
    setRouteInput('')
  }

  const filterTabs = [
    { key: 'todos', label: 'All' },
    { key: 'activo', label: 'On site' },
    { key: 'en-ruta', label: 'En route' },
    { key: 'descanso', label: 'Break' },
  ]

  const taskWorker = taskPanel ? workers.find(w => w.id === taskPanel) : null
  const workerTasks = taskPanel ? tasksForWorker(taskPanel) : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopBar
        title="Workers"
        subtitle={`${workers.length} registered`}
        actions={
          <button
            onClick={() => { setShowAddPanel(true); setFormError('') }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6, border: 'none', background: 'var(--blue)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={14} /> Add worker
          </button>
        }
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }} onClick={() => setStatusDropdown(null)}>
        {/* Search + filter */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, role..."
              style={{ width: '100%', padding: '8px 10px 8px 32px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, color: 'var(--text-primary)', background: 'var(--white)', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = 'var(--blue)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {filterTabs.map(({ key, label }) => (
              <button key={key} onClick={() => setFilterStatus(key)}
                style={{
                  padding: '7px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  border: '1px solid', borderColor: filterStatus === key ? 'var(--blue)' : 'var(--border)',
                  background: filterStatus === key ? 'var(--blue-light)' : 'var(--white)',
                  color: filterStatus === key ? 'var(--blue)' : 'var(--text-secondary)',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total', value: workers.length, color: 'var(--text-primary)' },
            { label: 'On site', value: workers.filter(w => w.status === 'activo').length, color: 'var(--green)' },
            { label: 'En route', value: workers.filter(w => w.status === 'en-ruta').length, color: 'var(--blue)' },
            { label: 'Checked in', value: workers.filter(w => w.checkIn && !w.checkOut).length, color: 'var(--amber)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding: '14px 18px', borderRadius: 8, background: 'var(--white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 24, fontWeight: 700, color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: 'var(--white)', borderRadius: 8, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 0.8fr 0.8fr 1.6fr 1.8fr', padding: '10px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
            {['Worker', 'Status', 'Battery', 'Check-in', 'Route', 'Actions'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
            ))}
          </div>

          {filtered.map((worker, i) => {
            const cfg = statusConfig[worker.status] || statusConfig['inactivo']
            const isEditing = editRoute === worker.id
            const showDrop = statusDropdown === worker.id
            const pendingTasks = pendingCountForWorker(worker.id)

            return (
              <div key={worker.id}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 1.2fr 0.8fr 0.8fr 1.6fr 1.8fr',
                  padding: '13px 20px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'center', position: 'relative',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Worker name + task badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>
                      {worker.avatar}
                    </div>
                    <span style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: cfg.dot, border: '2px solid var(--white)' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{worker.name}</p>
                      {pendingTasks > 0 && (
                        <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--blue)', color: '#fff', borderRadius: 10, padding: '1px 6px' }}>
                          {pendingTasks} task{pendingTasks > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{worker.role}</p>
                  </div>
                </div>

                {/* Status dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={e => { e.stopPropagation(); setStatusDropdown(showDrop ? null : worker.id) }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px 3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: cfg.bg, color: cfg.color, border: 'none', cursor: 'pointer' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot }} />
                    {cfg.label}
                    <ChevronDown size={11} />
                  </button>
                  {showDrop && (
                    <div onClick={e => e.stopPropagation()}
                      style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 50, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, boxShadow: 'var(--shadow-md)', overflow: 'hidden', minWidth: 130 }}>
                      {Object.entries(statusConfig).map(([key, s]) => (
                        <button key={key}
                          onClick={() => { updateStatus(worker.id, key); setStatusDropdown(null) }}
                          style={{ width: '100%', padding: '8px 12px', background: worker.status === key ? 'var(--blue-light)' : 'transparent', color: worker.status === key ? 'var(--blue)' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}
                          onMouseEnter={e => { if (worker.status !== key) e.currentTarget.style.background = 'var(--bg)' }}
                          onMouseLeave={e => { if (worker.status !== key) e.currentTarget.style.background = 'transparent' }}
                        >
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot }} />
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Battery */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 32, height: 7, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 4, width: `${worker.battery}%`, background: worker.battery > 50 ? 'var(--green)' : worker.battery > 20 ? 'var(--amber)' : 'var(--red)' }} />
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{worker.battery}%</span>
                </div>

                {/* Check-in */}
                <div>
                  {worker.checkIn ? (
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)' }}>
                        {(worker.checkIn instanceof Date ? worker.checkIn : new Date(worker.checkIn)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{hoursWorked(worker.checkIn)}</p>
                    </div>
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--amber)' }}>—</span>
                  )}
                </div>

                {/* Route */}
                <div>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                      <input
                        value={routeInput} onChange={e => setRouteInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveRoute(worker.id); if (e.key === 'Escape') setEditRoute(null) }}
                        autoFocus
                        style={{ flex: 1, padding: '5px 8px', borderRadius: 5, border: '1px solid var(--blue)', fontSize: 12, color: 'var(--text-primary)', outline: 'none', background: 'var(--white)' }}
                      />
                      <button onClick={() => saveRoute(worker.id)} style={{ padding: '4px 7px', borderRadius: 5, border: 'none', background: 'var(--blue)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Check size={12} /></button>
                      <button onClick={() => setEditRoute(null)} style={{ padding: '4px 7px', borderRadius: 5, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={12} /></button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <MapPin size={11} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{worker.route}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {/* Check-in/out */}
                  {!worker.checkIn ? (
                    <button title="Check in" onClick={() => checkIn(worker.id)}
                      style={{ height: 28, padding: '0 8px', borderRadius: 5, border: '1px solid var(--green)', background: 'var(--green-bg)', color: 'var(--green)', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <LogIn size={11} /> In
                    </button>
                  ) : (
                    <button title="Check out" onClick={() => checkOut(worker.id)}
                      style={{ height: 28, padding: '0 8px', borderRadius: 5, border: '1px solid var(--amber)', background: 'var(--amber-bg)', color: '#92400E', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <LogOut size={11} /> Out
                    </button>
                  )}
                  <Link to={`/messages?worker=${worker.id}`} title="Message"
                    style={{ width: 28, height: 28, borderRadius: 5, border: '1px solid var(--border)', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textDecoration: 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-light)'; e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                  >
                    <MessageSquare size={13} />
                  </Link>
                  <button title="Tasks" onClick={() => setTaskPanel(worker.id)}
                    style={{ width: 28, height: 28, borderRadius: 5, border: '1px solid var(--border)', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-light)'; e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                  >
                    <ClipboardList size={13} />
                  </button>
                  <button title="Edit route" onClick={() => { setEditRoute(worker.id); setRouteInput(worker.route) }}
                    style={{ width: 28, height: 28, borderRadius: 5, border: '1px solid var(--border)', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-light)'; e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                  >
                    <Edit3 size={13} />
                  </button>
                  <button title="SOS" onClick={() => triggerSOS(worker)}
                    style={{ width: 28, height: 28, borderRadius: 5, border: '1px solid #DF2036', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DF2036', cursor: 'pointer' }}>
                    <AlertTriangle size={12} />
                  </button>
                  <button title="Delete worker" onClick={() => { if (window.confirm(`Remove ${worker.name}?`)) deleteWorker(worker.id) }}
                    style={{ width: 28, height: 28, borderRadius: 5, border: '1px solid var(--border)', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>No workers found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Worker Panel */}
      {showAddPanel && (
        <>
          <div onClick={() => setShowAddPanel(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, backdropFilter: 'blur(2px)' }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: 'var(--white)', zIndex: 101, display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 30px rgba(0,0,0,0.15)', animation: 'slide-in-right 0.25s ease' }}>
            <div style={{ padding: '0 24px', height: 56, flexShrink: 0, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Add worker</h2>
              <button onClick={() => setShowAddPanel(false)} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={16} /></button>
            </div>
            <form onSubmit={handleAddWorker} style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { label: 'Full name', field: 'nombre', type: 'text', placeholder: 'e.g. John Smith' },
                { label: 'Phone', field: 'telefono', type: 'tel', placeholder: 'e.g. +1 555 123-4567' },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
                  <input type={type} value={form[field]} onChange={e => { setForm(f => ({ ...f, [field]: e.target.value })); setFormError('') }} placeholder={placeholder}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-primary)', background: 'var(--white)', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</label>
                <select value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-primary)', background: 'var(--white)', outline: 'none' }}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assigned site</label>
                <select value={form.obra} onChange={e => setForm(f => ({ ...f, obra: e.target.value }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-primary)', background: 'var(--white)', outline: 'none' }}>
                  {SITES.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              {formError && <p style={{ fontSize: 12, color: 'var(--red)' }}>{formError}</p>}
              <div style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 8 }}>
                <button type="button" onClick={() => setShowAddPanel(false)} style={{ flex: 1, padding: '10px 0', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '10px 0', borderRadius: 6, border: 'none', background: 'var(--blue)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Add</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Tasks Panel */}
      {taskPanel && taskWorker && (
        <>
          <div onClick={() => setTaskPanel(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, backdropFilter: 'blur(2px)' }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 460, background: 'var(--white)', zIndex: 101, display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 30px rgba(0,0,0,0.15)', animation: 'slide-in-right 0.25s ease' }}>
            <div style={{ padding: '0 20px', height: 56, flexShrink: 0, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: (statusConfig[taskWorker.status] || statusConfig['inactivo']).bg, color: (statusConfig[taskWorker.status] || statusConfig['inactivo']).color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>{taskWorker.avatar}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{taskWorker.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Tasks</p>
                </div>
              </div>
              <button onClick={() => setTaskPanel(null)} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={16} /></button>
            </div>

            {/* Add task form */}
            <form onSubmit={handleAddTask} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Task</p>
              <input
                value={taskForm.title}
                onChange={e => { setTaskForm(f => ({ ...f, title: e.target.value })); setTaskFormError('') }}
                placeholder="Task title..."
                style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, outline: 'none', color: 'var(--text-primary)', background: 'var(--bg)' }}
                onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <select value={taskForm.priority} onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))}
                  style={{ flex: 1, padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-primary)', background: 'var(--bg)' }}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{priorityConfig[p].label} Priority</option>)}
                </select>
                <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))}
                  style={{ flex: 1, padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-primary)', background: 'var(--bg)', outline: 'none' }} />
                <button type="submit" style={{ padding: '7px 14px', borderRadius: 6, border: 'none', background: 'var(--blue)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Plus size={12} /> Add
                </button>
              </div>
              {taskFormError && <p style={{ fontSize: 12, color: 'var(--red)' }}>{taskFormError}</p>}
            </form>

            {/* Task list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {workerTasks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>No tasks assigned</p>
                </div>
              )}
              {workerTasks.map(task => {
                const pri = priorityConfig[task.priority]
                const tStatus = taskStatusConfig[task.status]
                const statusKeys = Object.keys(taskStatusConfig)
                const nextStatus = statusKeys[(statusKeys.indexOf(task.status) + 1) % statusKeys.length]
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
                return (
                  <div key={task.id} style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--white)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 20, background: pri.bg, color: pri.color, fontWeight: 600 }}>{pri.label}</span>
                          <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 20, background: tStatus.bg, color: tStatus.color, fontWeight: 500 }}>{tStatus.label}</span>
                          {isOverdue && <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 20, background: '#FEE2E2', color: '#DF2036', fontWeight: 600 }}>Overdue</span>}
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: task.status === 'completed' ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                          {task.title}
                        </p>
                        {task.dueDate && (
                          <p style={{ fontSize: 11, color: isOverdue ? 'var(--red)' : 'var(--text-tertiary)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Calendar size={10} /> {task.dueDate}
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                        {task.status !== 'completed' && (
                          <button onClick={() => updateTaskStatus(task.id, nextStatus)}
                            style={{ fontSize: 11, padding: '4px 10px', borderRadius: 5, border: '1px solid var(--blue)', background: 'var(--blue-light)', color: 'var(--blue)', cursor: 'pointer', fontWeight: 500 }}>
                            {nextStatus === 'in-progress' ? 'Start' : nextStatus === 'completed' ? 'Done' : '→'}
                          </button>
                        )}
                        <button onClick={() => deleteTask(task.id)}
                          style={{ width: 26, height: 26, borderRadius: 5, border: '1px solid var(--border)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      <style>{`@keyframes slide-in-right { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  )
}
