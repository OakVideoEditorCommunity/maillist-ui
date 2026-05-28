import request from './request'

export const setupApi = {
  status: () => request.get('/setup/status'),
  testDb: (data) => request.post('/setup/test-db', data),
  setup: (data) => request.post('/setup/setup', data),
}
