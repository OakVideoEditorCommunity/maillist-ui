<template>
  <div>
    <h2>{{ $t('moderation.title') }}</h2>
    <el-empty v-if="items.length === 0" :description="$t('moderation.empty')" style="margin-top: 40px;" />
    <el-card v-for="item in items" :key="item.id" style="margin-top: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h4>{{ item.subject || '(' + $t('moderation.empty') + ')' }}</h4>
          <p>{{ $t('moderation.from') }}: {{ item.from_addr }}</p>
          <p>{{ $t('moderation.reason') }}: {{ item.reason }}</p>
          <p>{{ $t('moderation.source') }}: {{ item.source }}</p>
          <p v-if="item.ai_risk_score">{{ $t('moderation.aiRiskScore') }}: {{ item.ai_risk_score }}</p>
        </div>
        <div>
          <el-button type="success" size="small" @click="handleApprove(item.id)">{{ $t('moderation.approve') }}</el-button>
          <el-button type="danger" size="small" @click="handleReject(item.id)">{{ $t('moderation.reject') }}</el-button>
          <el-button size="small" @click="handleDiscard(item.id)">{{ $t('moderation.discard') }}</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { moderationApi, adminApi } from '../api/index'

const { t } = useI18n()
const items = ref([])

const fetch = async () => {
  try {
    const res = await adminApi.stats()
    if (res.data.pending_moderation > 0) {
      items.value = []
    }
  } catch (e) {
    console.error(e)
  }
}

const handleApprove = async (id) => {
  try {
    await moderationApi.approve(id)
    ElMessage.success(t('moderation.approveSuccess'))
    fetch()
  } catch (e) {
    ElMessage.error(e.message)
  }
}

const handleReject = async (id) => {
  try {
    await moderationApi.reject(id)
    ElMessage.success(t('moderation.rejectSuccess'))
    fetch()
  } catch (e) {
    ElMessage.error(e.message)
  }
}

const handleDiscard = async (id) => {
  try {
    await moderationApi.discard(id)
    ElMessage.success(t('moderation.discardSuccess'))
    fetch()
  } catch (e) {
    ElMessage.error(e.message)
  }
}

onMounted(fetch)
</script>
