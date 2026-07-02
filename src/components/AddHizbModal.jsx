import { useState } from 'react'

export default function AddHizbModal({ open, onClose, onAdd, existingList, theme }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const isDark = theme === 'dark'

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    const n = Number(value)
    if (!Number.isInteger(n) || n < 1 || n > 60) {
      setError('Entre un numéro de Hizb valide (1 à 60).')
      return
    }
    if (existingList.includes(n)) {
      setError('Ce Hizb est déjà dans le planning.')
      return
    }
    onAdd(n)
    setValue('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-20 flex items-end sm:items-center justify-center bg-black/60 p-3">
      <div
        className={`rounded-2xl p-4 w-full max-w-sm border transition-colors ${
          isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
        }`}
      >
        <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Ajouter un Hizb</h3>
        <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Le Hizb sera automatiquement inséré dans le cycle et le planning se rééquilibrera
          entre les deux semaines.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="number"
            min={1}
            max={60}
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ex : 46"
            className={`border rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500 ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
            }`}
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                isDark
                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-3 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-500"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
