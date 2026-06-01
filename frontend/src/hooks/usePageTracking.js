import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const SESSION_KEY = '_hvid'

function getOrCreateSessionId() {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY)
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
      sessionStorage.setItem(SESSION_KEY, sid)
    }
    return sid
  } catch {
    return Math.random().toString(36).slice(2)
  }
}

export function usePageTracking() {
  const location = useLocation()
  const lastTracked = useRef(null)

  useEffect(() => {
    const page = location.pathname + location.search
    if (page === lastTracked.current) return
    if (location.pathname.startsWith('/admin')) return
    lastTracked.current = page

    const payload = {
      page,
      referrer: document.referrer || null,
      session_id: getOrCreateSessionId(),
      user_agent: navigator.userAgent,
    }

    fetch('/api/v1/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {})
  }, [location.pathname, location.search])
}
