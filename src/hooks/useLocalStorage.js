import { useState, useEffect } from 'react'
import { loadJSON, saveJSON } from '../utils/storage'

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => loadJSON(key, defaultValue))

  useEffect(() => {
    saveJSON(key, value)
  }, [key, value])

  return [value, setValue]
}
