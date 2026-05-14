import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useUserAuth } from '../../context/UserAuthContext'
import { authApi, setAuthToken } from '../../api/client'

export default function GoogleCallbackPage() {
  const [params]   = useSearchParams()
  const navigate   = useNavigate()
  const { saveSession } = useUserAuth()

  useEffect(() => {
    const token = params.get('token')
    const error = params.get('error')

    if (error || !token) {
      navigate('/login?error=google_failed', { replace: true })
      return
    }

    setAuthToken(token)
    authApi.profile()
      .then((res) => {
        saveSession(token, res.data)
        navigate('/', { replace: true })
      })
      .catch(() => {
        navigate('/login?error=google_failed', { replace: true })
      })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-navy/60 text-sm">Signing you in with Google…</p>
      </div>
    </div>
  )
}
