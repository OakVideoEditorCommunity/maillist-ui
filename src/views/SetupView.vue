<template>
  <div class="setup-container">
    <div class="setup-box">
      <h1>{{ $t('setup.title') }}</h1>
      <p class="subtitle">{{ $t('setup.subtitle') }}</p>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleSubmit"
      >
        <el-form-item :label="$t('setup.email')" prop="email">
          <el-input v-model="form.email" type="email" />
        </el-form-item>

        <el-form-item :label="$t('setup.name')" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item :label="$t('setup.password')" prop="password">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>

        <el-form-item :label="$t('setup.confirmPassword')" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" show-password />
        </el-form-item>

        <el-button type="primary" native-type="submit" :loading="loading" class="submit-btn">
          {{ $t('setup.createAdmin') }}
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { setupApi } from '../api/setup'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error(window.__i18n?.global?.t('setup.passwordMismatch') || 'Passwords do not match'))
  } else {
    callback()
  }
}

const rules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Invalid email format', trigger: 'blur' },
  ],
  name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 8, message: 'Password must be at least 8 characters', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm password', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await setupApi.setup({
      email: form.email,
      password: form.password,
      name: form.name,
    })
    ElMessage.success('Admin account created. Please log in.')
    router.push('/login')
  } catch (e) {
    ElMessage.error(e.message || 'Setup failed')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.setup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.setup-box {
  width: 100%;
  max-width: 480px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0 0 8px;
  font-size: 24px;
  text-align: center;
}

.subtitle {
  margin: 0 0 24px;
  color: #909399;
  text-align: center;
}

.submit-btn {
  width: 100%;
  margin-top: 8px;
}
</style>
