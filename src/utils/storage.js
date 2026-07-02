// Petit wrapper localStorage tolérant aux erreurs (mode privé, quota, etc.)

const PREFIX = 'qrt_'

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch (e) {
    console.warn('loadJSON failed for', key, e)
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    return true
  } catch (e) {
    console.warn('saveJSON failed for', key, e)
    return false
  }
}
