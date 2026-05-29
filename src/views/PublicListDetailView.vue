<template>
  <div class="public-detail-page">
    <el-header class="public-header">
      <div class="public-logo" @click="$router.push('/')">
        <img v-if="branding.logo_url" :src="branding.logo_url" class="logo-img" />
        <span v-else>{{ branding.site_name || $t('app.name') }}</span>
      </div>
      <div class="public-actions">
        <LangSwitch />
        <el-button @click="$router.push('/')">{{ $t('app.back') }}</el-button>
        <el-button type="primary" @click="$router.push('/console')">{{ $t('nav.console') }}</el-button>
      </div>
    </el-header>

    <div class="public-content" v-loading="loading">
      <div v-if="list">
        <h1>{{ list.display_name || list.name }}</h1>
        <p class="list-meta">
          <el-tag :type="list.visibility === 'public' ? 'success' : 'info'">
            {{ list.visibility === 'public' ? $t('lists.public') : $t('lists.private') }}
          </el-tag>
          <span class="list-email">{{ list.email_local_part }}@domain</span>
        </p>
        <p v-if="list.description" class="list-description">{{ list.description }}</p>

        <el-tabs v-model="activeTab" style="margin-top: 24px;">
          <el-tab-pane :label="$t('lists.messages')" name="messages">
            <el-empty v-if="messages.length === 0" :description="$t('moderation.empty')" />
            <el-timeline v-else>
              <el-timeline-item v-for="m in messages" :key="m.id" :timestamp="m.received_at">
                <el-card>
                  <h4>{{ m.subject }}</h4>
                  <p>From: {{ m.from_name || m.from_addr }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>

          <el-tab-pane :label="$t('lists.info')" name="info">
            <el-card>
              <el-form label-width="120px">
                <el-form-item :label="$t('lists.name')">{{ list.name }}</el-form-item>
                <el-form-item :label="$t('lists.displayName')">{{ list.display_name || '-' }}</el-form-item>
                <el-form-item :label="$t('lists.visibility')">{{ list.visibility }}</el-form-item>
                <el-form-item :label="$t('lists.postPolicy')">{{ list.post_policy }}</el-form-item>
                <el-form-item :label="$t('app.status')">
                  <el-tag :type="list.is_active ? 'success' : 'info'">{{ list.is_active ? $t('lists.active') : $t('lists.inactive') }}</el-tag>
                </el-form-item>
                <el-form-item :label="$t('lists.createdAt')">{{ list.created_at }}</el-form-item>
              </el-form>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </div>

      <el-empty v-else :description="$t('app.loading')" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { listApi, configApi } from '../api/index'
import LangSwitch from '../components/LangSwitch.vue'

const route = useRoute()
const { t } = useI18n()
const list = ref(null)
const messages = ref([])
const loading = ref(false)
const activeTab = ref('messages')
const branding = ref({ site_name: '', primary_color: '#409EFF', logo_url: '' })

onMounted(async () => {
  try {
    const res = await configApi.public()
    const data = res.data || res
    branding.value = data
    if (data.site_name) {
      document.title = `${data.site_name} - ${t('lists.detail')}`
    }
  } catch (e) {
    console.error(e)
  }

  const id = route.params.id
  loading.value = true
  try {
    const res = await listApi.get(id)
    list.value = res.data
    const m = await listApi.listMessages(id)
    messages.value = m.data.items || []
  } catch (e) {
    ElMessage.error(e.message || t('app.loading'))
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.public-detail-page {
  min-height: 100vh;
  background: #f5f7fa;
}
.public-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 0 24px;
  height: 60px;
}
.public-logo {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo-img {
  max-height: 36px;
  max-width: 160px;
}
.public-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.public-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
}
.list-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
}
.list-email {
  color: #909399;
  font-size: 14px;
}
.list-description {
  color: #606266;
  font-size: 14px;
  margin: 16px 0;
}
</style>
