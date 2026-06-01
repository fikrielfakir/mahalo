import { createContext, useContext, useState, useEffect } from 'react'
import { adminAuth } from '../api/adminApi'

// Admin token stored in localStorage for cross-tab and cross-session persistence.
const AuthContext = createContext(null)

const TOKEN_KEY = 'admin_token'

const ss = {
  get:    ()  => { try { return localStorage.getItem(TOKEN_KEY) } catch { return null } },
  set:    (v) => { try { localStorage.setItem(TOKEN_KEY, v) } catch {} },
  remove: ()  => { try { localStorage.removeItem(TOKEN_KEY) } catch {} },
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = ss.get()
    if (token) {
      adminAuth.profile()
        .then((res) => setUser(res.data))
        .catch(() => ss.remove())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await adminAuth.login({ email, password })
    ss.set(res.data.token)
    const profile = await adminAuth.profile()
    setUser(profile.data)
    return profile.data
  }

  const logout = async () => {
    try { await adminAuth.logout() } catch {}
    ss.remove()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
