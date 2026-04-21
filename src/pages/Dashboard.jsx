import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { statusConfig, zoneTypeConfig, machineStatusConfig } from '../data/mockData'
import { useWorkers } from '../context/WorkersContext'
import { useApp } from '../context/AppContext'
import { Link } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { MapPin, MessageSquare, Battery, Navigation, Search, RefreshCw, Route, AlertTriangle, Cpu, Layers, Trash2, Plus, X } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function createMarkerIcon(status, initials, isSOS = false) {
  const cfg = statusConfig[status] || statusConfig['inactivo']
  const color = isSOS ? '#DF2036' : cfg.color
  return L.divIcon({
    html: `<div style="position:relative;width:38px;height:38px">
      ${isSOS ? `<div style="position:absolute;inset:-6px;border-radius:50%;background:rgba(223,32,54,0.3);animation:sos-ring 1.2s ease-out infinite;"></div>` : ''}
      <div style="width:38px;height:38px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;font-family:Inter,sans-serif;font-weight:700;font-size:11px;color:#fff;">${isSOS ? '🚨' : initials}</div>
      ${status === 'en-ruta' && !isSOS ? `<div style="position:absolute;bottom:0;right:0;width:12px;height:12px;border-radius:50%;background:#0369EA;border:2px solid #fff;"></div>` : ''}
    </div>`,
    className: '', iconSize: [38, 38], iconAnchor: [19, 19],
  })
}

function createMachineIcon() {
  return L.divIcon({
    html: `<div style="width:32px;height:32px;border-radius:8px;background:#1E293B;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;font-size:16px;">🏗️</div>`,
    className: '', iconSize: [32, 32], iconAnchor: [16, 16],
  })
}

function FlyTo({ lat, lng }) {
  const map = useMap()
  useEffect(() => { map.flyTo([lat, lng], 15, { duration: 1 }) }, [lat, lng, map])
  return null
}

function ZonePlacerEvents({ drawing, onPlace }) {
  useMapEvents({
    click(e) {
      if (drawing) onPlace(e.latlng)
    },
  })
  return null
}

function StatusBadge({ status, small }) {
  const cfg = statusConfig[status] || statusConfig['inactivo']
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: small ? '2px 8px' : '3px 10px',
      borderRadius: 20, fontSize: small ? 11 : 12,
      fontWeight: 500, background: cfg.bg, color: cfg.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, display: 'block', flexShrink: 0 }} />
      {cfg.label}
    </span>
  )
}

