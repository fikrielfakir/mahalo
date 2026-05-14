import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useUserAuth } from './UserAuthContext'
import { useVerifyEmail } from './VerifyEmailContext'
import { favoritesApi } from '../api/client'

const LS_KEY = 'mahalo_favorites'

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || [] } catch { return [] }
}

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const { isAuthenticated, isEmailVerified } = useUserAuth()
  const { openPopup } = useVerifyEmail()
  const [ids, setIds] = useState(loadLocal)

  useEffect(() => {
    if (isAuthenticated) {
      favoritesApi.ids()
        .then(r => {
          const backendIds = (r?.data || []).map(Number)
          setIds(backendIds)
          localStorage.setItem(LS_KEY, JSON.stringify(backendIds))
        })
        .catch(() => {})
    } else {
      setIds(loadLocal())
    }
  }, [isAuthenticated])

  const toggle = useCallback(async (propertyId) => {
    const numId = Number(propertyId)
    if (isAuthenticated) {
      if (!isEmailVerified) {
        openPopup()
        return
      }
      try {
        const r = await favoritesApi.toggle(numId)
        const newIds = (r?.data?.ids || []).map(Number)
        setIds(newIds)
        localStorage.setItem(LS_KEY, JSON.stringify(newIds))
      } catch {}
    } else {
      setIds(prev => {
        const next = prev.includes(numId) ? prev.filter(id => id !== numId) : [...prev, numId]
        localStorage.setItem(LS_KEY, JSON.stringify(next))
        return next
      })
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
