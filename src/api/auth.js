import request from './request'

export const authApi = {
  register: (data) => request.post('/auth/register', data),
  login: (data) => request.post('/auth/login', data),
  logout: (data) => request.post('/auth/logout', data),
  logoutAll: () => request.post('/auth/logout-all'),
  refresh: (data) => request.post('/auth/refresh', data),
  forgotPassword: (data) => request.post('/auth/forgot-password', data),
  resetPassword: (data) => request.post('/auth/reset-password', data),

  totpSetup: () => request.post('/auth/mfa/totp/setup'),
  totpVerifySetup: (data) => request.post('/auth/mfa/totp/verify-setup', data),
  totpVerify: (data) => request.post('/auth/mfa/totp/verify', data),
  totpDisable: (data) => request.post('/auth/mfa/totp/disable', data),
  totpBackupCodes: () => request.get('/auth/mfa/totp/backup-codes'),

  passkeyRegisterOptions: () => request.post('/auth/passkey/register-options'),
  passkeyRegister: (data) => request.post('/auth/passkey/register', data),
  passkeyAuthOptions: (data) => request.post('/auth/passkey/auth-options', data),
  passkeyLogin: (data) => request.post('/auth/passkey/login', data),
}
