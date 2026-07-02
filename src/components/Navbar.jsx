export default function Navbar({
  onPrevWeek,
  onNextWeek,
  onToday,
  onAddHizb,
  weekRangeLabel,
  dateTimeLabel,
  theme,
  onToggleTheme
}) {
  const isDark = theme === 'dark'

  return (
    <div
      className={`sticky top-0 z-10 backdrop-blur border-b px-3 sm:px-4 py-3 transition-colors ${
        isDark ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-slate-200'
      }`}
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
        <div>
          <h1 className={`text-base sm:text-lg font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            📖 Quran Revision Tracker
          </h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{weekRangeLabel}</p>
          <p className={`text-[11px] ${isDark ? 'text-brand-300' : 'text-brand-700'}`}>{dateTimeLabel}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onPrevWeek}
            aria-label="Semaine précédente"
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            ‹
          </button>
          <button
            onClick={onToday}
            className="px-3 h-9 rounded-lg bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium"
          >
            Aujourd'hui
          </button>
          <button
            onClick={onNextWeek}
            aria-label="Semaine suivante"
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            ›
          </button>
          <button
            onClick={onToggleTheme}
            aria-label="Basculer le thème"
            className={`px-2 h-9 rounded-lg text-sm font-medium transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-300'
                : 'bg-slate-200 hover:bg-slate-300 text-indigo-700'
            }`}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={onAddHizb}
            aria-label="Ajouter un Hizb"
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-brand-300'
                : 'bg-slate-200 hover:bg-slate-300 text-brand-700'
            }`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
