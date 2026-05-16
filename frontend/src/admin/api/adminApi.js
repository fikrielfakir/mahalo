import axios from 'axios'

const BASE = '/api/v1'

const client = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

client.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('admin_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

client.interceptors.response.use(
  (r) => r.data,
  (e) => {
    if (e.response?.status === 401) {
      localStorage.removeItem('admin_token')
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
  create:   (d)      => client.post('/admin/properties', d),
  update:   (id, d)  => client.put(`/admin/properties/${id}`, d),
  delete:   (id)     => client.delete(`/admin/properties/${id}`),
  moderate: (id, d)  => client.put(`/admin/properties/${id}/moderation`, d),
}

export const adminProjects = {
  list:   (p = {}) => client.get('/admin/projects', { params: p }),
  get:    (id)     => client.get(`/admin/projects/${id}`),
  create: (d)      => client.post('/admin/projects', d),
  update: (id, d)  => client.put(`/admin/projects/${id}`, d),
  delete: (id)     => client.delete(`/admin/projects/${id}`),
}

export const adminAgents = {
  list:   (p = {}) => client.get('/admin/agents', { params: p }),
  get:    (id)     => client.get(`/admin/agents/${id}`),
  create: (d)      => client.post('/admin/agents', d),
  update: (id, d)  => client.put(`/admin/agents/${id}`, d),
  delete: (id)     => client.delete(`/admin/agents/${id}`),
  ban:    (id, d)  => client.post(`/admin/agents/${id}/ban`, d),
  unban:  (id)     => client.post(`/admin/agents/${id}/unban`),
}

export const adminCategories = {
  list:   ()       => client.get('/admin/categories'),
  create: (d)      => client.post('/admin/categories', d),
  update: (id, d)  => client.put(`/admin/categories/${id}`, d),
  delete: (id)     => client.delete(`/admin/categories/${id}`),
}

export const adminFeatures = {
  list:   ()       => client.get('/admin/features'),
  create: (d)      => client.post('/admin/features', d),
  update: (id, d)  => client.put(`/admin/features/${id}`, d),
  delete: (id)     => client.delete(`/admin/features/${id}`),
}

export const adminFacilities = {
  list:   ()       => client.get('/admin/facilities'),
  create: (d)      => client.post('/admin/facilities', d),
  update: (id, d)  => client.put(`/admin/facilities/${id}`, d),
  delete: (id)     => client.delete(`/admin/facilities/${id}`),
}

export const adminInvestors = {
  list:   ()       => client.get('/admin/investors'),
  create: (d)      => client.post('/admin/investors', d),
  update: (id, d)  => client.put(`/admin/investors/${id}`, d),
  delete: (id)     => client.delete(`/admin/investors/${id}`),
}

export const adminCities = {
  list:   (p = {}) => client.get('/admin/cities', { params: p }),
  create: (d)      => client.post('/admin/cities', d),
  update: (id, d)  => client.put(`/admin/cities/${id}`, d),
  delete: (id)     => client.delete(`/admin/cities/${id}`),
}

export const adminConsults = {
  list:         (p = {}) => client.get('/admin/consults', { params: p }),
  update:       (id, d)  => client.put(`/admin/consults/${id}`, d),
  bulkUpdate:   (d)      => client.post('/admin/consults/bulk', d),
  delete:       (id)     => client.delete(`/admin/consults/${id}`),
  bulkDelete:   (d)      => client.post('/admin/consults/bulk-delete', d),
}

export const adminMedia = {
  list:              (p = {})   => client.get('/admin/media', { params: p }),
  upload:            (formData) => client.post('/admin/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  rethumbnail:       (id, formData = null) =>
    client.post(`/admin/media/${id}/thumbnail`, formData ?? {}, {
      headers: formData ? { 'Content-Type': 'multipart/form-data' } : {}
    }),
  batchRethumbnail:  ()         => client.post('/admin/media/thumbnail/batch'),
  delete:            (id)       => client.delete(`/admin/media/${id}`),
}

export const adminUsers = {
  list:   (p = {}) => client.get('/admin/users', { params: p }),
  create: (d)      => client.post('/admin/users', d),
  update: (id, d)  => client.put(`/admin/users/${id}`, d),
  delete: (id)     => client.delete(`/admin/users/${id}`),
  ban:    (id, d)  => client.post(`/admin/users/${id}/ban`, d),
  unban:  (id)     => client.post(`/admin/users/${id}/unban`),
}

export const adminProfessionalApplications = {
  list:    (p = {}) => client.get('/admin/professional-applications', { params: p }),
  approve: (id)     => client.post(`/admin/professional-applications/${id}/approve`),
  reject:  (id, reason) => client.post(`/admin/professional-applications/${id}/reject`, { reason }),
}

export const adminSettings = {
  get:          ()         => client.get('/admin/settings'),
  update:       (d)        => client.put('/admin/settings', d),
  uploadLogo:   (formData) => client.post('/admin/settings/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  testMail:     (to)       => client.post('/admin/settings/mail-test', { to }),
  sitemapPing:  ()         => client.post('/admin/settings/sitemap-ping'),
  getTranslations:    (locale)     => client.get(`/admin/settings/translations/${locale}`),
  updateTranslations: (locale, d)  => client.put(`/admin/settings/translations/${locale}`, d),
  deleteTranslation:  (locale, key) => client.delete(`/admin/settings/translations/${locale}/${key}`),
}

export const publicApi = {
  cities:     () => client.get('/properties/filters'),
  features:   () => client.get('/features/all'),
  categories: () => client.get('/categories'),
  investors:  () => client.get('/admin/investors'),
}

export const adminApi = client
