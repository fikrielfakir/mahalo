import axios from 'axios'

const BASE = (import.meta.env.VITE_API_URL || '') + '/api/v1'

const TOKEN_KEY = 'admin_token'

function getToken() {
  try { return sessionStorage.getItem(TOKEN_KEY) } catch { return null }
}

function removeToken() {
  try { sessionStorage.removeItem(TOKEN_KEY) } catch {}
}

const client = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

client.interceptors.request.use((cfg) => {
  const token = getToken()
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

client.interceptors.response.use(
  (r) => r.data,
  (e) => {
    if (e.response?.status === 401) {
      removeToken()
      window.location.href = '/admin/login'
    }
    return Promise.reject(e?.response?.data || e)
  }
)

export const adminAuth = {
  login:            (data) => client.post('/auth/login', data),
  logout:           ()     => client.post('/auth/logout'),
  profile:          ()     => client.get('/account/profile'),
  googleRedirectUrl:()     => client.get('/admin/auth/google'),
}

export const adminStats = {
  get: () => client.get('/admin/stats'),
}

export const adminProperties = {
  list:     (p = {}) => client.get('/admin/properties', { params: p }),
  get:      (id)     => client.get(`/admin/properties/${id}`),
  create:   (data)   => client.post('/admin/properties', data),
  update:   (id, d)  => client.put(`/admin/properties/${id}`, d),
  delete:   (id)     => client.delete(`/admin/properties/${id}`),
  toggle:   (id, f)  => client.patch(`/admin/properties/${id}/toggle`, { field: f }),
  reorder:  (ids)    => client.post('/admin/properties/reorder', { ids }),
}

export const adminProjects = {
  list:   (p = {}) => client.get('/admin/projects', { params: p }),
  get:    (id)     => client.get(`/admin/projects/${id}`),
  create: (data)   => client.post('/admin/projects', data),
  update: (id, d)  => client.put(`/admin/projects/${id}`, d),
  delete: (id)     => client.delete(`/admin/projects/${id}`),
  toggle: (id, f)  => client.patch(`/admin/projects/${id}/toggle`, { field: f }),
  reorder:(ids)    => client.post('/admin/projects/reorder', { ids }),
}

export const adminAgents = {
  list:   (p = {}) => client.get('/admin/agents', { params: p }),
  get:    (id)     => client.get(`/admin/agents/${id}`),
  create: (data)   => client.post('/admin/agents', data),
  update: (id, d)  => client.put(`/admin/agents/${id}`, d),
  delete: (id)     => client.delete(`/admin/agents/${id}`),
  toggle: (id, f)  => client.patch(`/admin/agents/${id}/toggle`, { field: f }),
}

export const adminUsers = {
  list:   (p = {}) => client.get('/admin/users', { params: p }),
  get:    (id)     => client.get(`/admin/users/${id}`),
  update: (id, d)  => client.put(`/admin/users/${id}`, d),
  delete: (id)     => client.delete(`/admin/users/${id}`),
  toggle: (id, f)  => client.patch(`/admin/users/${id}/toggle`, { field: f }),
}

export const adminCategories = {
  list:   (p = {}) => client.get('/admin/categories', { params: p }),
  get:    (id)     => client.get(`/admin/categories/${id}`),
  create: (data)   => client.post('/admin/categories', data),
  update: (id, d)  => client.put(`/admin/categories/${id}`, d),
  delete: (id)     => client.delete(`/admin/categories/${id}`),
}

export const adminCities = {
  list:   (p = {}) => client.get('/admin/cities', { params: p }),
  get:    (id)     => client.get(`/admin/cities/${id}`),
  create: (data)   => client.post('/admin/cities', data),
  update: (id, d)  => client.put(`/admin/cities/${id}`, d),
  delete: (id)     => client.delete(`/admin/cities/${id}`),
}

export const adminFeatures = {
  list:   (p = {}) => client.get('/admin/features', { params: p }),
  create: (data)   => client.post('/admin/features', data),
  update: (id, d)  => client.put(`/admin/features/${id}`, d),
  delete: (id)     => client.delete(`/admin/features/${id}`),
}

export const adminFacilities = {
  list:   (p = {}) => client.get('/admin/facilities', { params: p }),
  create: (data)   => client.post('/admin/facilities', data),
  update: (id, d)  => client.put(`/admin/facilities/${id}`, d),
  delete: (id)     => client.delete(`/admin/facilities/${id}`),
}

export const adminNeighborhoods = {
  list:   (p = {}) => client.get('/admin/neighborhoods', { params: p }),
  get:    (id)     => client.get(`/admin/neighborhoods/${id}`),
  create: (data)   => client.post('/admin/neighborhoods', data),
  update: (id, d)  => client.put(`/admin/neighborhoods/${id}`, d),
  delete: (id)     => client.delete(`/admin/neighborhoods/${id}`),
}

export const adminConsults = {
  list:   (p = {}) => client.get('/admin/consults', { params: p }),
  get:    (id)     => client.get(`/admin/consults/${id}`),
  update: (id, d)  => client.put(`/admin/consults/${id}`, d),
  delete: (id)     => client.delete(`/admin/consults/${id}`),
  reply:  (id, d)  => client.post(`/admin/consults/${id}/reply`, d),
}

export const adminSettings = {
  get:                ()              => client.get('/admin/settings'),
  update:             (data)          => client.put('/admin/settings', data),
  uploadLogo:         (fd)            => client.post('/admin/settings/logo', fd, { headers: { 'Content-Type': undefined } }),
  getTranslations:    (locale)        => client.get(`/admin/settings/translations/${locale}`),
  updateTranslations: (locale, d)     => client.put(`/admin/settings/translations/${locale}`, d),
  deleteTranslation:  (locale, k)     => client.delete(`/admin/settings/translations/${locale}/${k}`),
  autoTranslate:      (locale, keys)  => client.post('/admin/settings/auto-translate', { locale, keys }),
}

export const adminApplications = {
  list:   (p = {}) => client.get('/admin/applications', { params: p }),
  get:    (id)     => client.get(`/admin/applications/${id}`),
  approve:(id)     => client.post(`/admin/applications/${id}/approve`),
  reject: (id, d)  => client.post(`/admin/applications/${id}/reject`, d),
}

export const adminMedia = {
  list:   (p = {}) => client.get('/admin/media', { params: p }),
  delete: (id)     => client.delete(`/admin/media/${id}`),
}

export const adminAnalytics = {
  overview:   (p = {}) => client.get('/admin/analytics/overview', { params: p }),
  properties: (p = {}) => client.get('/admin/analytics/properties', { params: p }),
  users:      (p = {}) => client.get('/admin/analytics/users', { params: p }),
}

export const adminNewsletterApi = {
  list:        (p = {}) => client.get('/admin/newsletter', { params: p }),
  export:      ()       => client.get('/admin/newsletter/export'),
  delete:      (id)     => client.delete(`/admin/newsletter/${id}`),
  bulkDelete:  (ids)    => client.post('/admin/newsletter/bulk-delete', { ids }),
}

export const adminLanguages = {
  list:   ()       => client.get('/admin/languages'),
  update: (id, d)  => client.put(`/admin/languages/${id}`, d),
  sync:   ()       => client.post('/admin/languages/sync'),
}

export const adminTranslations = {
  list:   (p = {}) => client.get('/admin/translations', { params: p }),
  update: (id, d)  => client.put(`/admin/translations/${id}`, d),
  reset:  (id)     => client.delete(`/admin/translations/${id}`),
  import: (fd)     => client.post('/admin/translations/import', fd, { headers: { 'Content-Type': undefined } }),
  export: (locale) => client.get(`/admin/translations/export/${locale}`),
}

export const adminSavedSearches = {
  list:   (p = {}) => client.get('/admin/saved-searches', { params: p }),
  delete: (id)     => client.delete(`/admin/saved-searches/${id}`),
}

export const adminReviews = {
  list:   (p = {}) => client.get('/admin/reviews', { params: p }),
  approve:(id)     => client.patch(`/admin/reviews/${id}/approve`),
  reject: (id)     => client.patch(`/admin/reviews/${id}/reject`),
  delete: (id)     => client.delete(`/admin/reviews/${id}`),
}

export const adminInvestors = {
  list:   (p = {}) => client.get('/admin/investors', { params: p }),
  get:    (id)     => client.get(`/admin/investors/${id}`),
  create: (data)   => client.post('/admin/investors', data),
  update: (id, d)  => client.put(`/admin/investors/${id}`, d),
  delete: (id)     => client.delete(`/admin/investors/${id}`),
}

export const adminProfessionalApplications = {
  list:    (p = {}) => client.get('/admin/professional-applications', { params: p }),
  get:     (id)     => client.get(`/admin/professional-applications/${id}`),
  approve: (id)     => client.post(`/admin/professional-applications/${id}/approve`),
  reject:  (id, d)  => client.post(`/admin/professional-applications/${id}/reject`, d),
}

export const adminContentTranslations = {
  get:  (type, id)     => client.get(`/admin/content-translations/${type}/${id}`),
  save: (type, id, d)  => client.put(`/admin/content-translations/${type}/${id}`, d),
}

export const publicApi = {
  cities:     (p = {}) => client.get('/cities', { params: p }),
  categories: (p = {}) => client.get('/categories', { params: p }),
}

// Named re-export of the axios client for pages that call it directly
// (e.g. adminApi.get('/admin/...'), adminApi.post(...), adminApi.delete(...))
export { client as adminApi }

export default client
