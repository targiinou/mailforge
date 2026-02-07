import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Contacts API
export const contactsApi = {
  getAll: () => api.get('/contacts'),
  get: (id: number) => api.get(`/contacts/${id}`),
  create: (data: any) => api.post('/contacts', data),
  update: (id: number, data: any) => api.put(`/contacts/${id}`, data),
  delete: (id: number) => api.delete(`/contacts/${id}`),
  getTags: () => api.get('/contacts/tags'),
  import: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/contacts/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Campaigns API
export const campaignsApi = {
  getAll: () => api.get('/campaigns'),
  get: (id: number) => api.get(`/campaigns/${id}`),
  create: (data: any) => api.post('/campaigns', data),
  update: (id: number, data: any) => api.put(`/campaigns/${id}`, data),
  delete: (id: number) => api.delete(`/campaigns/${id}`),
  send: (id: number, test: boolean = false) => api.post(`/campaigns/${id}/send`, { test }),
};

// Emails API
export const emailsApi = {
  send: (data: any) => api.post('/emails/send', data),
  sendBulk: (data: any) => api.post('/emails/send-bulk', data),
};

// Analytics API
export const analyticsApi = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getCampaignStats: (id: number) => api.get(`/analytics/campaigns/${id}`),
};

export default api;
