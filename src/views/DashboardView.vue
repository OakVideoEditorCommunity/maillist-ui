<template>
  <div>
    <h2>{{ $t('dashboard.title') }}</h2>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-title">{{ $t('dashboard.users') }}</div>
          <div class="stat-value">{{ stats.users }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-title">{{ $t('dashboard.lists') }}</div>
          <div class="stat-value">{{ stats.lists }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-title">{{ $t('dashboard.subscribers') }}</div>
          <div class="stat-value">{{ stats.subscribers }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-title">{{ $t('dashboard.messages') }}</div>
          <div class="stat-value">{{ stats.messages }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>{{ $t('dashboard.pendingModeration') }}</template>
          <div style="font-size: 32px; color: #e6a23c;">{{ stats.pending_moderation }}</div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>{{ $t('dashboard.aiStats') }}</template>
          <div v-if="aiStats">
            <p>{{ $t('dashboard.total') }}: {{ aiStats.total }}</p>
            <p>{{ $t('dashboard.pending') }}: {{ aiStats.pending }}</p>
            <p>{{ $t('dashboard.approved') }}: {{ aiStats.approved }}</p>
            <p>{{ $t('dashboard.rejected') }}: {{ aiStats.rejected }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '../api/index'

const stats = ref({ users: 0, lists: 0, subscribers: 0, messages: 0, pending_moderation: 0 })
const aiStats = ref(null)

onMounted(async () => {
  try {
    const dash = await adminApi.dashboard()
    stats.value = dash.data
    const s = await adminApi.stats()
    stats.value.pending_moderation = s.data.pending_moderation
    const ai = await adminApi.aiModerationStats()
    aiStats.value = ai.data
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
.stat-title { color: #909399; font-size: 14px; }
.stat-value { font-size: 28px; font-weight: bold; color: #303133; margin-top: 8px; }
</style>
