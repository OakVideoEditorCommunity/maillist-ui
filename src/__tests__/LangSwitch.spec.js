import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import LangSwitch from '../components/LangSwitch.vue'
import i18n, { setLocale } from '../i18n/index'

vi.mock('../api/index', () => ({
  userApi: {
    updateMe: vi.fn().mockResolvedValue({}),
  },
}))

describe('LangSwitch', () => {
  beforeEach(() => {
    localStorage.clear()
    setLocale('en')
  })

  it('renders current language label', () => {
    const wrapper = mount(LangSwitch, {
      global: { plugins: [i18n] },
    })
    expect(wrapper.text()).toContain('English')
  })

  it('shows dropdown with language options', async () => {
    const wrapper = mount(LangSwitch, {
      global: {
        plugins: [i18n],
        stubs: {
          ElDropdown: { template: '<div class="el-dropdown"><slot /></div><slot name="dropdown" />', name: 'ElDropdown' },
          ElButton: { template: '<button><slot /></button>', name: 'ElButton' },
          ElIcon: { template: '<i><slot /></i>', name: 'ElIcon' },
          ElDropdownMenu: { template: '<div><slot /></div>', name: 'ElDropdownMenu' },
          ElDropdownItem: { template: '<div><slot /></div>', name: 'ElDropdownItem' },
        },
      },
    })
    const dropdown = wrapper.findComponent({ name: 'ElDropdown' })
    expect(dropdown.exists()).toBe(true)
  })
})
