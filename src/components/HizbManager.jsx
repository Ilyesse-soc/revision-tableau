import { useMemo, useState } from 'react'

export default function HizbManager({
  hizbList,
  onEdit,
  onDelete,
  onReorder,
  theme,
  onOpenAdd
}) {
  const [expanded, setExpanded] = useState(false)
  const [dragIndex, setDragIndex] = useState(null)
  const [dropIndex, setDropIndex] = useState(null)
  const isDark = theme === 'dark'

  const summary = useMemo(() => {
    if (hizbList.length === 0) return 'Aucun Hizb'
    return `${hizbList.length} Hizb en gestion`
  }, [hizbList.length])

  return (
    <section
      className={`rounded-2xl border shadow-lg transition-colors overflow-hidden ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex flex-col gap-3 px-3 sm:px-4 py-3 border-b border-inherit sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className={`text-sm sm:text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Gestion des Hizb
          </h2>
          <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{summary}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onOpenAdd}
            className="h-9 rounded-lg bg-brand-600 px-3 text-white text-sm font-medium hover:bg-brand-500"
          >
            Ajouter
          </button>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className={`h-9 rounded-lg px-3 text-sm transition-colors ${
              isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {expanded ? 'Masquer' : 'Gérer'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-3 sm:p-4">
          {hizbList.length === 0 ? (
            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
              Ajoute un Hizb pour commencer à organiser le planning.
            </p>
          ) : (
            <div className="space-y-2 max-h-[52vh] overflow-auto pr-1">
              {hizbList.map((hizb, index) => {
                const canMoveUp = index > 0
                const canMoveDown = index < hizbList.length - 1
                const isDragging = dragIndex === index
                const isDropTarget = dropIndex === index
                return (
                  <div
                    key={hizb}
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragEnd={() => {
                      setDragIndex(null)
                      setDropIndex(null)
                    }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDropIndex(index)
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      if (dragIndex !== null && dragIndex !== index) {
                        onReorder(dragIndex, index)
                      }
                      setDragIndex(null)
                      setDropIndex(null)
                    }}
                    className={`rounded-xl border px-3 py-3 flex flex-col sm:flex-row sm:items-center gap-3 transition-all cursor-grab active:cursor-grabbing ${
                      isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'
                    } ${isDragging ? 'opacity-40 scale-[0.99]' : ''} ${
                      isDropTarget && dragIndex !== index ? 'ring-2 ring-brand-500' : ''
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className={`font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-[11px] ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                          ☰
                        </span>
                        Hizb {hizb}
                      </p>
                      <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Position {index + 1} sur {hizbList.length}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
                      <button
                        type="button"
                        disabled={!canMoveUp}
                        onClick={() => onReorder(index, index - 1)}
                        className={`px-3 h-9 rounded-lg text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                          isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={!canMoveDown}
                        onClick={() => onReorder(index, index + 1)}
                        className={`px-3 h-9 rounded-lg text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                          isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(hizb)}
                        className={`px-3 h-9 rounded-lg text-sm transition-colors col-span-2 sm:col-span-1 ${
                          isDark ? 'bg-slate-800 text-brand-300 hover:bg-slate-700' : 'bg-slate-200 text-brand-700 hover:bg-slate-300'
                        }`}
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(hizb)}
                        className="px-3 h-9 rounded-lg text-sm bg-red-600 text-white hover:bg-red-500"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </section>
  )
}