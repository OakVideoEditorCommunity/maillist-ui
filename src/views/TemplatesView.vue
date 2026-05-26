<template>
  <div>
    <h2>{{ $t('templates.title') }}</h2>
    <el-table :data="templates" style="margin-top: 20px;" v-loading="loading">
      <el-table-column prop="name" :label="$t('templates.name')" />
      <el-table-column prop="subject" :label="$t('templates.subject')" />
      <el-table-column prop="is_system" :label="$t('templates.systemTemplate')">
        <template #default="{ row }">
          <el-tag :type="row.is_system ? 'info' : 'success'">{{ row.is_system ? $t('app.yes') : $t('app.no') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('app.actions')" width="200">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">{{ $t('app.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="$t('app.edit')" width="700px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item :label="$t('templates.subject')">
          <el-input v-model="editForm.subject" />
        </el-form-item>
        <el-form-item :label="$t('templates.bodyText')">
          <el-input v-model="editForm.body_text" type="textarea" rows="6" />
        </el-form-item>
        <el-form-item :label="$t('templates.bodyHtml')">
          <el-input v-model="editForm.body_html" type="textarea" rows="6" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('app.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave">{{ $t('app.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { templateApi } from '../api/index'

const { t } = useI18n()
const templates = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const editForm = ref({ name: '', subject: '', body_text: '', body_html: '' })

const fetch = async () => {
  loading.value = true
  try {
    const res = await templateApi.list()
    templates.value = res.data
  } catch (e) {
    ElMessage.error(e.message)
  } finally {
    loading.value = false
  }
}

const openEdit = async (row) => {
  try {
    const res = await templateApi.get(row.name)
    editForm.value = { ...res.data }
    dialogVisible.value = true
  } catch (e) {
    ElMessage.error(e.message)
  }
}

const handleSave = async () => {
  try {
    await templateApi.update(editForm.value.name, {
      subject: editForm.value.subject,
      body_text: editForm.value.body_text,
      body_html: editForm.value.body_html,
    })
    ElMessage.success(t('templates.saveSuccess'))
    dialogVisible.value = false
    fetch()
  } catch (e) {
    ElMessage.error(e.message)
  }
}

onMounted(fetch)
</script>
