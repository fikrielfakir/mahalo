import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '') + '/api/v1',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

export const aiApi = {
  valuation:           (data) => api.post('/ai/valuation', data).then(r => r.data),
  generateDescription: (data) => api.post('/ai/generate-description', data).then(r => r.data),
  propertyChat:        (data) => api.post('/ai/property-chat', data).then(r => r.data),
  generalChat:         (data) => api.post('/ai/chat', data).then(r => r.data),
  matchProperties:     (data) => api.post('/ai/match', data).then(r => r.data),

  savedSearches: {
    save:   (data) => api.post('/saved-searches', data).then(r => r.data),
    list:   (email) => api.get('/saved-searches', { params: { email } }).then(r => r.data),
    remove: (id) => api.delete(`/saved-searches/${id}`).then(r => r.data),
  },
}

export default aiApi
