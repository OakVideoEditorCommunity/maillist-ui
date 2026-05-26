<template>
  <div class="register-page">
    <el-card class="register-card" shadow="always">
      <template #header>
        <div class="card-header">{{ $t('auth.registerTitle') }}</div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" @keyup.enter="handleRegister">
        <el-form-item prop="email">
          <el-input v-model="form.email" :placeholder="$t('auth.email')" prefix-icon="Message" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" :placeholder="$t('auth.password')" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="form.name" :placeholder="$t('auth.name') + ' (' + $t('app.optional') + ')'" prefix-icon="User" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister" :loading="loading" style="width: 100%">{{ $t('auth.register') }}</el-button>
        </el-form-item>
      </el-form>

      <div class="actions">
        <el-link type="primary" @click="$router.push('/login')">{{ $t('auth.alreadyAccount') }}</el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { authApi } from '../api/auth'

const router = useRouter()
const { t } = useI18n()
const formRef = ref()
const loading = ref(false)

const form = reactive({ email: '', password: '', name: '' })
const rules = {
  email: [{ required: true, message: t('auth.email'), trigger: 'blur' }],
  password: [{ required: true, message: t('auth.password'), trigger: 'blur' }, { min: 8, message: 'Min 8 chars', trigger: 'blur' }],
}

const handleRegister = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    await authApi.register({
      email: form.email,
      password: form.password,
      name: form.name || undefined,
    })
    ElMessage.success(t('auth.registerSuccess'))
    router.push('/login')
  } catch (e) {
    ElMessage.error(e.message || 'Register failed')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.register-card {
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
