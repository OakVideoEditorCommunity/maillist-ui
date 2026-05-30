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
            <p><strong>{{ $t('home.subscribeHint') }}</strong></p>
            <p><strong>{{ $t('home.unsubscribeHint') }}</strong></p>
          </div>
        </template>
      </el-alert>

      <el-empty v-if="!loading && lists.length === 0" :description="$t('home.noPublicLists')" />

      <el-row :gutter="20" v-loading="loading">
        <el-col :span="8" v-for="list in lists" :key="list.id" style="margin-bottom: 20px;">
          <el-card shadow="hover" class="list-card">
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
            <div class="list-actions">
              <el-button type="primary" size="small" @click.stop="openSubscribe(list)">
                {{ $t('home.subscribeBtn') }}
              </el-button>
              <el-button size="small" @click.stop="$router.push(`/lists/${list.id}`)">
                {{ $t('app.detail') }}
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-dialog v-model="subscribeDialog.visible" :title="$t('home.subscribeBtn')" width="400px">
      <p style="margin-bottom: 12px; color: #606266;">
        {{ $t('home.subscribeHint') }}
      </p>
      <el-input
        v-model="subscribeDialog.email"
        :placeholder="$t('home.subscribePlaceholder')"
      />
      <template #footer>
        <el-button @click="subscribeDialog.visible = false">{{ $t('app.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubscribe">{{ $t('home.subscribeBtn') }}</el-button>
      </template>
    </el-dialog>
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
const subscribeDialog = ref({ visible: false, list: null, email: '' })

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
    // Public page: silently ignore 401, only show error for other failures
    if (e.message !== 'Unauthorized') {
      ElMessage.error(e.message || t('app.loading'))
    }
  } finally {
    loading.value = false
  }
})

const openSubscribe = (list) => {
  subscribeDialog.value = { visible: true, list, email: '' }
}

const handleSubscribe = async () => {
  const email = subscribeDialog.value.email.trim()
  if (!email) {
    ElMessage.warning(t('auth.email'))
    return
  }
  try {
    await listApi.subscribe(subscribeDialog.value.list.id, { email, name: '' })
    ElMessage.success(t('home.subscribeSuccess'))
    subscribeDialog.value.visible = false
  } catch (e) {
    ElMessage.error(e.message || 'Subscribe failed')
  }
}
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
  margin: 0 0 12px;
}
.list-actions {
  display: flex;
  gap: 8px;
}
</style>
