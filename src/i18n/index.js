import { createI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
import en from './locales/en.json'
import zh from './locales/zh.json'

const messages = { en, zh }

function getLocale() {
  const cookieLang = Cookies.get('app_locale')
  if (cookieLang && messages[cookieLang]) return cookieLang
  const browserLang = navigator.language.split('-')[0]
  if (messages[browserLang]) return browserLang
  return 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getLocale(),
  fallbackLocale: 'en',
  messages,
})

export function setLocale(lang) {
  i18n.global.locale.value = lang
  Cookies.set('app_locale', lang, { expires: 365, sameSite: 'Lax' })
}

export function getLocaleCookie() {
  return Cookies.get('app_locale')
}

export default i18n
