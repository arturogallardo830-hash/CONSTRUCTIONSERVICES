import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const USERS_KEY = 'hnd_users'
const SESSION_KEY = 'hnd_session'

// Seed a demo account on first load
function seedDemo() {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  if (!users.find(u => u.email === 'demo@hndfactory.com')) {
    users.push({
      name: 'Demo Supervisor',
      email: 'demo@hndfactory.com',
      password: 'demo123',
      company: 'H&D Factory',
      role: 'Supervisor',
      initials: 'DS',
    })
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }
}

function makeInitials(name) {
  return name.trim().split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    seedDemo()
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.email) return parsed
      }
    } catch {
      localStorage.removeItem(SESSION_KEY)
    }
    return null
  })
  const loading = false

  function register({ name, email, password, company }) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const newUser = {
      name, email, password, company,
      role: 'Supervisor',
      initials: makeInitials(name),
    }
    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    const session = { name, email, company, role: 'Supervisor', initials: makeInitials(name) }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return { ok: true }
  }

  function login({ email, password }) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) return { ok: false, error: 'Incorrect email or password.' }
    const session = { name: found.name, email: found.email, company: found.company, role: found.role, initials: found.initials }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return { ok: true }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
