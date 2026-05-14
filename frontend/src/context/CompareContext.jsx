import { createContext, useContext, useState, useCallback } from 'react'

const CompareContext = createContext(null)

const MAX = 3

export function CompareProvider({ children }) {
  const [list, setList] = useState([])

  const add = useCallback((property) => {
    setList(prev => {
      if (prev.find(p => p.id === property.id)) return prev
      if (prev.length >= MAX) return prev
      return [...prev, property]
    })
  }, [])

  const remove = useCallback((id) => {
    setList(prev => prev.filter(p => p.id !== id))
  }, [])

  const toggle = useCallback((property) => {
    setList(prev => {
      if (prev.find(p => p.id === property.id)) {
        return prev.filter(p => p.id !== property.id)
      }
      if (prev.length >= MAX) return prev
      return [...prev, property]
    })
  }, [])

  const clear = useCallback(() => setList([]), [])

  const isIn  = useCallback((id) => list.some(p => p.id === id), [list])
  const isFull = list.length >= MAX

  return (
    <CompareContext.Provider value={{ list, add, remove, toggle, clear, isIn, isFull, MAX }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used inside CompareProvider')
  return ctx
}
