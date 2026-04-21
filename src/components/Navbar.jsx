import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MapPin, MessageSquare, Users, Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/dashboard', label: 'Mapa', icon: MapPin },
    { to: '/workers', label: 'Colaboradores', icon: Users },
    { to: '/messages', label: 'Mensajes', icon: MessageSquare },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{ background: 'var(--dark-2)', borderBottom: '1px solid var(--gray)' }}
      className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded flex items-center justify-center"
            style={{ background: 'var(--orange)' }}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <span className="font-display text-2xl tracking-wider" style={{ color: 'var(--text)' }}>
            OBRA<span style={{ color: 'var(--orange)' }}>SYNC</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const NavIcon = link.icon
            return (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all no-underline"
                style={{
                  color: isActive(link.to) ? '#fff' : 'var(--text-dim)',
                  background: isActive(link.to) ? 'var(--orange)' : 'transparent',
                }}
              >
                <NavIcon size={16} />
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* User badge */}
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Supervisor</p>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Turno Mañana</p>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background: 'var(--orange)', color: '#fff' }}>
            SV
          </div>
        </div>

        {/* Mobile menu */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}
          style={{ color: 'var(--text)' }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2"
          style={{ borderTop: '1px solid var(--gray)' }}>
          {links.map((link) => {
            const NavIcon = link.icon
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold no-underline"
                style={{
                  color: isActive(link.to) ? '#fff' : 'var(--text-dim)',
                  background: isActive(link.to) ? 'var(--orange)' : 'var(--dark-3)',
                }}
              >
                <NavIcon size={16} />
                {link.label}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
