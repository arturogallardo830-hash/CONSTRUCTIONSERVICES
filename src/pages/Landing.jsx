import { Link } from 'react-router-dom'
import {
  MapPin, MessageSquare, Route, Shield, Activity, Users,
  ArrowRight, Check, Star, Menu, X,
  Zap, BarChart3, Smartphone
} from 'lucide-react'
import Logo from '../components/Logo'
import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Features', href: '#funciones' },
  { label: 'How it works', href: '#como-funciona' },
  { label: 'Pricing', href: '#precios' },
  { label: 'Testimonials', href: '#testimonios' },
]

const FEATURES = [
  { icon: MapPin, title: 'Live GPS Tracking', desc: 'Location updated every 5 seconds. See every worker on the map with their status, speed and battery level in real time.', color: '#0369EA' },
  { icon: MessageSquare, title: 'Instant Messaging', desc: 'Direct chat with each worker, just like WhatsApp. Send instructions, alerts and updates instantly from the dashboard.', color: '#0DAB41' },
  { icon: Route, title: 'Route Management', desc: 'Assign and modify each worker’s routes in real time. Changes are reflected immediately on the worker’s device.', color: '#7C3AED' },
  { icon: Activity, title: 'Real-time Status', desc: 'Status monitoring per worker: on site, en route or on break. Complete shift activity history.', color: '#F59E0B' },
  { icon: Shield, title: 'Access Control', desc: 'Differentiated roles for supervisors and workers. Each user only sees the information relevant to them.', color: '#DF2036' },
  { icon: BarChart3, title: 'Daily Reports', desc: 'Automatic end-of-day summary: routes traveled, time on site and messaging activity per worker.', color: '#1DCAD3' },
]

const STEPS = [
  { num: '01', icon: Users, title: 'Register your team', desc: 'Enter each worker’s details in minutes. Name, role, assigned site and contact info.' },
  { num: '02', icon: Smartphone, title: 'Enable tracking', desc: 'Each worker installs the app on their phone and enables location. Done, they are on the map.' },
  { num: '03', icon: Zap, title: 'Control in real time', desc: 'View your whole team from the dashboard, send messages and manage routes with a single click.' },
]

const PLANS = [
  {
    name: 'Basic',
    price: 'Free',
    period: '',
    desc: 'Perfect for small sites.',
    cta: 'Get started free',
    popular: false,
    features: ['Up to 5 workers', 'Live GPS tracking', 'Basic messaging', 'Interactive map', '7-day history'],
    disabled: ['Advanced route management', 'Automatic reports', 'Priority support'],
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mes',
    desc: 'For growing teams.',
    cta: 'Try free for 14 days',
    popular: true,
    features: ['Up to 25 workers', 'Live GPS tracking', 'Messaging + files', 'Route management', 'Automatic reports', '90-day history', 'Priority support'],
    disabled: [],
  },
  {
    name: 'Enterprise',
    price: 'Contact us',
    period: '',
    desc: 'For companies with multiple sites.',
    cta: 'Contact sales',
    popular: false,
    features: ['Unlimited workers', 'Unlimited sites', 'All Pro features', 'Custom dashboard', 'HR integration', 'Guaranteed SLA', 'Dedicated account manager'],
    disabled: [],
  },
]

