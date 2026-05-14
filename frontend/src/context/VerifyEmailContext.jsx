import { createContext, useContext, useState, useCallback } from 'react'

const VerifyEmailContext = createContext(null)

export function VerifyEmailProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const openPopup  = useCallback(() => setIsOpen(true),  [])
  const closePopup = useCallback(() => setIsOpen(false), [])

  return (
    <VerifyEmailContext.Provider value={{ isOpen, openPopup, closePopup }}>
      {children}
    </VerifyEmailContext.Provider>
  )
}

export function useVerifyEmail() {
  const ctx = useContext(VerifyEmailContext)
  if (!ctx) throw new Error('useVerifyEmail must be used inside VerifyEmailProvider')
  return ctx
}
