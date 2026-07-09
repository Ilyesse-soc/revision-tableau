import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { addDays, toISODate, fromISODate } from '../utils/dateUtils'
import { dailyCountsSeries, computeRegularity, distinctHizbRevised, missingHizbInPeriod } from '../utils/stats'

const PERIODS = [
  { key: '2w', label: '2 semaines', days: 14 },
  { key: '1m', label: '1 mois', days: 30 },
  { key: 'all', label: 'Global', days: null }
]

export default function RegularityChart({ completions, hizbList, today, cycleStart, theme }) {
  const [period, setPeriod] = useState('2w')

  const { startDate, endDate } = useMemo(() => {
    const end = today
    const chosen = PERIODS.find((p) => p.key === period)
    const start = chosen.days ? addDays(end, -(chosen.days - 1)) : fromISODate(cycleStart)
    return { startDate: start, endDate: end }
  }, [period, today, cycleStart])

  const series = useMemo(
    () => dailyCountsSeries(completions, hizbList, startDate, endDate),
    [completions, hizbList, startDate, endDate]
  )

  const regularity = useMemo(
    () => computeRegularity(completions, hizbList, startDate, endDate),
    [completions, hizbList, startDate, endDate]
  )

  const distinctHizb = useMemo(
    () => distinctHizbRevised(completions, hizbList, startDate, endDate),
    [completions, hizbList, startDate, endDate]
  )

  const missingHizb = useMemo(
    () => missingHizbInPeriod(completions, hizbList, startDate, endDate),
    [completions, hizbList, startDate, endDate]
  )

  const chartData = series.map((s) => ({
    ...s,
    label: fromISODate(s.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }))

  const isDark = theme === 'dark'

  return (
    <div
      className={`rounded-2xl p-3 sm:p-4 border transition-colors overflow-hidden ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-center sm:justify-between sm:flex-wrap sm:gap-2">
        <h2 className="text-sm sm:text-base font-semibold text-brand-300">Régularité</h2>
        <div className={`flex gap-1 rounded-lg p-1 overflow-x-auto ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                period === p.key
                  ? 'bg-brand-600 text-white'
                  : isDark
                    ? 'text-slate-300 hover:bg-slate-700'
                    : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-sm">
        <div className="rounded-lg px-3 py-2 border border-transparent">
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Jours révisés : </span>
          <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {regularity.daysDone}/{regularity.totalDays} ({regularity.percent}%)
          </span>
        </div>
        <div className="rounded-lg px-3 py-2 border border-transparent">
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Hizb distincts : </span>
          <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{distinctHizb}</span>
        </div>
      </div>

      <div className={`mb-3 rounded-xl border px-3 py-2 ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'}`}>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2 mb-2">
          <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Hizb non révisés sur la période
          </p>
          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
            {missingHizb.length}/{hizbList.length}
          </span>
        </div>
        {missingHizb.length === 0 ? (
          <p className="text-sm font-medium text-emerald-500">Tous les Hizb de la période ont été révisés.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {missingHizb.map((hizb) => (
              <span
                key={hizb}
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  isDark ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                Hizb {hizb}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="h-48 sm:h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#cbd5e1'} />
            <XAxis
              dataKey="label"
              stroke={isDark ? '#64748b' : '#475569'}
              fontSize={10}
              interval={chartData.length > 15 ? Math.floor(chartData.length / 8) : 0}
            />
            <YAxis stroke={isDark ? '#64748b' : '#475569'} fontSize={10} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                borderRadius: 8
              }}
              labelStyle={{ color: isDark ? '#e2e8f0' : '#0f172a' }}
              itemStyle={{ color: '#5eead4' }}
            />
            <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
