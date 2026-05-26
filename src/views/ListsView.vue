<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h2>{{ $t('lists.title') }}</h2>
      <el-button type="primary" @click="dialogVisible = true">{{ $t('lists.newList') }}</el-button>
    </div>

    <el-table :data="lists" style="margin-top: 20px;" v-loading="loading">
      <el-table-column prop="name" :label="$t('lists.name')" />
      <el-table-column prop="email_local_part" :label="$t('lists.emailPrefix')" />
      <el-table-column prop="visibility" :label="$t('lists.visibility')" />
      <el-table-column prop="post_policy" :label="$t('lists.postPolicy')" />
      <el-table-column prop="is_active" :label="$t('app.status')">
        <template #default="{ row }">
          <el-tag :type="row.is_active ? 'success' : 'info'">{{ row.is_active ? $t('lists.active') : $t('lists.inactive') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('app.actions')" width="200">
        <template #default="{ row }">
          <el-button link type="primary" @click="$router.push(`/lists/${row.id}`)">{{ $t('app.detail') }}</el-button>
          <el-button link type="danger" @click="handleDelete(row.id)">{{ $t('app.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="$t('lists.newList')" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item :label="$t('lists.domain')">
          <el-select v-model="form.domain_id" :placeholder="$t('lists.selectDomain')">
            <el-option v-for="d in domains" :key="d.id" :label="d.name" :value="d.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('lists.name')">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item :label="$t('lists.emailPrefix')">
          <el-input v-model="form.email_local_part" />
        </el-form-item>
        <el-form-item :label="$t('lists.description')">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item :label="$t('lists.visibility')">
          <el-radio-group v-model="form.visibility">
            <el-radio label="public">{{ $t('lists.public') }}</el-radio>
            <el-radio label="private">{{ $t('lists.private') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('lists.postPolicy')">
          <el-radio-group v-model="form.post_policy">
            <el-radio label="open">{{ $t('lists.open') }}</el-radio>
            <el-radio label="subscriber_only">{{ $t('lists.subscriberOnly') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('app.cancel') }}</el-button>
        <el-button type="primary" @click="handleCreate">{{ $t('app.create') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { listApi, domainApi } from '../api/index'

const { t } = useI18n()
const lists = ref([])
const domains = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const form = ref({ domain_id: '', name: '', email_local_part: '', description: '', visibility: 'public', post_policy: 'subscriber_only' })

const fetch = async () => {
  loading.value = true
  try {
    const res = await listApi.list()
    lists.value = res.data
    const d = await domainApi.list()
    domains.value = d.data
  } catch (e) {
    ElMessage.error(e.message)
  } finally {
    loading.value = false
  }
}

const handleCreate = async () => {
  try {
    await listApi.create(form.value)
    ElMessage.success(t('lists.createSuccess'))
    dialogVisible.value = false
    fetch()
  } catch (e) {
    ElMessage.error(e.message)
  }
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm(t('lists.deleteConfirm'), t('app.confirm'), { type: 'warning' })
    await listApi.delete(id)
    ElMessage.success(t('lists.deleteSuccess'))
    fetch()
  } catch (e) {
    if (e !== 'cancel') ElMessage.error(e.message)
  }
}

onMounted(fetch)
</script>
