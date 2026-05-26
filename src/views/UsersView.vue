<template>
  <div>
    <h2>{{ $t('users.title') }}</h2>
    <el-table :data="users" style="margin-top: 20px;" v-loading="loading">
      <el-table-column prop="email" :label="$t('users.email')" />
      <el-table-column prop="name" :label="$t('users.nickname')" />
      <el-table-column prop="role" :label="$t('users.role')" />
      <el-table-column prop="is_active" :label="$t('app.status')">
        <template #default="{ row }">
          <el-tag :type="row.is_active ? 'success' : 'info'">{{ row.is_active ? $t('lists.active') : $t('lists.inactive') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" :label="$t('users.createdAt')" />
      <el-table-column :label="$t('app.actions')" width="150">
        <template #default="{ row }">
          <el-button link type="danger" @click="handleDelete(row.id)">{{ $t('app.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { userApi } from '../api/index'

const { t } = useI18n()
const users = ref([])
const loading = ref(false)

const fetch = async () => {
  loading.value = true
  try {
    const res = await userApi.listUsers()
    users.value = res.data
  } catch (e) {
    ElMessage.error(e.message)
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm(t('users.deleteConfirm'), t('app.confirm'), { type: 'warning' })
    await userApi.deleteUser(id)
    ElMessage.success(t('users.deleteSuccess'))
    fetch()
  } catch (e) {
    if (e !== 'cancel') ElMessage.error(e.message)
  }
}

onMounted(fetch)
</script>
