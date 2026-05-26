import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import CookieConsent from '../components/CookieConsent.vue'
import i18n from '../i18n/index'

describe('CookieConsent', () => {
  beforeEach(() => {
    // Clear all cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
    })
  })

  it('renders banner when no consent cookie exists', async () => {
    const wrapper = mount(CookieConsent, {
      global: { plugins: [i18n] },
    })
    await nextTick()
    expect(wrapper.find('.cookie-banner').exists()).toBe(true)
    expect(wrapper.text()).toContain('Cookie')
  })

  it('hides banner when consent cookie exists', async () => {
    document.cookie = 'cookie_consent=accepted; path=/'
    const wrapper = mount(CookieConsent, {
      global: { plugins: [i18n] },
    })
    await nextTick()
    expect(wrapper.find('.cookie-banner').exists()).toBe(false)
  })

  it('accept button sets cookie and hides banner', async () => {
    const wrapper = mount(CookieConsent, {
      global: {
        plugins: [i18n],
        stubs: { ElButton: { template: '<button><slot /></button>', name: 'ElButton' } },
      },
    })
    await nextTick()
    const btn = wrapper.findAll('button').find(b => b.text().includes('Accept') || b.text().includes('接受'))
    expect(btn).toBeDefined()
    await btn.trigger('click')
    await nextTick()
    expect(document.cookie).toContain('cookie_consent=accepted')
    expect(wrapper.find('.cookie-banner').exists()).toBe(false)
  })

  it('reject button sets essential-only cookie and hides banner', async () => {
    const wrapper = mount(CookieConsent, {
      global: {
        plugins: [i18n],
        stubs: { ElButton: { template: '<button><slot /></button>', name: 'ElButton' } },
      },
    })
    await nextTick()
    const buttons = wrapper.findAll('button')
    const rejectBtn = buttons.find(b =>
      b.text().includes('Reject') || b.text().includes('拒绝')
    )
    expect(rejectBtn).toBeDefined()
    await rejectBtn.trigger('click')
    await nextTick()
    expect(document.cookie).toContain('cookie_consent=essential-only')
    expect(wrapper.find('.cookie-banner').exists()).toBe(false)
  })
})
