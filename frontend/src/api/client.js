import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '') + '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const locale = localStorage.getItem('mahalo_lang') || 'fr'
  config.headers['Accept-Language'] = locale
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error?.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const propertiesApi = {
  list:    (params = {}) => api.get('/properties', { params }),
  featured:(perPage = 8) => api.get('/properties', { params: { is_featured: 1, per_page: perPage } }),
  search:  (params = {}) => api.get('/properties/search', { params }),
  bySlug:  (slug) => api.get(`/properties/${slug}`),
  byId:    (id)   => api.get(`/properties/id/${id}`),
  similar: (id)   => api.get(`/properties/id/${id}/similar`),
  filters: ()     => api.get('/properties/filters'),
  reviews: (propertyId) => api.get(`/properties/${propertyId}/reviews`),
}

export const projectsApi = {
  list: (params = {}) => api.get('/projects', { params }),
  featured: (perPage = 8) => api.get('/projects', { params: { is_featured: 1, per_page: perPage } }),
  search: (params = {}) => api.get('/projects/search', { params }),
  bySlug: (slug) => api.get(`/projects/${slug}`),
  byId: (id) => api.get(`/projects/id/${id}`),
  getProperties: (id) => api.get(`/projects/id/${id}/properties`),
  filters: () => api.get('/projects/filters'),
}

export const agentsApi = {
  list: (params = {}) => api.get('/agents', { params }),
  byId: (id) => api.get(`/agents/${id}`),
  getProperties: (id) => api.get(`/agents/${id}/properties`),
  getProjects: (id) => api.get(`/agents/${id}/projects`),
}

export const citiesApi = {
  list: () => api.get('/cities'),
}

export const categoriesApi = {
  list: (params = {}) => api.get('/categories', { params }),
  bySlug: (slug) => api.get(`/categories/${slug}`),
  byId: (id) => api.get(`/categories/id/${id}`),
  getProperties: (id) => api.get(`/categories/id/${id}/properties`),
  filters: () => api.get('/categories/filters'),
}

export const featuresApi = {
  list: (params = {}) => api.get('/features', { params }),
  all: () => api.get('/features/all'),
  byId: (id) => api.get(`/features/${id}`),
}

export const facilitiesApi = {
  list: (params = {}) => api.get('/facilities', { params }),
  all: () => api.get('/facilities/all'),
  byId: (id) => api.get(`/facilities/${id}`),
}

export const consultsApi = {
  store: (data) => api.post('/consults', data),
  customFields: () => api.get('/consults/custom-fields'),
}

export const favoritesApi = {
  ids:    ()           => api.get('/account/favorites/ids'),
  list:   ()           => api.get('/account/favorites'),
  toggle: (propertyId) => api.post(`/account/favorites/${propertyId}`),
}

export const userListingsApi = {
  myListings: () => api.get('/account/my-listings'),
  store: (data) => api.post('/account/listings', data),
}

export const authApi = {
  register:            (data) => api.post('/auth/register', data),
  login:               (data) => api.post('/auth/login', data),
  logout:              ()     => api.post('/auth/logout'),
  profile:             ()     => api.get('/account/profile'),
  googleRedirectUrl:   ()     => api.get('/auth/google'),
  updateProfile:       (data) => api.put('/account/profile', data),
  forgotPassword:      (email) => api.post('/auth/forgot-password', { email }),
  resetPassword:       (data) => api.post('/auth/reset-password', data),
  verifyEmail:         (id, hash, expires, signature) =>
    api.post(`/auth/verify-email/${id}/${hash}`, {}, { params: { expires, signature } }),
  resendVerification:  () => api.post('/auth/resend-verification'),
}

export const professionalApi = {
  status: () => api.get('/account/professional-status'),
  apply:  (data) => api.post('/account/professional-apply', data),
}

export const agentDashboardApi = {
  overview:       ()             => api.get('/account/agent/overview'),
  properties:     (params = {})  => api.get('/account/agent/properties', { params }),
  updateProperty: (id, data)     => api.put(`/account/agent/properties/${id}`, data),
  projects:       (params = {})  => api.get('/account/agent/projects', { params }),
  updateProject:  (id, data)     => api.put(`/account/agent/projects/${id}`, data),
  messages:       (params = {})  => api.get('/account/agent/messages', { params }),
  getThread:      (id)           => api.get(`/account/agent/messages/${id}`),
  replyMessage:   (id, data)     => api.post(`/account/agent/messages/${id}/reply`, data),
  updateProfile:  (data)         => api.put('/account/agent/profile', data),
  uploadAvatar:   (formData)     => api.post('/account/agent/avatar', formData, { headers: { 'Content-Type': undefined } }),
  setPresetAvatar:(data)         => api.post('/account/agent/avatar/preset', data),
}

export const userChatsApi = {
  list:        ()             => api.get('/account/chats'),
  getThread:   (id)           => api.get(`/account/chats/${id}`),
  sendMessage: (id, data)     => api.post(`/account/chats/${id}/message`, data),
  startChat:   (data)         => api.post('/account/chats/start', data),
}

export const publicSettingsApi = {
  get: () => api.get('/public-settings'),
}

export const newsletterApi = {
  subscribe:   (email, source = 'footer') => api.post('/newsletter/subscribe', { email, source }),
  unsubscribe: (email)                    => api.post('/newsletter/unsubscribe', { email }),
}

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export default api
