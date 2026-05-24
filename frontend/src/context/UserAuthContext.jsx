import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi, setAuthToken } from '../api/client'

// Tokens are stored in sessionStorage (not localStorage).
// sessionStorage is scoped to the browser tab and is never written to disk,
// so it is not accessible to other tabs and is wiped when the tab closes.

const UserAuthContext = createContext(null)

const TOKEN_KEY = 'user_token'

const ss = {
  get:    ()      => { try { return sessionStorage.getItem(TOKEN_KEY) } catch { return null } },
  set:    (v)     => { try { sessionStorage.setItem(TOKEN_KEY, v) } catch {} },
  remove: ()      => { try { sessionStorage.removeItem(TOKEN_KEY) } catch {} },
}

export function UserAuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(() => ss.get())
  const [loading, setLoading] = useState(true)

  const saveSession = useCallback((tokenValue, userData) => {
    ss.set(tokenValue)
    setToken(tokenValue)
    setAuthToken(tokenValue)
    setUser(userData)
  }, [])

  const clearSession = useCallback(() => {
    ss.remove()
    setToken(null)
    setUser(null)
    setAuthToken(null)
  }, [])

  useEffect(() => {
    const stored = ss.get()
    if (!stored) { setLoading(false); return }
    setAuthToken(stored)
    authApi.profile()
      .then((res) => setUser(res.data))
      .catch(() => clearSession())
      .finally(() => setLoading(false))
  }, [clearSession])

  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.profile()
      setUser(res.data)
    } catch {}
  }, [])

  const login = async (email, password) => {
    const res = await authApi.login({ email, password })
    saveSession(res.data.token, { ...res.data.user, email_verified: res.data.email_verified })
    return res.data
  }

  const register = async (name, email, password, passwordConfirmation, phone) => {
    const res = await authApi.register({
      name, email, password, password_confirmation: passwordConfirmation, phone,
    })
    saveSession(res.data.token, { ...res.data.user, email_verified: res.data.email_verified })
    return res.data
  }

  const logout = async () => {
    try { await authApi.logout() } catch {}
    clearSession()
  }

  const isAuthenticated = !!token && !!user
  const isEmailVerified = isAuthenticated && !!user?.email_verified

  return (
    <UserAuthContext.Provider value={{
      user, token, loading,
      isAuthenticated, isEmailVerified,
      login, register, logout, saveSession, refreshUser,
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
