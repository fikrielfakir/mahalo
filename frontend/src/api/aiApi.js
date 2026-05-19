import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

export const aiApi = {
  valuation:           (data) => api.post('/ai/valuation', data).then(r => r.data),
  generateDescription: (data) => api.post('/ai/generate-description', data).then(r => r.data),
  propertyChat:        (data) => api.post('/ai/property-chat', data).then(r => r.data),
  generalChat:         (data) => api.post('/ai/chat', data).then(r => r.data),
  matchProperties:     (data) => api.post('/ai/match', data).then(r => r.data),
}

export default aiApi
