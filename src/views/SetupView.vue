<template>
  <div class="setup-container">
    <div class="setup-box">
      <h1>{{ $t('setup.title') || 'Initial Setup' }}</h1>
      <p class="subtitle">{{ $t('setup.subtitle') || 'Configure your Oak MailList server' }}</p>

      <el-steps :active="step - 1" finish-status="success" simple>
        <el-step title="Database" />
        <el-step title="Server & SMTP" />
        <el-step title="Admin" />
      </el-steps>

      <!-- Step 1: Database -->
      <el-form
        v-if="step === 1"
        ref="dbFormRef"
        :model="form.db"
        :rules="dbRules"
        label-position="top"
        @submit.prevent="handleDbNext"
      >
        <el-form-item label="Database Type" prop="type">
          <el-select v-model="form.db.type" style="width: 100%">
            <el-option label="PostgreSQL" value="postgres" />
            <el-option label="MySQL" value="mysql" />
            <el-option label="SQLite" value="sqlite" />
          </el-select>
        </el-form-item>

        <template v-if="form.db.type !== 'sqlite'">
          <el-form-item label="Host" prop="host">
            <el-input v-model="form.db.host" placeholder="localhost" />
          </el-form-item>
          <el-form-item label="Port" prop="port">
            <el-input-number v-model="form.db.port" :min="1" :max="65535" style="width: 100%" />
          </el-form-item>
          <el-form-item label="Database Name" prop="name">
            <el-input v-model="form.db.name" placeholder="oak_maillist" />
          </el-form-item>
          <el-form-item label="Username" prop="user">
            <el-input v-model="form.db.user" placeholder="oak" />
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input v-model="form.db.password" type="password" show-password />
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item label="Database File Path" prop="name">
            <el-input v-model="form.db.name" placeholder="/var/lib/oak-maillist/data.db" />
          </el-form-item>
        </template>

        <div class="form-actions">
          <el-button type="primary" @click="handleDbNext">Test & Continue</el-button>
        </div>
      </el-form>

      <!-- Step 2: Server & SMTP -->
      <el-form
        v-if="step === 2"
        ref="serverFormRef"
        :model="form.server"
        :rules="serverRules"
        label-position="top"
        @submit.prevent="handleServerNext"
      >
        <el-form-item label="Server Base URL" prop="baseUrl">
          <el-input v-model="form.server.baseUrl" placeholder="https://mail.example.com" />
        </el-form-item>

        <el-divider>SMTP Outgoing (optional)</el-divider>

        <el-form-item label="SMTP Host">
          <el-input v-model="form.server.smtpHost" placeholder="smtp.example.com" />
        </el-form-item>
        <el-form-item label="SMTP Port">
          <el-input-number v-model="form.server.smtpPort" :min="1" :max="65535" style="width: 100%" />
        </el-form-item>
        <el-form-item label="SMTP Username">
          <el-input v-model="form.server.smtpUser" placeholder="noreply@example.com" />
        </el-form-item>
        <el-form-item label="SMTP Password">
          <el-input v-model="form.server.smtpPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="From Address">
          <el-input v-model="form.server.smtpFrom" placeholder="noreply@example.com" />
        </el-form-item>

        <div class="form-actions">
          <el-button @click="step = 1">Back</el-button>
          <el-button type="primary" @click="handleServerNext">Continue</el-button>
        </div>
      </el-form>

      <!-- Step 3: Admin -->
      <el-form
        v-if="step === 3"
        ref="adminFormRef"
        :model="form.admin"
        :rules="adminRules"
        label-position="top"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.admin.email" type="email" />
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.admin.name" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.admin.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input v-model="form.admin.confirmPassword" type="password" show-password />
        </el-form-item>

        <div class="form-actions">
          <el-button @click="step = 2">Back</el-button>
          <el-button type="primary" native-type="submit" :loading="loading">
            Complete Setup
          </el-button>
        </div>
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
const step = ref(1)
const loading = ref(false)
const dbFormRef = ref()
const serverFormRef = ref()
const adminFormRef = ref()

const form = reactive({
  db: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    name: 'oak_maillist',
    user: 'oak',
    password: '',
  },
  server: {
    baseUrl: 'http://localhost:3000',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    smtpFrom: 'noreply@example.com',
  },
  admin: {
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  },
})

const dbRules = {
  type: [{ required: true, message: 'Select database type', trigger: 'change' }],
  host: [{ required: true, message: 'Host is required', trigger: 'blur' }],
  port: [{ required: true, message: 'Port is required', trigger: 'change' }],
  name: [{ required: true, message: 'Database name is required', trigger: 'blur' }],
  user: [{ required: true, message: 'Username is required', trigger: 'blur' }],
}

const serverRules = {
  baseUrl: [{ required: true, message: 'Base URL is required', trigger: 'blur' }],
}

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.admin.password) {
    callback(new Error('Passwords do not match'))
  } else {
    callback()
  }
}

const adminRules = {
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

const handleDbNext = async () => {
  const valid = await dbFormRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await setupApi.testDb({
      db_type: form.db.type,
      db_host: form.db.host || undefined,
      db_port: form.db.port || undefined,
      db_name: form.db.name || undefined,
      db_user: form.db.user || undefined,
      db_password: form.db.password || undefined,
    })
    ElMessage.success('Database connection successful')
    step.value = 2
  } catch (e) {
    ElMessage.error(e.message || 'Database connection failed')
  } finally {
    loading.value = false
  }
}

const handleServerNext = async () => {
  const valid = await serverFormRef.value?.validate().catch(() => false)
  if (!valid) return
  step.value = 3
}

const handleSubmit = async () => {
  const valid = await adminFormRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await setupApi.setup({
      db_type: form.db.type,
      db_host: form.db.host || undefined,
      db_port: form.db.port || undefined,
      db_name: form.db.name || undefined,
      db_user: form.db.user || undefined,
      db_password: form.db.password || undefined,
      base_url: form.server.baseUrl,
      smtp_host: form.server.smtpHost || undefined,
      smtp_port: form.server.smtpPort || undefined,
      smtp_user: form.server.smtpUser || undefined,
      smtp_password: form.server.smtpPassword || undefined,
      smtp_from: form.server.smtpFrom || undefined,
      email: form.admin.email,
      password: form.admin.password,
      name: form.admin.name,
    })
    ElMessage.success('Setup completed! Please restart the server and log in.')
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
  padding: 24px;
}

.setup-box {
  width: 100%;
  max-width: 560px;
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

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.form-actions .el-button {
  flex: 1;
}
</style>
