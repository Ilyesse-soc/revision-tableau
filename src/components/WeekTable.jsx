import { DAY_LABELS_SHORT, formatDayLabel, toISODate, isSameDay } from '../utils/dateUtils'
import { completionKey } from '../utils/stats'

export default function WeekTable({ weekDates, hizbList, completions, onToggle, today, weekLabel, theme }) {
  const isDark = theme === 'dark'

  return (
    <div
      className={`rounded-2xl p-3 sm:p-4 shadow-lg border transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm sm:text-base font-semibold text-brand-300">{weekLabel}</h2>
        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>{hizbList.length} Hizb</span>
      </div>

      {hizbList.length === 0 ? (
        <p className={`text-sm py-6 text-center ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
          Aucun Hizb dans ce groupe pour l'instant. Ajoute un Hizb avec le bouton "+".
        </p>
      ) : (
        <div className="overflow-x-auto scrollbar-thin -mx-1 px-1">
          <table className="w-full text-center border-separate border-spacing-1 min-w-[560px]">
            <thead>
              <tr>
                <th
                  className={`text-left text-xs font-medium pl-1 pb-1 sticky left-0 ${
                    isDark ? 'text-slate-400 bg-slate-900' : 'text-slate-600 bg-white'
                  }`}
                >
                  Hizb
                </th>
                {weekDates.map((d, i) => {
                  const isToday = isSameDay(d, today)
                  return (
                    <th
                      key={i}
                      className={`text-xs font-medium pb-1 ${
                        isToday ? 'text-brand-500' : isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      <div>{DAY_LABELS_SHORT[i]}</div>
                      <div className={`text-[10px] font-normal ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        {formatDayLabel(d)}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {hizbList.map((hizb) => (
                <tr key={hizb}>
                  <td
                    className={`text-left text-sm font-medium pl-1 sticky left-0 ${
                      isDark ? 'text-slate-200 bg-slate-900' : 'text-slate-800 bg-white'
                    }`}
                  >
                    Hizb {hizb}
                  </td>
                  {weekDates.map((d, i) => {
                    const iso = toISODate(d)
                    const key = completionKey(iso, hizb)
                    const checked = !!completions[key]
                    const isToday = isSameDay(d, today)
                    return (
                      <td key={i} className="p-0">
                        <button
                          type="button"
                          onClick={() => onToggle(iso, hizb)}
                          aria-label={`Hizb ${hizb} - ${DAY_LABELS_SHORT[i]}`}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border-2 flex items-center justify-center transition-colors
                            ${checked
                              ? 'bg-brand-600 border-brand-500 text-white'
                              : isDark
                                ? 'bg-slate-800 border-slate-700 text-transparent hover:border-brand-700'
                                : 'bg-slate-100 border-slate-300 text-transparent hover:border-brand-500'}
                            ${isToday && !checked ? 'ring-1 ring-brand-600' : ''}
                          `}
                        >
                          {checked && (
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
