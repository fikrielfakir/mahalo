import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi, setAuthToken } from '../api/client'

// Tokens are stored in localStorage so they persist across tabs and browser restarts.
// A 'storage' event listener keeps all open tabs in sync automatically.

const UserAuthContext = createContext(null)

const TOKEN_KEY = 'user_token'

const ls = {
  get:    ()  => { try { return localStorage.getItem(TOKEN_KEY) } catch { return null } },
  set:    (v) => { try { localStorage.setItem(TOKEN_KEY, v) } catch {} },
  remove: ()  => { try { localStorage.removeItem(TOKEN_KEY) } catch {} },
}

export function UserAuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(() => ls.get())
  const [loading, setLoading] = useState(true)

  const saveSession = useCallback((tokenValue, userData) => {
    ls.set(tokenValue)
    setToken(tokenValue)
    setAuthToken(tokenValue)
    setUser(userData)
  }, [])

  const clearSession = useCallback(() => {
    ls.remove()
    setToken(null)
    setUser(null)
    setAuthToken(null)
  }, [])

  // Boot: validate stored token against API
  useEffect(() => {
    const stored = ls.get()
    if (!stored) { setLoading(false); return }
    setAuthToken(stored)
    authApi.profile()
      .then((res) => { setToken(stored); setUser(res.data) })
      .catch(() => clearSession())
      .finally(() => setLoading(false))
  }, [clearSession])

  // Cross-tab sync: when another tab logs in or out, mirror the state here
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== TOKEN_KEY) return
      const newToken = e.newValue
      if (!newToken) {
        // Logged out in another tab
        setToken(null)
        setUser(null)
        setAuthToken(null)
      } else {
        // Logged in (or token refreshed) in another tab
        setAuthToken(newToken)
        setToken(newToken)
        authApi.profile()
          .then((res) => setUser(res.data))
          .catch(() => clearSession())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
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
