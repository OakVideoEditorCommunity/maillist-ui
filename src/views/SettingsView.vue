<template>
  <div>
    <h2>{{ $t('settings.title') }}</h2>
    <el-card style="margin-top: 20px; max-width: 600px;">
      <el-form :model="settings" label-width="160px">
        <h4>{{ $t('settings.server') }}</h4>
        <el-form-item :label="$t('settings.host')">
          <el-input v-model="settings.server.host" disabled />
        </el-form-item>
        <el-form-item :label="$t('settings.port')">
          <el-input v-model="settings.server.port" disabled />
        </el-form-item>

        <h4 style="margin-top: 20px;">{{ $t('settings.smtp') }}</h4>
        <el-form-item :label="$t('settings.incomingEnabled')">
          <el-switch v-model="settings.smtp.incoming_enabled" disabled />
        </el-form-item>
        <el-form-item :label="$t('settings.outgoingHost')">
          <el-input v-model="settings.smtp.outgoing_host" />
        </el-form-item>

        <h4 style="margin-top: 20px;">{{ $t('settings.aiModeration') }}</h4>
        <el-form-item :label="$t('settings.aiEnabled')">
          <el-switch v-model="settings.ai_moderation.enabled" />
        </el-form-item>
        <el-form-item :label="$t('settings.aiProvider')">
          <el-input v-model="settings.ai_moderation.provider" />
        </el-form-item>
        <el-form-item :label="$t('settings.aiAccessKeyId')">
          <el-input v-model="settings.ai_moderation.access_key_id" />
        </el-form-item>
        <el-form-item :label="$t('settings.aiAccessKeySecret')">
          <el-input v-model="settings.ai_moderation.access_key_secret" type="password" show-password />
        </el-form-item>
        <el-form-item :label="$t('settings.aiRegion')">
          <el-input v-model="settings.ai_moderation.region" />
        </el-form-item>
        <el-form-item :label="$t('settings.aiEndpoint')">
          <el-input v-model="settings.ai_moderation.endpoint" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSave">{{ $t('app.save') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { adminApi } from '../api/index'

const { t } = useI18n()
const settings = ref({
  server: { host: '', port: 0 },
  smtp: { incoming_enabled: false, outgoing_host: '' },
  ai_moderation: { enabled: false, provider: '', access_key_id: '', access_key_secret: '', region: '', endpoint: '' },
})

onMounted(async () => {
  try {
    const res = await adminApi.settings()
    settings.value = res.data
  } catch (e) {
    ElMessage.error(e.message)
  }
})

const handleSave = async () => {
  try {
    await adminApi.updateSettings(settings.value)
    ElMessage.success(t('settings.saveSuccess'))
  } catch (e) {
    ElMessage.error(e.message)
  }
}
</script>
