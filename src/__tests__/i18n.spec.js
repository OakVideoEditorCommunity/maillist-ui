import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  normalizeLocale,
  detectBrowserLocale,
  resolveLocale,
  setLocale,
  applyUserLocale,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
} from '../i18n/index'
import i18n from '../i18n/index'

describe('normalizeLocale', () => {
  it('returns supported locale for exact match', () => {
    expect(normalizeLocale('en')).toBe('en')
    expect(normalizeLocale('zh')).toBe('zh')
  })

  it('extracts primary language code from hyphenated locales', () => {
    expect(normalizeLocale('zh-CN')).toBe('zh')
    expect(normalizeLocale('zh-TW')).toBe('zh')
    expect(normalizeLocale('zh-HK')).toBe('zh')
    expect(normalizeLocale('en-US')).toBe('en')
    expect(normalizeLocale('en-GB')).toBe('en')
  })

  it('falls back to default for unsupported languages', () => {
    expect(normalizeLocale('fr')).toBe('en')
    expect(normalizeLocale('de')).toBe('en')
    expect(normalizeLocale('ja')).toBe('en')
    expect(normalizeLocale('ko')).toBe('en')
  })

  it('falls back to default for empty/null input', () => {
    expect(normalizeLocale('')).toBe('en')
    expect(normalizeLocale(null)).toBe('en')
    expect(normalizeLocale(undefined)).toBe('en')
  })
})

describe('detectBrowserLocale', () => {
  const originalLanguage = window.navigator.language
  const originalLanguages = window.navigator.languages

  beforeEach(() => {
    vi.stubGlobal('navigator', {
      language: 'en-US',
      languages: ['en-US', 'en'],
    })
  })

  it('detects from navigator.language', () => {
    expect(detectBrowserLocale()).toBe('en')
  })

  it('detects Chinese from navigator.language', () => {
    vi.stubGlobal('navigator', {
      language: 'zh-CN',
      languages: ['zh-CN', 'zh', 'en'],
    })
    expect(detectBrowserLocale()).toBe('zh')
  })

  it('falls back to default when navigator.language is unsupported', () => {
    vi.stubGlobal('navigator', {
      language: 'fr-FR',
      languages: ['fr-FR', 'fr'],
    })
    expect(detectBrowserLocale()).toBe('en')
  })

  it('falls back to default when navigator.language is missing', () => {
    vi.stubGlobal('navigator', {
      language: undefined,
      languages: undefined,
    })
    expect(detectBrowserLocale()).toBe('en')
  })
})

describe('resolveLocale', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('navigator', {
      language: 'en-US',
      languages: ['en-US', 'en'],
    })
  })

  it('uses user preference when provided', () => {
    expect(resolveLocale('zh')).toBe('zh')
    expect(resolveLocale('zh-CN')).toBe('zh')
    expect(resolveLocale('en')).toBe('en')
  })

  it('ignores unsupported user preference and falls back to default', () => {
    expect(resolveLocale('fr')).toBe('en')
  })

  it('uses localStorage when no user preference', () => {
    localStorage.setItem('app_locale', 'zh')
    expect(resolveLocale()).toBe('zh')
  })

  it('uses browser detection when nothing else', () => {
    vi.stubGlobal('navigator', { language: 'zh-CN', languages: ['zh-CN'] })
    expect(resolveLocale()).toBe('zh')
  })

  it('falls back to default when all else fails', () => {
    vi.stubGlobal('navigator', { language: undefined, languages: undefined })
    expect(resolveLocale()).toBe('en')
  })
})

describe('setLocale', () => {
  it('sets locale to supported language', () => {
    setLocale('zh')
    expect(i18n.global.locale.value).toBe('zh')
    expect(localStorage.getItem('app_locale')).toBe('zh')
  })

  it('normalizes locale before setting', () => {
    setLocale('zh-CN')
    expect(i18n.global.locale.value).toBe('zh')
    expect(localStorage.getItem('app_locale')).toBe('zh')
  })

  it('ignores unsupported locales and keeps current', () => {
    setLocale('en')
    setLocale('fr')
    expect(i18n.global.locale.value).toBe('en')
  })
})

describe('applyUserLocale', () => {
  it('applies user language from backend', () => {
    applyUserLocale('zh')
    expect(i18n.global.locale.value).toBe('zh')
    expect(localStorage.getItem('app_locale')).toBe('zh')
  })

  it('falls back to default for unsupported user language', () => {
    applyUserLocale('fr')
    expect(i18n.global.locale.value).toBe('en')
  })
})

describe('constants', () => {
  it('has correct supported locales', () => {
    expect(SUPPORTED_LOCALES).toEqual(['en', 'zh'])
  })

  it('has correct default locale', () => {
    expect(DEFAULT_LOCALE).toBe('en')
  })
})
