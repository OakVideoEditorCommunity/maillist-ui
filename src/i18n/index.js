import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

export const SUPPORTED_LOCALES = ['en', 'zh']
export const DEFAULT_LOCALE = 'en'

const messages = { en, zh }

/**
 * Normalize a raw locale string to one of our supported locales.
 * e.g. 'zh-CN' -> 'zh', 'zh-TW' -> 'zh', 'en-US' -> 'en', 'fr' -> 'en' (fallback)
 */
export function normalizeLocale(raw) {
  if (!raw) return DEFAULT_LOCALE
  const primary = raw.split('-')[0].toLowerCase()
  if (SUPPORTED_LOCALES.includes(primary)) return primary
  return DEFAULT_LOCALE
}

/**
 * Detect browser preferred language.
 */
export function detectBrowserLocale() {
  const raw = navigator.language || navigator.languages?.[0] || 'en'
  return normalizeLocale(raw)
}

/**
 * Resolve effective locale from an optional user preference.
 * Priority: user preference > browser detection > default.
 */
export function resolveLocale(userPreference) {
  if (userPreference) {
    const normalized = normalizeLocale(userPreference)
    if (SUPPORTED_LOCALES.includes(normalized)) return normalized
  }
  const stored = localStorage.getItem('app_locale')
  if (stored && SUPPORTED_LOCALES.includes(stored)) return stored
  return detectBrowserLocale()
}

const i18n = createI18n({
  legacy: false,
  locale: resolveLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages,
})

/**
 * Set locale globally. For logged-in users this should also sync to backend.
 */
export function setLocale(lang) {
  const normalized = normalizeLocale(lang)
  if (!SUPPORTED_LOCALES.includes(normalized)) return
  i18n.global.locale.value = normalized
  localStorage.setItem('app_locale', normalized)
}

/**
 * Apply user language from backend profile.
 */
export function applyUserLocale(userLanguage) {
  const locale = resolveLocale(userLanguage)
  i18n.global.locale.value = locale
  localStorage.setItem('app_locale', locale)
}

export default i18n
