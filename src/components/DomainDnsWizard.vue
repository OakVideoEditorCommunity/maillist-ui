<template>
  <el-drawer
    v-model="visible"
    :title="$t('domains.dnsConfig')"
    size="600px"
    destroy-on-close
  >
    <div v-loading="loading">
      <el-alert
        type="info"
        :closable="false"
        style="margin-bottom: 16px;"
      >
        {{ $t('domains.dnsConfigHint') }}
      </el-alert>

      <!-- SPF -->
      <el-card shadow="never" style="margin-bottom: 16px;">
        <template #header>
          <div style="display: flex; align-items: center; gap: 8px;">
            <el-tag :type="spfStatus.type" size="small">SPF</el-tag>
            <span style="font-weight: 600;">{{ $t('domains.spfRecord') }}</span>
          </div>
        </template>
        <div v-if="records.spf">
          <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <el-input :model-value="records.spf" readonly />
            <el-button @click="copy(records.spf)">{{ $t('app.copy') }}</el-button>
          </div>
          <el-text type="info" size="small">
            {{ $t('domains.addTxtRecord') }} <code>@</code>
          </el-text>
        </div>
        <el-empty v-else :description="$t('domains.loading')" />
      </el-card>

      <!-- DKIM -->
      <el-card shadow="never" style="margin-bottom: 16px;">
        <template #header>
          <div style="display: flex; align-items: center; gap: 8px;">
            <el-tag :type="dkimStatus.type" size="small">DKIM</el-tag>
            <span style="font-weight: 600;">{{ $t('domains.dkimRecord') }}</span>
          </div>
        </template>
        <div v-if="domain.dkim_selector">
          <div v-if="records.dkim" style="margin-bottom: 8px;">
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
              <el-input :model-value="records.dkim.dns_record" readonly />
              <el-button @click="copy(records.dkim.dns_record)">{{ $t('app.copy') }}</el-button>
            </div>
            <el-text type="info" size="small">
              {{ $t('domains.addTxtRecord') }} <code>{{ records.dkim.selector }}._domainkey</code>
            </el-text>
          </div>
        </div>
        <div v-else>
          <el-button type="primary" @click="generateDkim" :loading="generatingDkim">
            {{ $t('domains.generateDkim') }}
          </el-button>
        </div>
      </el-card>

      <!-- DMARC -->
      <el-card shadow="never" style="margin-bottom: 16px;">
        <template #header>
          <div style="display: flex; align-items: center; gap: 8px;">
            <el-tag :type="dmarcStatus.type" size="small">DMARC</el-tag>
            <span style="font-weight: 600;">{{ $t('domains.dmarcRecord') }}</span>
          </div>
        </template>
        <div v-if="records.dmarc">
          <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <el-input :model-value="records.dmarc" readonly />
            <el-button @click="copy(records.dmarc)">{{ $t('app.copy') }}</el-button>
          </div>
          <el-text type="info" size="small">
            {{ $t('domains.addTxtRecord') }} <code>_dmarc</code>
          </el-text>
        </div>
        <el-empty v-else :description="$t('domains.loading')" />
      </el-card>

      <!-- SMTP Test -->
      <el-card shadow="never" style="margin-bottom: 16px;">
        <template #header>
          <span style="font-weight: 600;">{{ $t('domains.smtpTest') }}</span>
        </template>
        <el-button type="primary" @click="testSmtp" :loading="testingSmtp">
          {{ $t('domains.sendTestEmail') }}
        </el-button>
      </el-card>

      <!-- Actions -->
      <div style="display: flex; justify-content: flex-end; gap: 8px;">
        <el-button @click="visible = false">{{ $t('app.close') }}</el-button>
        <el-button type="primary" @click="verifyDns" :loading="verifying">
          {{ $t('domains.verifyDns') }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { domainApi } from '../api/index'

const { t } = useI18n()
const props = defineProps({ domainId: String })
const emit = defineEmits(['updated'])

const visible = defineModel({ type: Boolean, default: false })

const loading = ref(false)
const generatingDkim = ref(false)
const verifying = ref(false)
const testingSmtp = ref(false)
const domain = ref({})
const records = ref({ spf: '', dkim: null, dmarc: '' })
const verification = ref({ spf: null, dkim: null, dmarc: null })

const spfStatus = computed(() => {
  if (!verification.value.spf) return { type: 'info' }
  return { type: verification.value.spf.valid ? 'success' : 'danger' }
})

const dkimStatus = computed(() => {
  if (!verification.value.dkim) return { type: 'info' }
  return { type: verification.value.dkim.valid ? 'success' : 'danger' }
})

const dmarcStatus = computed(() => {
  if (!verification.value.dmarc) return { type: 'info' }
  return { type: verification.value.dmarc.valid ? 'success' : 'danger' }
})

const fetchDomain = async () => {
  if (!props.domainId) return
  loading.value = true
  try {
    const res = await domainApi.get(props.domainId)
    domain.value = res.data
    await fetchRecords()
  } catch (e) {
    ElMessage.error(e.message)
  } finally {
    loading.value = false
  }
}

const fetchRecords = async () => {
  if (!props.domainId) return
  try {
    const res = await domainApi.getDnsRecords(props.domainId)
    records.value = res.data
  } catch (e) {
    ElMessage.error(e.message)
  }
}

const generateDkim = async () => {
  generatingDkim.value = true
  try {
    await domainApi.generateDkim(props.domainId)
    ElMessage.success(t('domains.dkimGenerated'))
    await fetchDomain()
    emit('updated')
  } catch (e) {
    ElMessage.error(e.message)
  } finally {
    generatingDkim.value = false
  }
}

const verifyDns = async () => {
  verifying.value = true
  try {
    const res = await domainApi.verifyDns(props.domainId)
    verification.value = {
      spf: res.data.spf,
      dkim: res.data.dkim,
      dmarc: res.data.dmarc,
    }
    ElMessage.success(t('domains.verificationComplete'))
    emit('updated')
  } catch (e) {
    ElMessage.error(e.message)
  } finally {
    verifying.value = false
  }
}

const testSmtp = async () => {
  testingSmtp.value = true
  try {
    const res = await domainApi.testSmtp(props.domainId)
    ElMessage.success(res.data.message)
  } catch (e) {
    ElMessage.error(e.message)
  } finally {
    testingSmtp.value = false
  }
}

const copy = (text) => {
  navigator.clipboard.writeText(text)
  ElMessage.success(t('app.copied'))
}

watch(() => visible.value, (v) => {
  if (v) {
    fetchDomain()
  }
})
</script>
