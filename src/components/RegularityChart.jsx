import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { addDays, toISODate, fromISODate } from '../utils/dateUtils'
import { dailyCountsSeries, computeRegularity, distinctHizbRevised } from '../utils/stats'

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

  const chartData = series.map((s) => ({
    ...s,
    label: fromISODate(s.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }))

  const isDark = theme === 'dark'

  return (
    <div
      className={`rounded-2xl p-3 sm:p-4 border transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-sm sm:text-base font-semibold text-brand-300">Régularité</h2>
        <div className={`flex gap-1 rounded-lg p-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
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

      <div className="flex gap-4 mb-3 text-sm">
        <div>
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Jours révisés : </span>
          <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {regularity.daysDone}/{regularity.totalDays} ({regularity.percent}%)
          </span>
        </div>
        <div>
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Hizb distincts : </span>
          <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{distinctHizb}</span>
        </div>
      </div>

      <div className="h-52 w-full">
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
