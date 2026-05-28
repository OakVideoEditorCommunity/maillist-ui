import request from './request'

export const userApi = {
  me: () => request.get('/users/me'),
  updateMe: (data) => request.put('/users/me', data),
  changePassword: (data) => request.put('/users/me/password', data),
  listUsers: () => request.get('/users'),
  getUser: (id) => request.get(`/users/${id}`),
  updateUser: (id, data) => request.put(`/users/${id}`, data),
  deleteUser: (id) => request.delete(`/users/${id}`),
  listSessions: () => request.get('/users/me/sessions'),
  revokeSession: (id) => request.delete(`/users/me/sessions/${id}`),
  listPasskeys: () => request.get('/users/me/passkeys'),
  deletePasskey: (id) => request.delete(`/users/me/passkeys/${id}`),
  renamePasskey: (id, data) => request.put(`/users/me/passkeys/${id}`, data),
}

export const listApi = {
  list: () => request.get('/lists'),
  create: (data) => request.post('/lists', data),
  get: (id) => request.get(`/lists/${id}`),
  update: (id, data) => request.put(`/lists/${id}`, data),
  delete: (id) => request.delete(`/lists/${id}`),
  stats: (id) => request.get(`/lists/${id}/stats`),
  settings: (id) => request.get(`/lists/${id}/settings`),
  updateSettings: (id, data) => request.put(`/lists/${id}/settings`, data),
  subscribe: (id, data) => request.post(`/lists/${id}/subscribe`, data),
  unsubscribe: (id, data) => request.post(`/lists/${id}/unsubscribe`, data),
  listSubscribers: (id) => request.get(`/lists/${id}/subscribers`),
  addSubscriber: (id, data) => request.post(`/lists/${id}/subscribers`, data),
  getSubscriber: (id, subId) => request.get(`/lists/${id}/subscribers/${subId}`),
  updateSubscriber: (id, subId, data) => request.put(`/lists/${id}/subscribers/${subId}`, data),
  removeSubscriber: (id, subId) => request.delete(`/lists/${id}/subscribers/${subId}`),
  listMessages: (id) => request.get(`/lists/${id}/messages`),
}

export const domainApi = {
  list: () => request.get('/domains'),
  create: (data) => request.post('/domains', data),
  get: (id) => request.get(`/domains/${id}`),
  update: (id, data) => request.put(`/domains/${id}`, data),
  delete: (id) => request.delete(`/domains/${id}`),
  verifyDkim: (id) => request.post(`/domains/${id}/verify-dkim`),
  generateDkim: (id) => request.post(`/domains/${id}/generate-dkim`),
  getDnsRecords: (id) => request.get(`/domains/${id}/dns-records`),
  verifyDns: (id) => request.post(`/domains/${id}/verify-dns`),
  testSmtp: (id) => request.post(`/domains/${id}/test-smtp`),
}

export const moderationApi = {
  get: (id) => request.get(`/moderation/${id}`),
  approve: (id) => request.post(`/moderation/${id}/approve`),
  reject: (id) => request.post(`/moderation/${id}/reject`),
  discard: (id) => request.post(`/moderation/${id}/discard`),
  whitelist: (id) => request.post(`/moderation/${id}/whitelist-sender`),
  blacklist: (id) => request.post(`/moderation/${id}/blacklist-sender`),
  aiFeedback: (id, data) => request.post(`/moderation/${id}/ai-feedback`, data),
}

export const templateApi = {
  list: () => request.get('/templates'),
  get: (name) => request.get(`/templates/${name}`),
  update: (name, data) => request.put(`/templates/${name}`, data),
  preview: (name, data) => request.post(`/templates/${name}/preview`, data),
}

export const configApi = {
  public: () => request.get('/config'),
}

export const adminApi = {
  dashboard: () => request.get('/admin/dashboard'),
  stats: () => request.get('/admin/stats'),
  activityLog: () => request.get('/admin/activity-log'),
  settings: () => request.get('/admin/settings'),
  updateSettings: (data) => request.put('/admin/settings', data),
  aiModerationStats: () => request.get('/admin/ai-moderation/stats'),
}
