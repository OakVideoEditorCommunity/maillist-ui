<template>
  <div class="login-page">
    <el-card class="login-card" shadow="always">
      <template #header>
        <div class="card-header">{{ branding.site_name || $t('auth.loginTitle') }}</div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane :label="$t('auth.login')" name="password">
          <el-form :model="form" :rules="rules" ref="formRef" @keyup.enter="handleLogin">
            <el-form-item prop="email">
              <el-input v-model="form.email" :placeholder="$t('auth.email')" prefix-icon="Message" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="form.password" type="password" :placeholder="$t('auth.password')" prefix-icon="Lock" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleLogin" :loading="loading" style="width: 100%">{{ $t('auth.login') }}</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane :label="$t('auth.passkeyLogin')" name="passkey">
          <div style="text-align: center; padding: 20px 0;">
            <el-button type="primary" @click="handlePasskeyLogin" :loading="passkeyLoading" size="large">
              <el-icon><Key /></el-icon>
              {{ $t('auth.passkeyLogin') }}
            </el-button>
            <p style="color: #909399; font-size: 12px; margin-top: 12px;">{{ $t('auth.passkeyHint') }}</p>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div class="actions">
        <el-link type="primary" @click="$router.push('/register')">{{ $t('auth.noAccount') }}</el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { authApi } from '../api/auth'
import { configApi } from '../api/index'
import { applyUserLocale } from '../i18n'

const router = useRouter()
const { t } = useI18n()
const formRef = ref()
const loading = ref(false)
const passkeyLoading = ref(false)
const activeTab = ref('password')
const branding = ref({ site_name: '' })

onMounted(async () => {
  try {
    const res = await configApi.public()
    branding.value = res.data || res
  } catch (e) {
    console.error(e)
  }
})

const form = reactive({ email: '', password: '' })
const rules = {
  email: [{ required: true, message: t('auth.email'), trigger: 'blur' }],
  password: [{ required: true, message: t('auth.password'), trigger: 'blur' }],
}

const handleLogin = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    const res = await authApi.login(form)
    localStorage.setItem('access_token', res.access_token)
    localStorage.setItem('refresh_token', res.refresh_token)
    // Apply user language preference from backend
    if (res.user?.language) {
      applyUserLocale(res.user.language)
    }
    ElMessage.success(t('auth.loginSuccess'))
    router.push('/console/dashboard')
  } catch (e) {
    if (e.response?.data?.code === 'MFA_REQUIRED') {
      ElMessage.warning('MFA required')
      router.push(`/mfa?user_id=${e.response.data.details.user_id}`)
    } else {
      ElMessage.error(e.message || 'Login failed')
    }
  } finally {
    loading.value = false
  }
}

const handlePasskeyLogin = async () => {
  try {
    passkeyLoading.value = true
    ElMessage.info(t('auth.passkeyDemo'))
  } finally {
    passkeyLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
  width: 420px;
}
.card-header {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}
.actions {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}
</style>
