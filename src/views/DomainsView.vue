<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h2>{{ $t('domains.title') }}</h2>
      <el-button type="primary" @click="dialogVisible = true">{{ $t('domains.addDomain') }}</el-button>
    </div>

    <el-table :data="domains" style="margin-top: 20px;" v-loading="loading">
      <el-table-column prop="name" :label="$t('domains.domainName')" />
      <el-table-column :label="$t('domains.dnsStatus')" width="200">
        <template #default="{ row }">
          <el-tag v-if="row.spf_verified && row.dkim_verified && row.dmarc_verified" type="success" size="small">{{ $t('domains.verified') }}</el-tag>
          <el-tag v-else type="warning" size="small">{{ $t('domains.pending') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" :label="$t('lists.createdAt')" />
      <el-table-column :label="$t('app.actions')" width="250">
        <template #default="{ row }">
          <el-button link type="primary" @click="openWizard(row.id)">{{ $t('domains.dnsConfig') }}</el-button>
          <el-button link type="danger" @click="handleDelete(row.id)">{{ $t('app.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="$t('domains.addDomain')" width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item :label="$t('domains.domainName')">
          <el-input v-model="form.name" placeholder="example.com" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('app.cancel') }}</el-button>
        <el-button type="primary" @click="handleCreate">{{ $t('app.create') }}</el-button>
      </template>
    </el-dialog>

    <DomainDnsWizard
      v-model="wizardVisible"
      :domain-id="selectedDomainId"
      @updated="fetch"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { domainApi } from '../api/index'
import DomainDnsWizard from '../components/DomainDnsWizard.vue'

const { t } = useI18n()
const domains = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const wizardVisible = ref(false)
const selectedDomainId = ref('')
const form = ref({ name: '' })

const fetch = async () => {
  loading.value = true
  try {
    const res = await domainApi.list()
    domains.value = res.data
  } catch (e) {
    ElMessage.error(e.message)
  } finally {
    loading.value = false
  }
}

const handleCreate = async () => {
  try {
    await domainApi.create(form.value)
    ElMessage.success(t('domains.addSuccess'))
    dialogVisible.value = false
    form.value.name = ''
    fetch()
  } catch (e) {
    ElMessage.error(e.message)
  }
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm(t('domains.deleteConfirm'), t('app.confirm'), { type: 'warning' })
    await domainApi.delete(id)
    ElMessage.success(t('domains.deleteSuccess'))
    fetch()
  } catch (e) {
    if (e !== 'cancel') ElMessage.error(e.message)
  }
}

const openWizard = (id) => {
  selectedDomainId.value = id
  wizardVisible.value = true
}

onMounted(fetch)
</script>