const TESTIMONIALS = [
  { quote: 'We used to lose half an hour per shift trying to locate the guys. With H&D Factory we have everything in real time. The difference is enormous.', name: 'Martín Cabrera', role: 'Site Manager', company: 'Cabrera Construcciones', initials: 'MC', color: '#0369EA' },
  { quote: 'What I liked most was the chat. I can send a message to any worker instantly, without calling. No instruction gets lost anymore.', name: 'Ana Soria', role: 'Project Supervisor', company: 'Obras & Proyectos SRL', initials: 'AS', color: '#0DAB41' },
  { quote: 'We had a serious problem with arrival times. Since we started using tracking, delays dropped by 60%. The daily reports are a lifesaver.', name: 'Jorge Villalba', role: 'Operations Director', company: 'VH Ingeniería', initials: 'JV', color: '#7C3AED' },
]

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: 'var(--text-primary)' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)', height: 64,
        display: 'flex', alignItems: 'center', padding: '0 40px',
      }}>
        <Link to="/" style={{ textDecoration: 'none', marginRight: 48, flexShrink: 0 }}>
          <Logo variant="full" size={32} />
        </Link>

        {/* Desktop links */}
        <div className="nav-desktop-links" style={{ flex: 1, display: 'flex', gap: 6 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} style={{
              padding: '6px 14px', borderRadius: 6, fontSize: 14, fontWeight: 500,
              color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.target.style.color = 'var(--text-primary)'; e.target.style.background = 'var(--bg)' }}
              onMouseLeave={e => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'transparent' }}>
              {label}
            </a>
          ))}
        </div>

        <div className="nav-desktop-links" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link to="/login" style={{
            padding: '8px 18px', borderRadius: 7, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--text-primary)',
            fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            Sign in
          </Link>
          <Link to="/register" style={{
            padding: '8px 18px', borderRadius: 7, border: 'none',
            background: 'var(--blue)', color: '#fff',
            fontSize: 14, fontWeight: 600, textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(3,105,234,0.3)', transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--blue)'}>
            Try for free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="nav-mobile-btn"
          onClick={() => setMenuOpen(v => !v)}
          style={{
            display: 'none', width: 36, height: 36, borderRadius: 6,
            border: '1px solid var(--border)', background: 'transparent',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-primary)', marginLeft: 'auto',
          }}>
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 49,
          background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 24px 20px',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '10px 12px', borderRadius: 6, fontSize: 15, fontWeight: 500,
                color: 'var(--text-primary)', textDecoration: 'none',
              }}>
              {label}
            </a>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 8, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <Link to="/login" onClick={() => setMenuOpen(false)}
              style={{
                flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 7,
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text-primary)', fontSize: 14, fontWeight: 500, textDecoration: 'none',
              }}>
              Sign in
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}
              style={{
                flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 7,
                border: 'none', background: 'var(--blue)', color: '#fff',
                fontSize: 14, fontWeight: 600, textDecoration: 'none',
              }}>
              Try for free
            </Link>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto', padding: '120px 32px 72px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 14px', borderRadius: 20, marginBottom: 28,
          background: 'var(--blue-light)', border: '1px solid #BFDBFE',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)', display: 'block', animation: 'pulse-dot 2s infinite' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--blue)' }}>Construction workforce tracking platform</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 900,
          color: 'var(--navy)', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 22,
        }}>
          Control your field team<br />
          <span style={{ color: 'var(--blue)' }}>in real time</span>
        </h1>

        <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 36px', fontWeight: 400 }}>
          Track workers, send messages and manage routes from a single dashboard.
          Everything you need to keep your site under control.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 26px', borderRadius: 8,
            background: 'var(--blue)', color: '#fff',
            fontSize: 15, fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(3,105,234,0.35)', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-hover)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--blue)'; e.currentTarget.style.transform = 'translateY(0)' }}>
            Get started free <ArrowRight size={18} />
          </Link>
          <Link to="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 26px', borderRadius: 8,
            background: 'var(--white)', color: 'var(--text-primary)',
            fontSize: 15, fontWeight: 600, textDecoration: 'none',
            border: '1px solid var(--border)', transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--white)'}>
            View demo
          </Link>
        </div>

        {/* Social proof numbers */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 48, marginTop: 64,
          paddingTop: 48, borderTop: '1px solid var(--border)', flexWrap: 'wrap',
        }}>
          {[
            { value: '+500', label: 'Companies trust us' },
            { value: '+8,000', label: 'Workers tracked' },
            { value: '99.9%', label: 'Guaranteed uptime' },
            { value: '< 5s', label: 'Update latency' },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.5px', marginBottom: 4 }}>{value}</p>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)', maxWidth: 120 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── APP SCREENSHOT MOCKUP ── */}
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px 80px' }}>
        <div style={{
          borderRadius: 14, border: '1px solid var(--border)',
          boxShadow: '0 24px 80px rgba(0,38,62,0.12)',
          overflow: 'hidden', background: 'var(--white)',
        }}>
          {/* Topbar mockup */}
          <div style={{ height: 52, background: 'var(--navy)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#FF5F57','#FFBD2E','#28C940'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <Logo variant="full" size={26} dark />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {['Live Map', 'Workers', 'Messages'].map((t, i) => (
                <span key={t} style={{ fontSize: 12, color: i === 0 ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: i === 0 ? 600 : 400 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* App body mockup */}
          <div style={{ display: 'flex', height: 400 }}>
            {/* Sidebar mockup */}
            <div style={{ width: 56, background: 'var(--navy)', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, gap: 8 }}>
              {[MapPin, Users, MessageSquare, Shield].map((Icon, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: i === 0 ? 'rgba(255,255,255,0.15)' : 'transparent' }}>
                  <Icon size={18} color={i === 0 ? '#fff' : 'rgba(255,255,255,0.4)'} />
                </div>
              ))}
            </div>

            {/* Worker list mockup */}
            <div style={{ width: 260, background: 'var(--white)', borderRight: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                <div style={{ height: 8, borderRadius: 4, background: 'var(--border)', width: '70%' }} />
              </div>
              {[
                { av: 'CM', name: 'Carlos Méndez', role: 'Mason', status: 'activo', color: '#0DAB41' },
                { av: 'LF', name: 'Luis Fernández', role: 'Electrician', status: 'en-ruta', color: '#0369EA' },
                { av: 'MT', name: 'Miguel Torres', role: 'Plumber', status: 'activo', color: '#0DAB41' },
                { av: 'RS', name: 'Roberto Silva', role: 'Carpenter', status: 'descanso', color: '#F59E0B' },
                { av: 'DR', name: 'Diego Ramírez', role: 'Painter', status: 'en-ruta', color: '#0369EA' },
              ].map((w, i) => (
                <div key={w.name} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                  borderBottom: '1px solid var(--border)',
                  background: i === 1 ? 'var(--blue-light)' : 'transparent',
                  borderLeft: i === 1 ? '2px solid var(--blue)' : '2px solid transparent',
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: w.color + '20', color: w.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{w.av}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 1 }}>{w.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{w.role}</p>
                  </div>
                  <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 10, background: w.color + '18', color: w.color, fontWeight: 600, flexShrink: 0 }}>
                    {w.status === 'activo' ? 'On site' : w.status === 'en-ruta' ? 'En route' : 'Break'}
                  </span>
                </div>
              ))}
            </div>

            {/* Map area mockup */}
            <div style={{ flex: 1, background: '#E8EDF2', position: 'relative', overflow: 'hidden' }}>
              {/* Grid lines */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(0,38,62,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,38,62,0.06) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />
              {/* Map pins */}
              {[
                { top: '35%', left: '30%', color: '#0DAB41', label: 'CM' },
                { top: '55%', left: '55%', color: '#0369EA', label: 'LF' },
                { top: '25%', left: '65%', color: '#0DAB41', label: 'MT' },
                { top: '70%', left: '40%', color: '#F59E0B', label: 'RS' },
                { top: '45%', left: '75%', color: '#0369EA', label: 'DR' },
              ].map(({ top, left, color, label }) => (
                <div key={label} style={{ position: 'absolute', top, left, transform: 'translate(-50%,-50%)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: color, border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>{label}</div>
                </div>
              ))}
              {/* Live badge */}
              <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: '#E8F9EE', border: '1px solid #BBF7D0' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0DAB41', display: 'block', animation: 'pulse-dot 2s infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0DAB41' }}>LIVE</span>
              </div>
              {/* Popup */}
              <div style={{ position: 'absolute', top: '52%', left: '50%', background: '#fff', borderRadius: 8, border: '1px solid var(--border)', padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', minWidth: 160 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0369EA20', color: '#0369EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>LF</div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Luis Fernández</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>35 km/h · En route</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="funciones" style={{ background: 'var(--bg)', padding: '80px 32px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Features</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.8px', marginTop: 10, marginBottom: 14 }}>
              Everything you need to manage your site
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto' }}>
              Designed specifically for supervisors and site managers. Simple to use, powerful in results.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {FEATURES.map((feat) => {
              const FeatIcon = feat.icon
              return (
              <div key={feat.title} style={{
                background: 'var(--white)', borderRadius: 12, padding: '28px 24px',
                border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: feat.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <FeatIcon size={22} style={{ color: feat.color }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>{feat.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{feat.desc}</p>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="como-funciona" style={{ padding: '80px 32px', background: 'var(--white)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>How it works</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.8px', marginTop: 10 }}>
              Get started in less than 5 minutes
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
            {STEPS.map((step) => {
              const StepIcon = step.icon
              return (
              <div key={step.num} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
                  background: 'var(--blue)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexDirection: 'column',
                  boxShadow: '0 0 0 6px var(--white), 0 0 0 8px var(--blue-mid)',
                }}>
                  <StepIcon size={28} color="#fff" />
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', letterSpacing: '1px', marginBottom: 8 }}>{step.num}</p>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{step.desc}</p>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="precios" style={{ padding: '80px 32px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1020, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Pricing</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.8px', marginTop: 10, marginBottom: 14 }}>
              Simple, transparent plans
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>No surprises. Cancel anytime.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, alignItems: 'start' }}>
            {PLANS.map(({ name, price, period, desc, cta, popular, features, disabled }) => (
              <div key={name} style={{
                background: 'var(--white)', borderRadius: 12, padding: '32px 28px',
                border: popular ? '2px solid var(--blue)' : '1px solid var(--border)',
                boxShadow: popular ? '0 8px 32px rgba(3,105,234,0.15)' : 'var(--shadow-sm)',
                position: 'relative',
              }}>
                {popular && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--blue)', color: '#fff', fontSize: 11, fontWeight: 700,
                    padding: '4px 14px', borderRadius: 20, letterSpacing: '0.5px',
                  }}>MOST POPULAR</div>
                )}
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 6 }}>
                  <span style={{ fontSize: price === 'Free' || price === 'Contact us' ? 28 : 36, fontWeight: 800, color: 'var(--navy)', letterSpacing: '-1px' }}>{price}</span>
                  {period && <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{period}</span>}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>{desc}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={11} style={{ color: 'var(--green)' }} />
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{f}</span>
                    </div>
                  ))}
                  {disabled.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.4 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)', flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link to="/register" style={{
                  display: 'block', textAlign: 'center', padding: '11px 0', borderRadius: 7,
                  background: popular ? 'var(--blue)' : 'var(--bg)',
                  color: popular ? '#fff' : 'var(--text-primary)',
                  border: popular ? 'none' : '1px solid var(--border)',
                  fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = popular ? 'var(--blue-hover)' : 'var(--border)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = popular ? 'var(--blue)' : 'var(--bg)' }}>
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonios" style={{ padding: '80px 32px', background: 'var(--white)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Testimonials</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.8px', marginTop: 10 }}>
              What our customers say
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map(({ quote, name, role, company, initials, color }) => (
              <div key={name} style={{
                background: 'var(--white)', borderRadius: 12, padding: '28px 24px',
                border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#F59E0B" style={{ color: '#F59E0B' }} />)}
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                  "{quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: color + '20', color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{initials}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{role} · {company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '80px 32px', background: 'var(--navy)', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: 16 }}>
            Start managing your site today
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', marginBottom: 36, lineHeight: 1.6 }}>
            Sign up free in less than 2 minutes. No credit card required.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 8,
              background: 'var(--blue)', color: '#fff',
              fontSize: 15, fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(3,105,234,0.5)', transition: 'all 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--blue)'}>
              Create free account <ArrowRight size={18} />
            </Link>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 8,
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              fontSize: 15, fontWeight: 600, textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#001A2C', padding: '48px 32px 32px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div>
              <Logo variant="full" size={32} dark />
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 14, lineHeight: 1.7, maxWidth: 260 }}>
                Real-time tracking and management platform for construction teams.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Product</p>
              {['Features', 'How it works', 'Pricing', 'Testimonials'].map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                  {l}
                </a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Account</p>
              {[['Sign in', '/login'], ['Register', '/register'], ['Support', '#'], ['Privacy', '#']].map(([l, href]) => (
                <Link key={l} to={href} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                  {l}
                </Link>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>© 2026 H&D Factory. All rights reserved.</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Built for the construction industry</p>
          </div>
        </div>
      </footer>

    </div>
  )
}