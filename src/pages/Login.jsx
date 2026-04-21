import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const fillDemo = () => setForm({ email: 'demo@hndfactory.com', password: 'demo123' })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) return setError('Please fill in all fields.')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const result = login(form)
    setLoading(false)
    if (!result.ok) return setError(result.error)
    navigate('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <Link to="/"><Logo variant="full" size={36} /></Link>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--white)', borderRadius: 12,
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)',
          padding: '36px 32px',
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.5px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28 }}>
            Sign in to your H&D Factory panel
          </p>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', borderRadius: 8, marginBottom: 20,
              background: '#FEF2F2', border: '1px solid #FECACA',
              animation: 'fade-in 0.2s ease',
            }}>
              <AlertCircle size={15} style={{ color: 'var(--red)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--red)' }}>{error}</span>
            </div>
          )}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 7,
                  border: '1px solid var(--border)', fontSize: 14,
                  color: 'var(--text-primary)', background: 'var(--white)', outline: 'none',
                  transition: 'border-color 0.15s', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    width: '100%', padding: '10px 40px 10px 12px', borderRadius: 7,
                    border: '1px solid var(--border)', fontSize: 14,
                    color: 'var(--text-primary)', background: 'var(--white)', outline: 'none',
                    transition: 'border-color 0.15s', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-tertiary)', padding: 0,
                  }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '11px 0', borderRadius: 7,
                border: 'none', background: loading ? '#93C5FD' : 'var(--blue)',
                color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.15s', marginTop: 4,
              }}>
              {loading && <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} />}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Demo button */}
          <button onClick={fillDemo}
            style={{
              width: '100%', marginTop: 10, padding: '10px 0', borderRadius: 7,
              border: '1px solid var(--border)', background: 'var(--bg)',
              color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500,
              cursor: 'pointer',
            }}>
            Use demo account
          </button>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--blue)', fontWeight: 600, textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-tertiary)' }}>
          <Link to="/" style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>← Back to home</Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
