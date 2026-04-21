import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Map, MessageSquare, Users, ChevronLeft, ChevronRight, Settings, HelpCircle, Bell, LogOut, Cpu, ClipboardList, FileText, AlertTriangle } from 'lucide-react'
import Logo from './Logo'
import SettingsPanel from './SettingsPanel'
import { useAuth } from '../context/AuthContext'
import { useWorkers } from '../context/WorkersContext'
import { useApp } from '../context/AppContext'
import { useState } from 'react'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { totalUnread } = useWorkers()
  const { activeSOSCount, totalGroupUnread } = useApp()

  const isActive = (path) => location.pathname === path
  const w = collapsed ? 64 : 220

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { to: '/dashboard',  icon: Map,           label: 'Live Map' },
    { to: '/workers',    icon: Users,          label: 'Workers' },
    { to: '/messages',   icon: MessageSquare,  label: 'Messages',  badge: totalUnread + totalGroupUnread },
    { to: '/machinery',  icon: Cpu,            label: 'Machinery' },
    { to: '/attendance', icon: ClipboardList,  label: 'Attendance' },
    { to: '/report',     icon: FileText,       label: 'Daily Report' },
  ]

  const bottomButtons = [
    { icon: AlertTriangle, label: 'SOS Alerts', action: () => navigate('/dashboard'), badge: activeSOSCount, danger: activeSOSCount > 0 },
    { icon: Bell,          label: 'Alerts',     action: null },
    { icon: Settings,      label: 'Settings',   action: () => setShowSettings(true) },
    { icon: HelpCircle,    label: 'Help',       action: null },
    { icon: LogOut,        label: 'Log out',    action: handleLogout, danger: true },
  ]

  return (
    <aside style={{
      width: w, minHeight: '100vh',
      background: 'var(--sidebar-bg)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.2s ease',
      flexShrink: 0, position: 'relative', zIndex: 40,
    }}>
      {/* Logo */}
      <div style={{
        height: 56, display: 'flex', alignItems: 'center',
        padding: collapsed ? '0 10px' : '0 14px',
        borderBottom: '1px solid var(--sidebar-border)',
        overflow: 'hidden', whiteSpace: 'nowrap',
      }}>
        <Logo variant={collapsed ? 'icon' : 'full'} size={collapsed ? 36 : 32} dark />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map((navItem) => {
          const { to, label, badge } = navItem
          const NavIcon = navItem.icon
          const active = isActive(to)
          return (
            <Link key={to} to={to} title={collapsed ? label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '10px 0' : '10px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 6, textDecoration: 'none',
                background: active ? 'var(--sidebar-active)' : 'transparent',
                color: active ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
                fontSize: 13, fontWeight: active ? 600 : 400,
                transition: 'background 0.15s, color 0.15s',
                whiteSpace: 'nowrap', overflow: 'hidden',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--sidebar-hover)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <NavIcon size={18} />
                {badge > 0 && collapsed && (
                  <span style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)', border: '1.5px solid var(--sidebar-bg)' }} />
                )}
              </div>
              {!collapsed && (
                <>
                  <span style={{ flex: 1 }}>{label}</span>
                  {badge > 0 && (
                    <span style={{ background: 'var(--blue)', color: '#fff', fontSize: 11, fontWeight: 600, borderRadius: 10, padding: '1px 7px', lineHeight: '18px' }}>
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '8px 8px 0', borderTop: '1px solid var(--sidebar-border)', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {bottomButtons.map((btn) => {
          const { label, action, danger, badge } = btn
          const BtnIcon = btn.icon
          return (
          <button key={label} onClick={action || undefined} title={collapsed ? label : undefined}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '9px 0' : '9px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 6, border: 'none',
              background: 'transparent',
              color: danger ? (badge > 0 ? '#ef4444' : 'rgba(239,68,68,0.8)') : 'var(--sidebar-text)',
              fontSize: 13, fontWeight: 400, width: '100%',
              cursor: action ? 'pointer' : 'default',
              transition: 'background 0.15s, color 0.15s',
              whiteSpace: 'nowrap', overflow: 'hidden',
            }}
            onMouseEnter={e => {
              if (action) {
                e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.15)' : 'var(--sidebar-hover)'
                if (danger) e.currentTarget.style.color = '#ef4444'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = danger ? (badge > 0 ? '#ef4444' : 'rgba(239,68,68,0.8)') : 'var(--sidebar-text)'
            }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <BtnIcon size={17} />
              {badge > 0 && collapsed && (
                <span style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', border: '1.5px solid var(--sidebar-bg)', animation: 'pulse-dot 1.5s infinite' }} />
              )}
            </div>
            {!collapsed && (
              <>
                <span style={{ flex: 1 }}>{label}</span>
                {badge > 0 && (
                  <span style={{ background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 600, borderRadius: 10, padding: '1px 7px', lineHeight: '18px', animation: 'pulse-dot 1.5s infinite' }}>
                    {badge}
                  </span>
                )}
              </>
            )}
          </button>
          )
        })}

        {/* User profile */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: collapsed ? '12px 0' : '12px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          marginTop: 4, borderTop: '1px solid var(--sidebar-border)',
          overflow: 'hidden', whiteSpace: 'nowrap',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: 'var(--blue)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff',
          }}>{user?.initials || 'U'}</div>
          {!collapsed && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</p>
              <p style={{ fontSize: 11, color: 'var(--sidebar-text)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.company || ''}</p>
            </div>
          )}
        </div>
      </div>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} user={user} />}

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute', top: 18, right: -12,
          width: 24, height: 24, borderRadius: '50%',
          background: 'var(--white)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: 'var(--shadow-md)',
          color: 'var(--text-secondary)', zIndex: 50,
        }}
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </aside>
  )
}
