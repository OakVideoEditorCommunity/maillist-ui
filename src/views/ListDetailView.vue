<template>
  <div v-loading="loading">
    <el-page-header @back="$router.push('/console/lists')" :title="list?.display_name || list?.name || $t('lists.title')" />

    <el-tabs v-model="activeTab" style="margin-top: 20px;">
      <el-tab-pane :label="$t('lists.info')" name="info">
        <el-card>
          <div style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
            <el-button type="primary" @click="editMode = !editMode">
              {{ editMode ? $t('app.cancel') : $t('app.edit') }}
            </el-button>
          </div>

          <el-form :model="editForm" label-width="120px" v-if="list">
            <el-form-item :label="$t('lists.name')">
              <span v-if="!editMode">{{ list.name }}</span>
              <el-input v-else v-model="editForm.name" disabled />
            </el-form-item>
            <el-form-item label="Email">
              <span v-if="!editMode">{{ list.email || `${list.email_local_part}@domain` }}</span>
              <el-input v-else v-model="editForm.email_local_part" disabled />
            </el-form-item>
            <el-form-item :label="$t('lists.displayName')">
              <span v-if="!editMode">{{ list.display_name || '-' }}</span>
              <el-input v-else v-model="editForm.display_name" />
            </el-form-item>
            <el-form-item :label="$t('lists.description')">
              <span v-if="!editMode">{{ list.description || '-' }}</span>
              <el-input v-else v-model="editForm.description" type="textarea" />
            </el-form-item>
            <el-form-item :label="$t('lists.visibility')">
              <span v-if="!editMode">{{ list.visibility }}</span>
              <el-radio-group v-else v-model="editForm.visibility">
                <el-radio label="public">{{ $t('lists.public') }}</el-radio>
                <el-radio label="private">{{ $t('lists.private') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('lists.postPolicy')">
              <span v-if="!editMode">{{ list.post_policy }}</span>
              <el-radio-group v-else v-model="editForm.post_policy">
                <el-radio label="open">{{ $t('lists.open') }}</el-radio>
                <el-radio label="subscriber_only">{{ $t('lists.subscriberOnly') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('app.status')">
              <el-tag :type="list.is_active ? 'success' : 'info'">{{ list.is_active ? $t('lists.active') : $t('lists.inactive') }}</el-tag>
            </el-form-item>
            <el-form-item :label="$t('lists.createdAt')">{{ list.created_at }}</el-form-item>
          </el-form>

          <div v-if="editMode" style="text-align: right;">
            <el-button @click="editMode = false">{{ $t('app.cancel') }}</el-button>
            <el-button type="primary" @click="handleSave">{{ $t('app.save') }}</el-button>
          </div>
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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { listApi } from '../api/index'

const route = useRoute()
const { t } = useI18n()
const list = ref(null)
const subscribers = ref([])
const messages = ref([])
const loading = ref(false)
const activeTab = ref('info')
const editMode = ref(false)
const editForm = ref({})

const fetch = async () => {
  const id = route.params.id
  loading.value = true
  try {
    const res = await listApi.get(id)
    list.value = res.data
    editForm.value = {
      name: res.data.name || '',
      display_name: res.data.display_name || '',
      email_local_part: res.data.email_local_part || '',
      description: res.data.description || '',
      visibility: res.data.visibility || 'public',
      post_policy: res.data.post_policy || 'subscriber_only',
    }
    const s = await listApi.listSubscribers(id)
    subscribers.value = s.data.items
    const m = await listApi.listMessages(id)
    messages.value = m.data.items
  } catch (e) {
    ElMessage.error(e.message)
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  try {
    await listApi.update(route.params.id, editForm.value)
    ElMessage.success(t('lists.saveSuccess'))
    editMode.value = false
    fetch()
  } catch (e) {
    ElMessage.error(e.message)
  }
}

watch(() => route.params.id, fetch)
onMounted(fetch)
</script>
