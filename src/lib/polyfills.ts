declare global {
  interface Map<K, V> {
    getOrInsertComputed?(key: K, compute: (key: K) => V): V
  }

  interface WeakMap<K extends WeakKey, V> {
    getOrInsertComputed?(key: K, compute: (key: K) => V): V
  }
}

const installGetOrInsertComputed = () => {
  if (typeof Map !== 'undefined' && !Map.prototype.getOrInsertComputed) {
    Object.defineProperty(Map.prototype, 'getOrInsertComputed', {
      value: function getOrInsertComputed<K, V>(
        this: Map<K, V>,
        key: K,
        compute: (key: K) => V,
      ) {
        if (this.has(key)) {
          return this.get(key) as V
        }

        const value = compute(key)
        this.set(key, value)
        return value
      },
      writable: true,
      configurable: true,
    })
  }

  if (typeof WeakMap !== 'undefined' && !WeakMap.prototype.getOrInsertComputed) {
    Object.defineProperty(WeakMap.prototype, 'getOrInsertComputed', {
      value: function getOrInsertComputed<K extends object, V>(
        this: WeakMap<K, V>,
        key: K,
        compute: (key: K) => V,
      ) {
        const existing = this.get(key)
        if (existing !== undefined) {
          return existing
        }

        const value = compute(key)
        this.set(key, value)
        return value
      },
      writable: true,
      configurable: true,
    })
  }
}

installGetOrInsertComputed()

export {}
