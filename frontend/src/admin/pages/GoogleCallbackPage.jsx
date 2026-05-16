import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { adminAuth } from '../api/adminApi'
import { AdminAuthCallbackSkeleton } from '../../components/Skeletons'

export default function AdminGoogleCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    const error = params.get('error')

    if (error || !token) {
      const msg = error === 'not_admin'
        ? 'not_admin'
        : error === 'not_authorized'
          ? 'not_authorized'
          : 'google_failed'
      navigate(`/admin/login?error=${msg}`, { replace: true })
      return
    }

    localStorage.setItem('admin_token', token)

    adminAuth.profile()
      .then((res) => {
        const role = res.data?.role
        if (!['admin', 'manager'].includes(role)) {
          localStorage.removeItem('admin_token')
          navigate('/admin/login?error=not_admin', { replace: true })
          return
        }
        navigate('/admin/dashboard', { replace: true })
      })
      .catch(() => {
        localStorage.removeItem('admin_token')
        navigate('/admin/login?error=google_failed', { replace: true })
      })
  }, [])

  return <AdminAuthCallbackSkeleton />
}
