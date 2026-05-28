<template>
  <div v-loading="loading">
    <el-page-header @back="$router.push('/lists')" :title="list?.display_name || list?.name || $t('lists.title')" />

    <el-tabs v-model="activeTab" style="margin-top: 20px;">
      <el-tab-pane :label="$t('lists.info')" name="info">
        <el-card>
          <el-form :model="list" label-width="120px" v-if="list">
            <el-form-item :label="$t('lists.name')">{{ list.name }}</el-form-item>
            <el-form-item label="Email">{{ list.email_local_part }}@domain</el-form-item>
            <el-form-item :label="$t('lists.visibility')">{{ list.visibility }}</el-form-item>
            <el-form-item :label="$t('lists.postPolicy')">{{ list.post_policy }}</el-form-item>
            <el-form-item :label="$t('app.status')">
              <el-tag :type="list.is_active ? 'success' : 'info'">{{ list.is_active ? $t('lists.active') : $t('lists.inactive') }}</el-tag>
            </el-form-item>
            <el-form-item :label="$t('lists.createdAt')">{{ list.created_at }}</el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <el-tab-pane :label="$t('lists.subscribers')" name="subscribers">
        <el-table :data="subscribers" size="small">
          <el-table-column prop="email" label="Email" />
          <el-table-column prop="name" :label="$t('auth.name')" />
          <el-table-column prop="status" :label="$t('app.status')" />
          <el-table-column prop="digest_mode" label="Digest" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane :label="$t('lists.messages')" name="messages">
        <el-empty v-if="messages.length === 0" :description="$t('moderation.empty')" />
        <el-timeline v-else>
          <el-timeline-item v-for="m in messages" :key="m.id" :timestamp="m.received_at">
            <el-card>
              <h4>{{ m.subject }}</h4>
              <p>From: {{ m.from_addr }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { listApi } from '../api/index'

const route = useRoute()
const list = ref(null)
const subscribers = ref([])
const messages = ref([])
const loading = ref(false)
const activeTab = ref('info')

onMounted(async () => {
  const id = route.params.id
  loading.value = true
  try {
    const res = await listApi.get(id)
    list.value = res.data
    const s = await listApi.listSubscribers(id)
    subscribers.value = s.data.items
    const m = await listApi.listMessages(id)
    messages.value = m.data.items
  } catch (e) {
    ElMessage.error(e.message)
  } finally {
    loading.value = false
  }
})
</script>
