<template>
  <div>
    <h2>{{ $t('profile.title') }}</h2>
    <el-card style="margin-top: 20px; max-width: 600px;">
      <el-form :model="form" label-width="140px">
        <el-form-item :label="$t('auth.email')">
          <el-input v-model="form.email" disabled />
        </el-form-item>
        <el-form-item :label="$t('auth.name')">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">{{ $t('profile.save') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px; max-width: 600px;">
      <template #header>{{ $t('profile.changePassword') }}</template>
      <el-form :model="pwdForm" label-width="140px">
        <el-form-item :label="$t('profile.currentPassword')">
          <el-input v-model="pwdForm.current_password" type="password" show-password />
        </el-form-item>
        <el-form-item :label="$t('profile.newPassword')">
          <el-input v-model="pwdForm.new_password" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleChangePassword">{{ $t('profile.changePassword') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px; max-width: 600px;">
      <template #header>{{ $t('profile.totp') }}</template>
      <div v-if="!mfaEnabled">
        <el-button type="primary" @click="setupTotp">{{ $t('profile.setupTotp') }}</el-button>
      </div>
      <div v-else>
        <el-tag type="success">{{ $t('profile.totpEnabled') }}</el-tag>
        <el-button style="margin-left: 12px;" @click="disableTotp">{{ $t('profile.disableTotp') }}</el-button>
      </div>

      <el-dialog v-model="totpDialog" :title="$t('profile.setupTotp')" width="400px">
        <div v-if="totpSetup" style="text-align: center;">
          <p>{{ $t('profile.totpQrHint') }}</p>
          <el-image :src="totpSetup.qr_url" style="width: 200px; height: 200px;" />
          <p style="font-size: 12px; color: #909399; word-break: break-all;">{{ $t('profile.totpSecret') }}: {{ totpSetup.secret }}</p>
          <el-input v-model="totpCode" :placeholder="$t('profile.totpCodePlaceholder')" style="margin-top: 12px;" />
        </div>
        <template #footer>
          <el-button @click="totpDialog = false">{{ $t('app.cancel') }}</el-button>
          <el-button type="primary" @click="verifyTotpSetup">{{ $t('profile.totpVerifyEnable') }}</el-button>
        </template>
      </el-dialog>
    </el-card>

    <el-card style="margin-top: 20px; max-width: 600px;">
      <template #header>{{ $t('profile.passkeyTitle') }}</template>
      <el-button type="primary" @click="registerPasskey">{{ $t('profile.passkeyRegister') }}</el-button>
      <el-table :data="passkeys" size="small" style="margin-top: 12px;">
        <el-table-column prop="credential_id" :label="$t('profile.credentialId')" />
        <el-table-column prop="created_at" :label="$t('lists.createdAt')" />
        <el-table-column :label="$t('app.actions')" width="100">
          <template #default="{ row }">
            <el-button link type="danger" @click="deletePasskey(row.id)">{{ $t('profile.passkeyDelete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { userApi } from '../api/index'
import { authApi } from '../api/auth'

const { t } = useI18n()
const form = ref({ email: '', name: '' })
const pwdForm = ref({ current_password: '', new_password: '' })
const mfaEnabled = ref(false)
const totpDialog = ref(false)
const totpSetup = ref(null)
const totpCode = ref('')
const passkeys = ref([])

onMounted(async () => {
  try {
    const res = await userApi.me()
    form.value = { email: res.data.email, name: res.data.name }
    mfaEnabled.value = res.data.mfa_enabled || false
    const pk = await userApi.listPasskeys()
    passkeys.value = pk.data || []
  } catch (e) {
    console.error(e)
  }
})

const handleSave = async () => {
  try {
    await userApi.updateMe({ name: form.value.name })
    ElMessage.success(t('profile.saveSuccess'))
  } catch (e) {
    ElMessage.error(e.message)
  }
}

const handleChangePassword = async () => {
  try {
    await userApi.changePassword(pwdForm.value)
    ElMessage.success(t('profile.passwordChanged'))
    pwdForm.value = { current_password: '', new_password: '' }
  } catch (e) {
    ElMessage.error(e.message)
  }
}

const setupTotp = async () => {
  try {
    const res = await authApi.totpSetup()
    totpSetup.value = res.data
    totpDialog.value = true
  } catch (e) {
    ElMessage.error(e.message)
  }
}

const verifyTotpSetup = async () => {
  try {
    await authApi.totpVerifySetup({ code: totpCode.value })
    ElMessage.success(t('profile.totpEnabled'))
    totpDialog.value = false
    mfaEnabled.value = true
  } catch (e) {
    ElMessage.error(e.message)
  }
}

const disableTotp = async () => {
  try {
    await authApi.totpDisable({ code: totpCode.value })
    ElMessage.success(t('profile.totpDisabled'))
    mfaEnabled.value = false
  } catch (e) {
    ElMessage.error(e.message)
  }
}

const registerPasskey = async () => {
  try {
    const res = await authApi.passkeyRegisterOptions()
    ElMessage.info(t('auth.passkeyDemo'))
    console.log('Passkey options:', res.data)
  } catch (e) {
    ElMessage.error(e.message)
  }
}

const deletePasskey = async (id) => {
  try {
    await userApi.deletePasskey(id)
    ElMessage.success(t('profile.passkeyDelete'))
    const pk = await userApi.listPasskeys()
    passkeys.value = pk.data || []
  } catch (e) {
    ElMessage.error(e.message)
  }
}
</script>
