import request from './request'

export const setupApi = {
  status: () => request.get('/setup/status'),
  setup: (data) => request.post('/setup/setup', data),
}
