import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : '/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error?.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const propertiesApi = {
  list: (params = {}) => api.get('/properties', { params }),
  featured: (perPage = 8) => api.get('/properties', { params: { is_featured: 1, per_page: perPage } }),
  search: (params = {}) => api.get('/properties/search', { params }),
  bySlug: (slug) => api.get(`/properties/${slug}`),
  byId: (id) => api.get(`/properties/id/${id}`),
  filters: () => api.get('/properties/filters'),
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

export default api