export default function Dashboard() {
  const { workers, refreshTimestamps, liveAlert, clearLiveAlert } = useWorkers()
  const { zones, addZone, removeZone, machines, activeSOSWorkerIds, triggerSOS } = useApp()
  const [selectedId, setSelectedId] = useState(null)
  const [flyTarget, setFlyTarget] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('todos')
  const [refreshing, setRefreshing] = useState(false)
  const [mapLayer, setMapLayer] = useState('workers') // workers | machinery | all
  const [drawingZone, setDrawingZone] = useState(false)
  const [zoneForm, setZoneForm] = useState({ label: '', type: 'danger', radius: 100 })
  const [showZonePanel, setShowZonePanel] = useState(false)
  const [toast, setToast] = useState(null) // { name }
  const toastTimer = useRef(null)

  useEffect(() => {
    if (!liveAlert) return
    setFlyTarget({ lat: liveAlert.lat, lng: liveAlert.lng })
    setToast({ name: liveAlert.name })
    clearLiveAlert()
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 5000)
  }, [liveAlert, clearLiveAlert])

  const handleSelect = (id) => {
    const isDeselect = selectedId === id
    setSelectedId(isDeselect ? null : id)
    if (!isDeselect) {
      const w = workers.find(w => w.id === id)
      if (w) setFlyTarget({ lat: w.lat, lng: w.lng })
    }
  }

  const handleRefresh = () => {
    refreshTimestamps()
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const handleMapPlace = (latlng) => {
    if (!drawingZone) return
    const cfg = zoneTypeConfig[zoneForm.type]
    addZone({
      label: zoneForm.label || `${cfg.label} ${zones.length + 1}`,
      type: zoneForm.type,
      color: cfg.color,
      fillColor: cfg.color,
      center: [latlng.lat, latlng.lng],
      radius: Number(zoneForm.radius) || 100,
    })
    setDrawingZone(false)
  }

  const filtered = workers.filter(w => {
    const q = search.toLowerCase()
    const matchSearch = w.name.toLowerCase().includes(q) || w.role.toLowerCase().includes(q) || w.route.toLowerCase().includes(q)
    return matchSearch && (filter === 'todos' || w.status === filter)
  })

  const counts = {
    activo: workers.filter(w => w.status === 'activo').length,
    'en-ruta': workers.filter(w => w.status === 'en-ruta').length,
    descanso: workers.filter(w => w.status === 'descanso').length,
  }

  const filterTabs = [
    { key: 'todos', label: `All (${workers.length})` },
    { key: 'activo', label: `On site (${counts.activo})` },
    { key: 'en-ruta', label: `En route (${counts['en-ruta']})` },
    { key: 'descanso', label: `Break (${counts.descanso})` },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar
        title="Live Map"
        subtitle={`${workers.length} workers`}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setShowZonePanel(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)',
                background: showZonePanel ? 'var(--blue-light)' : 'var(--white)',
                color: showZonePanel ? 'var(--blue)' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}>
              <Layers size={13} /> Zones
            </button>
            <button
              onClick={handleRefresh}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 6, border: '1px solid var(--border)',
                background: 'var(--white)', color: 'var(--text-secondary)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}>
              <RefreshCw size={13} style={{ transition: 'transform 0.5s', transform: refreshing ? 'rotate(360deg)' : 'rotate(0deg)' }} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        }
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left panel */}
        <div style={{
          width: 320, flexShrink: 0, background: 'var(--white)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Map layer toggle */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 16px' }}>
            {[
              { key: 'workers', label: 'Workers', icon: '👷' },
              { key: 'machinery', label: 'Machinery', icon: '🏗️' },
              { key: 'all', label: 'All', icon: '📍' },
            ].map(({ key, label, icon }) => (
              <button key={key} onClick={() => setMapLayer(key)}
                style={{
                  padding: '10px 10px', border: 'none', background: 'transparent',
                  fontSize: 12, fontWeight: 500,
                  color: mapLayer === key ? 'var(--blue)' : 'var(--text-secondary)',
                  borderBottom: mapLayer === key ? '2px solid var(--blue)' : '2px solid transparent',
                  marginBottom: -1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                }}>
                <span>{icon}</span>{label}
              </button>
            ))}
          </div>

          {/* Workers list */}
          {mapLayer !== 'machinery' && (
            <>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search worker, site..."
                    style={{
                      width: '100%', padding: '7px 10px 7px 32px',
                      border: '1px solid var(--border)', borderRadius: 6,
                      fontSize: 13, color: 'var(--text-primary)',
                      background: 'var(--bg)', outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 16px', overflowX: 'auto' }}>
                {filterTabs.map(({ key, label }) => (
                  <button key={key} onClick={() => setFilter(key)}
                    style={{
                      padding: '8px 10px', border: 'none', background: 'transparent',
                      fontSize: 11, fontWeight: 500,
                      color: filter === key ? 'var(--blue)' : 'var(--text-secondary)',
                      borderBottom: filter === key ? '2px solid var(--blue)' : '2px solid transparent',
                      marginBottom: -1, cursor: 'pointer', whiteSpace: 'nowrap',
                    }}>
                    {label}
                  </button>
                ))}
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {filtered.map(worker => {
                  const isSelected = selectedId === worker.id
                  const cfg = statusConfig[worker.status] || statusConfig['inactivo']
                  const isSOS = activeSOSWorkerIds.includes(worker.id)
                  return (
                    <div key={worker.id}
                      onClick={() => handleSelect(worker.id)}
                      style={{
                        padding: '11px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                        background: isSOS ? '#FFF5F5' : isSelected ? 'var(--blue-light)' : 'transparent',
                        borderLeft: isSOS ? '3px solid #DF2036' : isSelected ? '3px solid var(--blue)' : '3px solid transparent',
                        transition: 'background 0.1s',
                        animation: isSOS ? 'sos-blink 1.5s ease-in-out infinite' : 'none',
                      }}
                      onMouseEnter={e => { if (!isSelected && !isSOS) e.currentTarget.style.background = 'var(--bg)' }}
                      onMouseLeave={e => { if (!isSelected && !isSOS) e.currentTarget.style.background = 'transparent' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: isSOS ? '#FEE2E2' : cfg.bg,
                            color: isSOS ? '#DF2036' : cfg.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: 12,
                            border: isSOS ? '2px solid #DF2036' : `1.5px solid ${cfg.color}40`,
                          }}>{isSOS ? '🚨' : worker.avatar}</div>
                          <span style={{
                            position: 'absolute', bottom: 0, right: 0,
                            width: 10, height: 10, borderRadius: '50%',
                            background: cfg.dot, border: '2px solid #fff',
                          }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                            <span style={{ fontWeight: 600, fontSize: 13, color: isSOS ? '#DF2036' : 'var(--text-primary)' }}>{worker.name}</span>
                            <StatusBadge status={worker.status} small />
                          </div>
                          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 3 }}>{worker.role}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MapPin size={10} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                            <p style={{ fontSize: 11, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {worker.route}
                            </p>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }} className="animate-fade-in">
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                            <div style={{ padding: '7px 10px', borderRadius: 6, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                              <p style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Battery</p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Battery size={12} style={{ color: worker.battery > 50 ? 'var(--green)' : worker.battery > 20 ? 'var(--amber)' : 'var(--red)' }} />
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{worker.battery}%</span>
                              </div>
                            </div>
                            <div style={{ padding: '7px 10px', borderRadius: 6, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                              <p style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Check-in</p>
                              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>
                                {worker.checkIn
                                  ? worker.checkIn.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                                  : <span style={{ color: 'var(--amber)' }}>Not in</span>}
                              </span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <Link to={`/messages?worker=${worker.id}`}
                              style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: 5, padding: '6px 0', borderRadius: 6,
                                background: 'var(--blue)', color: '#fff',
                                fontSize: 12, fontWeight: 600, textDecoration: 'none',
                              }}>
                              <MessageSquare size={12} /> Message
                            </Link>
                            {!isSOS && (
                              <button
                                onClick={e => { e.stopPropagation(); triggerSOS(worker) }}
                                style={{
                                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  gap: 5, padding: '6px 0', borderRadius: 6,
                                  background: '#FEE2E2', color: '#DF2036',
                                  fontSize: 12, fontWeight: 600, border: '1px solid #DF2036', cursor: 'pointer',
                                }}>
                                <AlertTriangle size={12} /> Test SOS
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                {filtered.length === 0 && (
                  <div style={{ padding: 32, textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>No results found</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Machinery list */}
          {mapLayer === 'machinery' && (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {machines.map(m => {
                const cfg = machineStatusConfig[m.status]
                return (
                  <div key={m.id}
                    onClick={() => setFlyTarget({ lat: m.lat, lng: m.lng })}
                    style={{
                      padding: '12px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8, background: 'var(--bg)',
                        border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                      }}>🏗️</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>{m.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{m.operator} · {m.location}</p>
                      </div>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: cfg.bg, color: cfg.color, fontWeight: 500 }}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <MapContainer
            center={[39.7550, -104.9900]} zoom={13}
            style={{ width: '100%', height: '100%', cursor: drawingZone ? 'crosshair' : undefined }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
            {flyTarget && <FlyTo lat={flyTarget.lat} lng={flyTarget.lng} />}
            <ZonePlacerEvents drawing={drawingZone} onPlace={handleMapPlace} />

            {/* Danger Zones */}
            {zones.map(zone => (
              <Circle
                key={zone.id}
                center={zone.center}
                radius={zone.radius}
                pathOptions={{ color: zone.color, fillColor: zone.fillColor, fillOpacity: 0.12, weight: 2, dashArray: '6,4' }}
              >
                <Popup>
                  <div style={{ padding: '10px 14px', minWidth: 160 }}>
                    <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{zone.label}</p>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: `${zone.color}20`, color: zone.color, fontWeight: 500 }}>
                      {zoneTypeConfig[zone.type]?.label || zone.type}
                    </span>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>Radius: {zone.radius}m</p>
                  </div>
                </Popup>
              </Circle>
            ))}

            {/* Worker markers */}
            {(mapLayer === 'workers' || mapLayer === 'all') && workers.map(worker => {
              const isSOS = activeSOSWorkerIds.includes(worker.id)
              return (
                <Marker
                  key={worker.id}
                  position={[worker.lat, worker.lng]}
                  icon={createMarkerIcon(worker.status, worker.avatar, isSOS)}
                  eventHandlers={{ click: () => handleSelect(worker.id) }}
                >
                  <Popup>
                    <div style={{ padding: '12px 14px', minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: isSOS ? '#FEE2E2' : (statusConfig[worker.status] || statusConfig['inactivo']).bg,
                          color: isSOS ? '#DF2036' : (statusConfig[worker.status] || statusConfig['inactivo']).color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12,
                        }}>{isSOS ? '🚨' : worker.avatar}</div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 14, color: isSOS ? '#DF2036' : 'var(--text-primary)', marginBottom: 2 }}>{worker.name}</p>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{worker.role}</p>
                        </div>
                      </div>
                      <StatusBadge status={worker.status} small />
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={10} /> {worker.route}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )
            })}

            {/* Machinery markers */}
            {(mapLayer === 'machinery' || mapLayer === 'all') && machines.map(m => (
              <Marker key={m.id} position={[m.lat, m.lng]} icon={createMachineIcon()}>
                <Popup>
                  <div style={{ padding: '12px 14px', minWidth: 180 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>🏗️ {m.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Operator: {m.operator}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{m.location}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Zone drawing banner */}
          {drawingZone && (
            <div style={{
              position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
              background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: 8,
              fontWeight: 600, fontSize: 13, boxShadow: 'var(--shadow-md)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Layers size={14} /> Click on the map to place the zone
              <button onClick={() => setDrawingZone(false)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontSize: 12 }}>
                Cancel
              </button>
            </div>
          )}

          {/* Zone Panel */}
          {showZonePanel && (
            <div style={{
              position: 'absolute', top: 12, right: 12, zIndex: 1000,
              background: 'var(--white)', border: '1px solid var(--border)',
              borderRadius: 10, boxShadow: 'var(--shadow-lg)', width: 260,
              overflow: 'hidden',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Danger Zones</span>
                <button onClick={() => setShowZonePanel(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                  <X size={14} />
                </button>
              </div>

              <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  value={zoneForm.label}
                  onChange={e => setZoneForm(f => ({ ...f, label: e.target.value }))}
                  placeholder="Zone name..."
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12, outline: 'none', color: 'var(--text-primary)', background: 'var(--bg)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <select
                    value={zoneForm.type}
                    onChange={e => setZoneForm(f => ({ ...f, type: e.target.value }))}
                    style={{ flex: 1, padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-primary)', background: 'var(--bg)' }}>
                    {Object.entries(zoneTypeConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <input
                    type="number" value={zoneForm.radius}
                    onChange={e => setZoneForm(f => ({ ...f, radius: e.target.value }))}
                    placeholder="Radius (m)"
                    style={{ width: 80, padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12, outline: 'none', color: 'var(--text-primary)', background: 'var(--bg)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
                <button
                  onClick={() => setDrawingZone(true)}
                  style={{
                    padding: '7px 0', borderRadius: 6, border: 'none',
                    background: 'var(--blue)', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                  <Plus size={12} /> Place on map
                </button>
              </div>

              <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                {zones.map(z => (
                  <div key={z.id} style={{
                    padding: '9px 14px', borderBottom: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: z.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{z.label}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{z.radius}m radius</p>
                    </div>
                    <button onClick={() => removeZone(z.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 2, borderRadius: 4 }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legend */}
          <div style={{
            position: 'absolute', bottom: 20, right: showZonePanel ? 284 : 12, zIndex: 1000,
            background: 'var(--white)', borderRadius: 8,
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)',
            padding: '10px 14px', transition: 'right 0.2s',
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</p>
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot }} />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{cfg.label}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 8 }}>
              {Object.entries(zoneTypeConfig).map(([key, cfg]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ width: 12, height: 8, borderRadius: 2, background: `${cfg.color}30`, border: `1.5px dashed ${cfg.color}` }} />
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live worker toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, display: 'flex', alignItems: 'center', gap: 12,
          background: '#0f172a', color: '#fff',
          padding: '14px 22px', borderRadius: 14,
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          border: '1.5px solid #22c55e',
          animation: 'toast-in 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          minWidth: 260,
        }}>
          <span style={{
            width: 10, height: 10, borderRadius: '50%', background: '#22c55e', flexShrink: 0,
            boxShadow: '0 0 0 3px rgba(34,197,94,0.25)',
            animation: 'sos-ring 1.2s ease-out infinite',
          }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', marginBottom: 2 }}>
              Trabajador conectado
            </p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>{toast.name} inició turno · GPS activo</p>
          </div>
          <button
            onClick={() => setToast(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 2px' }}>
            ×
          </button>
        </div>
      )}

      <style>{`
        @keyframes sos-ring {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.95); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1); }
        }
      `}</style>
    </div>
  )
}
