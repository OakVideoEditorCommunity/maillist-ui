// Vitest setup file: provide localStorage and other DOM globals for jsdom
class StorageMock {
  constructor() {
    this.store = {}
  }
  getItem(key) {
    return this.store[key] || null
  }
  setItem(key, value) {
    this.store[key] = String(value)
  }
  removeItem(key) {
    delete this.store[key]
  }
  clear() {
    this.store = {}
  }
  key(index) {
    return Object.keys(this.store)[index] || null
  }
  get length() {
    return Object.keys(this.store).length
  }
}

Object.defineProperty(window, 'localStorage', {
  value: new StorageMock(),
})
