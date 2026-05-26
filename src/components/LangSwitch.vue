<template>
  <el-dropdown @command="handleCommand" size="small">
    <el-button link>
      <el-icon><Globe /></el-icon>
      <span style="margin-left: 4px;">{{ currentLabel }}</span>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="en">{{ $t('lang.en') }}</el-dropdown-item>
        <el-dropdown-item command="zh">{{ $t('lang.zh') }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '../i18n'

const { locale } = useI18n()

const currentLabel = computed(() => {
  return locale.value === 'zh' ? '中文' : 'English'
})

const handleCommand = (cmd) => {
  setLocale(cmd)
}
</script>
