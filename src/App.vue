<template>
  <router-view />
  <CookieConsent />
</template>

<script setup>
import { onMounted } from 'vue'
import CookieConsent from './components/CookieConsent.vue'
import { configApi } from './api/index'

onMounted(async () => {
  try {
    const res = await configApi.public()
    const data = res.data || res
    if (data.site_name) {
      document.title = data.site_name
    }
  } catch (e) {
    console.error(e)
  }
})
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', Arial, sans-serif;
}
</style>
