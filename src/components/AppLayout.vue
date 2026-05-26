<template>
  <el-container class="layout">
    <el-aside width="220px" class="sidebar">
      <div class="logo">{{ $t('app.name') }}</div>
      <el-menu
        :default-active="$route.path"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        class="menu"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataLine /></el-icon>
          <span>{{ $t('nav.dashboard') }}</span>
        </el-menu-item>
        <el-menu-item index="/lists">
          <el-icon><Message /></el-icon>
          <span>{{ $t('nav.lists') }}</span>
        </el-menu-item>
        <el-menu-item index="/domains">
          <el-icon><Link /></el-icon>
          <span>{{ $t('nav.domains') }}</span>
        </el-menu-item>
        <el-menu-item index="/moderation">
          <el-icon><Warning /></el-icon>
          <span>{{ $t('nav.moderation') }}</span>
        </el-menu-item>
        <el-menu-item index="/templates">
          <el-icon><Document /></el-icon>
          <span>{{ $t('nav.templates') }}</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>{{ $t('nav.users') }}</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>{{ $t('nav.settings') }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-right">
          <LangSwitch />
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              {{ user?.email || $t('nav.profile') }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">{{ $t('nav.profile') }}</el-dropdown-item>
                <el-dropdown-item command="mfa">{{ $t('nav.mfa') }}</el-dropdown-item>
                <el-dropdown-item divided command="logout">{{ $t('nav.logout') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { userApi } from '../api/index'
import LangSwitch from './LangSwitch.vue'
import { applyUserLocale } from '../i18n'

const router = useRouter()
const { t } = useI18n()
const user = ref(null)

onMounted(async () => {
  try {
    const res = await userApi.me()
    user.value = res.data
    // Sync language from user profile
    if (res.data.language) {
      applyUserLocale(res.data.language)
    }
  } catch (e) {
    console.error(e)
  }
})

const handleCommand = (cmd) => {
  if (cmd === 'logout') {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    ElMessage.success(t('auth.logoutSuccess'))
    router.push('/login')
  } else if (cmd === 'profile') {
    router.push('/profile')
  } else if (cmd === 'mfa') {
    router.push('/profile?tab=mfa')
  }
}
</script>

<style scoped>
.layout {
  height: 100vh;
}
.sidebar {
  background: #304156;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #1f2d3d;
}
.menu {
  border-right: none;
}
.header {
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-info {
  cursor: pointer;
  color: #606266;
  font-size: 14px;
}
.main {
  background: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style>
