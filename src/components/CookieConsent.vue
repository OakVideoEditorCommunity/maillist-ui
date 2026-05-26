<template>
  <transition name="slide-up">
    <div v-if="visible" class="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div class="cookie-content">
        <div class="cookie-text">
          <strong>{{ $t('cookie.title') }}</strong>
          <p>{{ $t('cookie.message') }}</p>
          <p class="cookie-detail">{{ $t('cookie.essentialOnly') }}</p>
        </div>
        <div class="cookie-actions">
          <el-button type="primary" size="small" @click="accept">{{ $t('cookie.accept') }}</el-button>
          <el-button size="small" @click="reject">{{ $t('cookie.reject') }}</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Cookies from 'js-cookie'

const COOKIE_CONSENT_KEY = 'cookie_consent'
const visible = ref(false)

onMounted(() => {
  const consent = Cookies.get(COOKIE_CONSENT_KEY)
  if (!consent) {
    visible.value = true
  }
})

const accept = () => {
  Cookies.set(COOKIE_CONSENT_KEY, 'accepted', { expires: 365, sameSite: 'Lax' })
  visible.value = false
}

const reject = () => {
  Cookies.set(COOKIE_CONSENT_KEY, 'essential-only', { expires: 365, sameSite: 'Lax' })
  visible.value = false
}
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #e4e7ed;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  padding: 16px 24px;
}
.cookie-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.cookie-text p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #606266;
}
.cookie-detail {
  font-size: 12px;
  color: #909399;
}
.cookie-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
