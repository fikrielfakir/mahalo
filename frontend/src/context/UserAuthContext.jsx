import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi, setAuthToken } from '../api/client'

const UserAuthContext = createContext(null)

const TOKEN_KEY = 'user_token'

export function UserAuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  const saveSession = useCallback((tokenValue, userData) => {
    localStorage.setItem(TOKEN_KEY, tokenValue)
    setToken(tokenValue)
    setAuthToken(tokenValue)
    setUser(userData)
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    setAuthToken(null)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (!stored) { setLoading(false); return }
    setAuthToken(stored)
    authApi.profile()
      .then((res) => setUser(res.data))
      .catch(() => clearSession())
      .finally(() => setLoading(false))
  }, [clearSession])

  const login = async (email, password) => {
    const res = await authApi.login({ email, password })
    saveSession(res.data.token, res.data.user)
    return res.data
  }

  const register = async (name, email, password, passwordConfirmation, phone) => {
    const res = await authApi.register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      phone,
    })
    saveSession(res.data.token, res.data.user)
    return res.data
  }

  const logout = async () => {
    try { await authApi.logout() } catch {}
    clearSession()
  }

  const isAuthenticated  = !!token && !!user
  const isEmailVerified  = isAuthenticated && !!user?.email_verified

  return (
    <UserAuthContext.Provider value={{
      user, token, loading,
      isAuthenticated, isEmailVerified,
      login, register, logout,
    }}>
      {children}
    </UserAuthContext.Provider>
  )
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext)
  if (!ctx) throw new Error('useUserAuth must be used inside UserAuthProvider')
  return ctx
}
