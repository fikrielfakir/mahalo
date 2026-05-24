import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useUserAuth } from './UserAuthContext'
import { useVerifyEmail } from './VerifyEmailContext'
import { favoritesApi } from '../api/client'

// Favorites are NEVER stored in localStorage.
// - Logged-in users: server is the single source of truth (fetched on mount).
// - Guest users: in-memory only (lost on page refresh — intentional).

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const { isAuthenticated, isEmailVerified } = useUserAuth()
  const { openPopup } = useVerifyEmail()
  const [ids, setIds] = useState([])

  useEffect(() => {
    if (isAuthenticated) {
      favoritesApi.ids()
        .then(r => setIds((r?.data || []).map(Number)))
        .catch(() => {})
    } else {
      setIds([])
    }
  }, [isAuthenticated])

  const toggle = useCallback(async (propertyId) => {
    const numId = Number(propertyId)
    if (isAuthenticated) {
      if (!isEmailVerified) { openPopup(); return }
      try {
        const r = await favoritesApi.toggle(numId)
        setIds((r?.data?.ids || []).map(Number))
      } catch {}
    } else {
      setIds(prev =>
        prev.includes(numId) ? prev.filter(id => id !== numId) : [...prev, numId]
      )
    }
  }, [isAuthenticated, isEmailVerified, openPopup])

  const isFavorited = useCallback((propertyId) => ids.includes(Number(propertyId)), [ids])

  return (
    <FavoritesContext.Provider value={{ ids, toggle, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider')
  return ctx
}
