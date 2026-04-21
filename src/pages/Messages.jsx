import { useState, useEffect, useRef } from 'react'
import { statusConfig } from '../data/mockData'
import { useWorkers } from '../context/WorkersContext'
import { useApp } from '../context/AppContext'
import { Send, Search, Phone, MapPin, Camera, CheckCheck, Users, X, Megaphone, Check } from 'lucide-react'
import { useSearchParams, Link } from 'react-router-dom'
import TopBar from '../components/TopBar'

function PhotoLightbox({ src, caption, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        padding: 24,
      }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: 20, right: 20,
        width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)',
        border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}>
        <X size={18} />
      </button>
      <img
        src={src} alt={caption || ''}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
      />
      {caption && (
        <p style={{ color: '#fff', marginTop: 12, fontSize: 14, textAlign: 'center', maxWidth: 500 }}>{caption}</p>
      )}
    </div>
  )
}

export default function Messages() {
  const [searchParams] = useSearchParams()
  const { workers, chats, unread, sendMessage, markRead } = useWorkers()
  const { groups, groupChats, sendGroupMessage, markGroupRead } = useApp()

  const initId = parseInt(searchParams.get('worker')) || workers[0]?.id
  const [activeWorkerId, setActiveWorkerId] = useState(initId)
  const [activeGroupId, setActiveGroupId] = useState(null)
  const [tab, setTab] = useState('direct') // direct | groups
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [lightbox, setLightbox] = useState(null)
  const [captionInput, setCaptionInput] = useState('')
  const [pendingPhoto, setPendingPhoto] = useState(null)
  const [isAnnouncement, setIsAnnouncement] = useState(false)
  const endRef = useRef(null)
  const fileInputRef = useRef(null)

  const activeWorker = workers.find(w => w.id === activeWorkerId) || workers[0] || null
  const activeGroup = groups.find(g => g.id === activeGroupId) || null

  useEffect(() => {
    if (activeWorkerId) markRead(activeWorkerId)
  }, [activeWorkerId, markRead])

  useEffect(() => {
    if (activeGroupId) markGroupRead(activeGroupId)
  }, [activeGroupId, markGroupRead])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats, groupChats, activeWorkerId, activeGroupId])

  const send = (e) => {
    e?.preventDefault()
    if (!input.trim()) return
    if (tab === 'direct' && activeWorker) {
      sendMessage(activeWorker.id, input)
    } else if (tab === 'groups' && activeGroup) {
      sendGroupMessage(activeGroup.id, input, isAnnouncement)
    }
    setInput('')
    setIsAnnouncement(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPendingPhoto(ev.target.result)
      setCaptionInput('')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const sendPhoto = () => {
    if (!pendingPhoto) return
    if (tab === 'direct' && activeWorker) {
      sendMessage(activeWorker.id, { type: 'photo', imageUrl: pendingPhoto, caption: captionInput })
    }
    setPendingPhoto(null)
    setCaptionInput('')
  }

  const lastMsg = (id) => {
    const msgs = chats[id] || []
    return msgs[msgs.length - 1]
  }

  const filteredWorkers = workers.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.role.toLowerCase().includes(search.toLowerCase())
  )

  const currentMessages = tab === 'direct'
    ? (chats[activeWorkerId] || [])
    : (groupChats[activeGroupId] || [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar title="Messages" subtitle={`${workers.length} workers`} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: 'var(--bg)' }}>
        {/* Left panel */}
        <div style={{
          width: 300, flexShrink: 0, background: 'var(--white)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Tab switcher */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 16px' }}>
            <button onClick={() => setTab('direct')}
              style={{
                flex: 1, padding: '11px 0', border: 'none', background: 'transparent',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                color: tab === 'direct' ? 'var(--blue)' : 'var(--text-secondary)',
                borderBottom: tab === 'direct' ? '2px solid var(--blue)' : '2px solid transparent',
                marginBottom: -1,
              }}>Direct</button>
            <button onClick={() => setTab('groups')}
              style={{
                flex: 1, padding: '11px 0', border: 'none', background: 'transparent',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                color: tab === 'groups' ? 'var(--blue)' : 'var(--text-secondary)',
                borderBottom: tab === 'groups' ? '2px solid var(--blue)' : '2px solid transparent',
                marginBottom: -1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}>
              <Users size={13} /> Groups
            </button>
          </div>

          {tab === 'direct' && (
            <>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input
                    value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                    style={{ width: '100%', padding: '7px 10px 7px 32px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, background: 'var(--bg)', outline: 'none', color: 'var(--text-primary)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {filteredWorkers.map(worker => {
                  const isActive = activeWorkerId === worker.id
                  const last = lastMsg(worker.id)
                  const cfg = statusConfig[worker.status] || statusConfig['inactivo']
                  const workerUnread = unread[worker.id] || 0
                  return (
                    <div key={worker.id}
                      onClick={() => { setActiveWorkerId(worker.id); markRead(worker.id) }}
                      style={{
                        padding: '11px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                        background: isActive ? 'var(--blue-light)' : 'transparent',
                        borderLeft: isActive ? '3px solid var(--blue)' : '3px solid transparent',
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg)' }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                    >
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                          {worker.avatar}
                        </div>
                        <span style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: cfg.dot, border: '2px solid var(--white)' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                          <span style={{ fontWeight: workerUnread > 0 ? 700 : 600, fontSize: 13, color: 'var(--text-primary)' }}>{worker.name}</span>
                          {last && <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{last.time}</span>}
                        </div>
                        <p style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: workerUnread > 0 ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: workerUnread > 0 ? 500 : 400 }}>
                          {last ? (last.type === 'photo' ? '📷 Photo' : (last.from === 'supervisor' ? '✓ ' : '') + last.text) : worker.role}
                        </p>
                      </div>
                      {workerUnread > 0 && (
                        <span style={{ background: 'var(--blue)', color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 10, padding: '2px 7px', flexShrink: 0 }}>
                          {workerUnread > 9 ? '9+' : workerUnread}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {tab === 'groups' && (
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {groups.map(group => {
                const isActive = activeGroupId === group.id
                const msgs = groupChats[group.id] || []
                const lastGMsg = msgs[msgs.length - 1]
                const typeIcons = { all: '📢', zone: '📍', shift: '🕐' }
                return (
                  <div key={group.id}
                    onClick={() => { setActiveGroupId(group.id); markGroupRead(group.id) }}
                    style={{
                      padding: '11px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                      background: isActive ? 'var(--blue-light)' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--blue)' : '3px solid transparent',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg)' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, background: 'var(--blue-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
                    }}>
                      {typeIcons[group.type] || '💬'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{group.name}</span>
                        {lastGMsg && <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{lastGMsg.time}</span>}
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {lastGMsg ? lastGMsg.text : `${group.members.length} members`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Chat panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {(tab === 'direct' && activeWorker) || (tab === 'groups' && activeGroup) ? (
            <>
              {/* Chat header */}
              <div style={{
                padding: '0 20px', height: 56, flexShrink: 0,
                background: 'var(--white)', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                {tab === 'direct' && activeWorker && (
                  <>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: (statusConfig[activeWorker.status] || statusConfig['inactivo']).bg,
                        color: (statusConfig[activeWorker.status] || statusConfig['inactivo']).color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12,
                      }}>{activeWorker.avatar}</div>
                      <span style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: (statusConfig[activeWorker.status] || statusConfig['inactivo']).dot, border: '2px solid var(--white)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.3 }}>{activeWorker.name}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: (statusConfig[activeWorker.status] || statusConfig['inactivo']).color, fontWeight: 500 }}>
                          {(statusConfig[activeWorker.status] || statusConfig['inactivo']).label}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>· {activeWorker.role}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to="/dashboard" title="View on map"
                        style={{ width: 34, height: 34, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textDecoration: 'none' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-light)'; e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                      >
                        <MapPin size={15} />
                      </Link>
                      <a href={`tel:${activeWorker.phone}`} title={`Call ${activeWorker.phone}`}
                        style={{ width: 34, height: 34, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textDecoration: 'none' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--green-bg)'; e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.color = 'var(--green)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                      >
                        <Phone size={15} />
                      </a>
                    </div>
                  </>
                )}
                {tab === 'groups' && activeGroup && (
                  <>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                      {activeGroup.type === 'all' ? '📢' : activeGroup.type === 'zone' ? '📍' : '🕐'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{activeGroup.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{activeGroup.members.length} members</p>
                    </div>
                  </>
                )}
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 14px' }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)', padding: '2px 10px', borderRadius: 20, background: 'var(--white)', border: '1px solid var(--border)' }}>Today</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>

                {currentMessages.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>
                      {tab === 'direct' ? `Start a conversation with ${activeWorker?.name}` : `Send a message to ${activeGroup?.name}`}
                    </p>
                  </div>
                )}

                {currentMessages.map((msg, i) => {
                  const isSup = msg.from === 'supervisor'
                  const prev = currentMessages[i - 1]
                  const showAvatar = !isSup && (!prev || prev.from !== 'worker')
                  const cfg = activeWorker ? (statusConfig[activeWorker.status] || statusConfig['inactivo']) : null
                  const readByWorker = msg.readBy?.some(r => r.startsWith('worker'))

                  if (msg.isAnnouncement) {
                    return (
                      <div key={msg.id || i} className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
                        <div style={{
                          background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 8,
                          padding: '8px 16px', maxWidth: '70%', display: 'flex', alignItems: 'flex-start', gap: 8,
                        }}>
                          <Megaphone size={13} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#92400E', marginBottom: 2 }}>ANNOUNCEMENT</p>
                            <p style={{ fontSize: 13, color: 'var(--text-primary)' }}>{msg.text}</p>
                            <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 3 }}>{msg.time}</p>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div key={msg.id || i} className="animate-fade-in"
                      style={{ display: 'flex', justifyContent: isSup ? 'flex-end' : 'flex-start', marginBottom: 2 }}>
                      {!isSup && (
                        <div style={{ width: 28, flexShrink: 0, marginRight: 8, display: 'flex', alignItems: 'flex-end' }}>
                          {showAvatar && cfg && (
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 10 }}>
                              {tab === 'groups' ? '👷' : activeWorker?.avatar}
                            </div>
                          )}
                        </div>
                      )}
                      <div style={{ maxWidth: '60%' }}>
                        {msg.type === 'photo' ? (
                          <div style={{
                            borderRadius: isSup ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                            overflow: 'hidden', border: '1px solid var(--border)',
                            background: isSup ? 'var(--blue)' : 'var(--white)',
                            cursor: 'pointer',
                          }}
                            onClick={() => setLightbox({ src: msg.imageUrl, caption: msg.caption })}
                          >
                            <img src={msg.imageUrl} alt={msg.caption || 'Photo'} style={{ display: 'block', width: '100%', maxWidth: 200, height: 140, objectFit: 'cover' }} />
                            {msg.caption && (
                              <p style={{ padding: '6px 10px', fontSize: 12, color: isSup ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)' }}>{msg.caption}</p>
                            )}
                          </div>
                        ) : (
                          <div style={{
                            padding: '9px 14px',
                            borderRadius: isSup ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            background: isSup ? 'var(--blue)' : 'var(--white)',
                            color: isSup ? '#fff' : 'var(--text-primary)',
                            fontSize: 13, lineHeight: 1.5,
                            border: isSup ? 'none' : '1px solid var(--border)',
                            boxShadow: 'var(--shadow-sm)',
                          }}>
                            {msg.text}
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSup ? 'flex-end' : 'flex-start', gap: 4, marginTop: 3 }}>
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{msg.time}</span>
                          {isSup && tab === 'direct' && (
                            readByWorker
                              ? <CheckCheck size={12} style={{ color: 'var(--blue)' }} />
                              : <Check size={12} style={{ color: 'var(--text-tertiary)' }} />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={endRef} />
              </div>

              {/* Pending photo preview */}
              {pendingPhoto && tab === 'direct' && (
                <div style={{ padding: '10px 20px', borderTop: '1px solid var(--border)', background: 'var(--white)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img src={pendingPhoto} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6 }} />
                    <button onClick={() => setPendingPhoto(null)} style={{
                      position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%',
                      background: 'var(--red)', color: '#fff', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <X size={10} />
                    </button>
                  </div>
                  <div style={{ flex: 1, display: 'flex', gap: 8 }}>
                    <input
                      value={captionInput}
                      onChange={e => setCaptionInput(e.target.value)}
                      placeholder="Add a caption..."
                      onKeyDown={e => e.key === 'Enter' && sendPhoto()}
                      style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, outline: 'none', background: 'var(--bg)', color: 'var(--text-primary)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                    <button onClick={sendPhoto} style={{
                      padding: '8px 16px', borderRadius: 6, border: 'none',
                      background: 'var(--blue)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}>
                      Send
                    </button>
                  </div>
                </div>
              )}

              {/* Input bar */}
              <form onSubmit={send}
                style={{
                  padding: '12px 20px', flexShrink: 0,
                  background: 'var(--white)', borderTop: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

                {tab === 'direct' && (
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    title="Send photo"
                    style={{ width: 34, height: 34, borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', cursor: 'pointer', flexShrink: 0 }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-light)'; e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
                  >
                    <Camera size={15} />
                  </button>
                )}

                {tab === 'groups' && (
                  <button type="button"
                    onClick={() => setIsAnnouncement(a => !a)}
                    title="Send as announcement"
                    style={{
                      width: 34, height: 34, borderRadius: 6, border: '1px solid',
                      borderColor: isAnnouncement ? '#F59E0B' : 'var(--border)',
                      background: isAnnouncement ? '#FEF3C7' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isAnnouncement ? '#F59E0B' : 'var(--text-tertiary)', cursor: 'pointer', flexShrink: 0,
                    }}>
                    <Megaphone size={15} />
                  </button>
                )}

                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(e)}
                  placeholder={
                    tab === 'groups' && isAnnouncement
                      ? 'Announcement to all members...'
                      : tab === 'direct' && activeWorker
                        ? `Message to ${activeWorker.name}...`
                        : `Message to ${activeGroup?.name}...`
                  }
                  style={{
                    flex: 1, padding: '9px 14px',
                    border: '1px solid var(--border)', borderRadius: 8,
                    fontSize: 13, color: 'var(--text-primary)',
                    background: 'var(--bg)', outline: 'none',
                    borderColor: isAnnouncement ? '#F59E0B' : 'var(--border)',
                  }}
                  onFocus={e => e.target.style.borderColor = isAnnouncement ? '#F59E0B' : 'var(--blue)'}
                  onBlur={e => e.target.style.borderColor = isAnnouncement ? '#F59E0B' : 'var(--border)'}
                />
                <button type="submit" disabled={!input.trim()}
                  style={{
                    width: 36, height: 36, borderRadius: 6, border: 'none',
                    cursor: input.trim() ? 'pointer' : 'default',
                    background: input.trim() ? 'var(--blue)' : 'var(--bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: input.trim() ? '#fff' : 'var(--text-tertiary)',
                    flexShrink: 0, transition: 'background 0.15s',
                  }}>
                  <Send size={15} />
                </button>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>Select a conversation</p>
            </div>
          )}
        </div>
      </div>

      {lightbox && <PhotoLightbox src={lightbox.src} caption={lightbox.caption} onClose={() => setLightbox(null)} />}
    </div>
  )
}
