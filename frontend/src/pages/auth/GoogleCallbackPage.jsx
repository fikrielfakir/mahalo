import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useUserAuth } from '../../context/UserAuthContext'
import { authApi, setAuthToken } from '../../api/client'
import LogoLoader from '../../components/LogoLoader'

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

  return <LogoLoader label="Signing you in with Google…" />
}
