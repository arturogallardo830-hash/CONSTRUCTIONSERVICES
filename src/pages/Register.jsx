import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Loader2, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', company: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const validate = () => {
    if (!form.name || !form.email || !form.company || !form.password || !form.confirm)
      return 'Please fill in all fields.'
    if (!form.email.includes('@'))
      return 'Please enter a valid email.'
    if (form.password.length < 6)
      return 'Password must be at least 6 characters.'
    if (form.password !== form.confirm)
      return 'Passwords do not match.'
    return null
  }

  const submit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) return setError(err)
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const result = register(form)
    setLoading(false)
    if (!result.ok) return setError(result.error)
    navigate('/dashboard')
  }

  const fields = [
    { key: 'name', label: 'Full name', type: 'text', placeholder: 'John Smith', autoComplete: 'name' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'john@company.com', autoComplete: 'email' },
    { key: 'company', label: 'Company / Contractor', type: 'text', placeholder: 'South Builders Inc.', autoComplete: 'organization' },
  ]

  const pwStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3
  const strengthColor = ['transparent', 'var(--red)', 'var(--amber)', 'var(--green)'][pwStrength]
  const strengthLabel = ['', 'Weak', 'Medium', 'Strong'][pwStrength]

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <Link to="/"><Logo variant="full" size={36} /></Link>
        </div>

        <div style={{
          background: 'var(--white)', borderRadius: 12,
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)',
          padding: '36px 32px',
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.5px' }}>
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28 }}>
            Start managing your field team today
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
            {fields.map(({ key, label, type, placeholder, autoComplete }) => (
              <div key={key}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
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
            ))}

            {/* Password */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
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
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 0 }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--border)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(pwStrength / 3) * 100}%`, background: strengthColor, transition: 'all 0.3s', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 11, color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Confirm password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={e => set('confirm', e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={{
                    width: '100%', padding: '10px 40px 10px 12px', borderRadius: 7,
                    border: `1px solid ${form.confirm && form.confirm !== form.password ? 'var(--red)' : 'var(--border)'}`,
                    fontSize: 14, color: 'var(--text-primary)', background: 'var(--white)', outline: 'none',
                    transition: 'border-color 0.15s', boxSizing: 'border-box',
                  }}
                  onFocus={e => { if (!form.confirm || form.confirm === form.password) e.target.style.borderColor = 'var(--blue)' }}
                  onBlur={e => { e.target.style.borderColor = form.confirm && form.confirm !== form.password ? 'var(--red)' : 'var(--border)' }}
                />
                {form.confirm && form.confirm === form.password && (
                  <Check size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--green)' }} />
                )}
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
              {loading ? 'Creating account...' : 'Create free account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
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
