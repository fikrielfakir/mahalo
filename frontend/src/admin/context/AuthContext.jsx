import { createContext, useContext, useState, useEffect } from 'react'
import { adminAuth } from '../api/adminApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      adminAuth.profile()
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('admin_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await adminAuth.login({ email, password })
    localStorage.setItem('admin_token', res.data.token)
    const profile = await adminAuth.profile()
    setUser(profile.data)
    return profile.data
  }

  const logout = async () => {
    try { await adminAuth.logout() } catch {}
    localStorage.removeItem('admin_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
