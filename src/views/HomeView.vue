<template>
  <div class="home-page">
    <el-header class="home-header">
      <div class="home-logo" @click="$router.push('/')">
        <img v-if="branding.logo_url" :src="branding.logo_url" class="logo-img" />
        <span v-else>{{ branding.site_name || $t('app.name') }}</span>
      </div>
      <div class="home-actions">
        <LangSwitch />
        <el-button type="primary" @click="$router.push('/console')">{{ $t('nav.console') }}</el-button>
        <el-button @click="$router.push('/login')">{{ $t('auth.login') }}</el-button>
      </div>
    </el-header>

    <div class="home-content">
      <h1 class="home-title">{{ $t('home.browseLists') }}</h1>

      <el-alert
        type="info"
        :closable="false"
        style="margin-bottom: 24px;"
      >
        <template #title>
          <div style="line-height: 1.8;">
            <p><strong>{{ $t('home.subscribeHint', { email: 'list-address@example.com' }) }}</strong></p>
            <p><strong>{{ $t('home.unsubscribeHint', { email: 'list-address@example.com' }) }}</strong></p>
          </div>
        </template>
      </el-alert>

      <el-empty v-if="!loading && lists.length === 0" :description="$t('home.noPublicLists')" />

      <el-row :gutter="20" v-loading="loading">
        <el-col :span="8" v-for="list in lists" :key="list.id" style="margin-bottom: 20px;">
          <el-card shadow="hover" class="list-card" @click="$router.push(`/lists/${list.id}`)">
            <template #header>
              <div class="list-card-header">
                <span>{{ list.display_name || list.name }}</span>
                <el-tag size="small" :type="list.visibility === 'public' ? 'success' : 'info'">
                  {{ list.visibility === 'public' ? $t('lists.public') : $t('lists.private') }}
                </el-tag>
              </div>
            </template>
            <p v-if="list.description" class="list-description">{{ list.description }}</p>
            <p class="list-email">{{ list.email_local_part }}@...</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { listApi, configApi } from '../api/index'
import LangSwitch from '../components/LangSwitch.vue'

const { t } = useI18n()
const lists = ref([])
const loading = ref(false)
const branding = ref({ site_name: '', primary_color: '#409EFF', logo_url: '' })

onMounted(async () => {
  try {
    const res = await configApi.public()
    const data = res.data || res
    branding.value = data
    if (data.site_name) {
      document.title = data.site_name
    }
  } catch (e) {
    console.error(e)
  }

  loading.value = true
  try {
    const res = await listApi.list()
    lists.value = res.data.items || []
  } catch (e) {
    ElMessage.error(e.message || t('app.loading'))
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f5f7fa;
}
.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 0 24px;
  height: 60px;
}
.home-logo {
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
.home-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.home-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}
.home-title {
  text-align: center;
  margin-bottom: 32px;
  color: #303133;
  font-size: 28px;
}
.list-card {
  cursor: pointer;
  transition: transform 0.2s;
}
.list-card:hover {
  transform: translateY(-4px);
}
.list-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
}
.list-description {
  color: #606266;
  font-size: 14px;
  margin: 8px 0;
  min-height: 40px;
}
.list-email {
  color: #909399;
  font-size: 12px;
  margin: 0;
}
</style>
