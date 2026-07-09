export default function SummaryCards({ thisWeekCount, thisWeekPercent, currentStreak, bestStreak, theme }) {
  const isDark = theme === 'dark'

  const cards = [
    { label: 'Révisions cette semaine', value: thisWeekCount, icon: '✅' },
    { label: 'Régularité de la semaine', value: `${thisWeekPercent}%`, icon: '📊' },
    { label: 'Série actuelle', value: `${currentStreak} j`, icon: '🔥' },
    { label: 'Meilleur streak', value: `${bestStreak} j`, icon: '🏆' }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`rounded-2xl p-3 sm:p-4 flex flex-col items-start gap-1 border transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <span className="text-lg">{c.icon}</span>
          <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.value}</span>
          <span className={`text-[11px] leading-tight ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{c.label}</span>
        </div>
      ))}
    </div>
  )
}
