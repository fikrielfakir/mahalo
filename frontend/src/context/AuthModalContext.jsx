import { createContext, useContext, useState, useCallback } from 'react'

const AuthModalContext = createContext(null)

export function AuthModalProvider({ children }) {
  const [state, setState] = useState({ open: false, onSuccess: null })

  const openAuthModal = useCallback((onSuccess = null) => {
    setState({ open: true, onSuccess })
  }, [])

  const closeAuthModal = useCallback(() => {
    setState({ open: false, onSuccess: null })
  }, [])

  const handleSuccess = useCallback(() => {
    setState(prev => {
      if (prev.onSuccess) prev.onSuccess()
      return { open: false, onSuccess: null }
    })
  }, [])

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal, handleSuccess, isOpen: state.open }}>
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext)
  if (!ctx) throw new Error('useAuthModal must be used inside AuthModalProvider')
  return ctx
}
