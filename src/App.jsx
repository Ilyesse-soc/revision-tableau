import { useState, useMemo, useEffect } from 'react'
import Navbar from './components/Navbar'
import WeekTable from './components/WeekTable'
import SummaryCards from './components/SummaryCards'
import RegularityChart from './components/RegularityChart'
import AddHizbModal from './components/AddHizbModal'
import HizbManager from './components/HizbManager'
import { useLocalStorage } from './hooks/useLocalStorage'
import {
  getMonday,
  getWeekDates,
  addDays,
  toISODate,
  weeksBetween,
  formatDayLabel
} from './utils/dateUtils'
import {
  DEFAULT_HIZB_LIST,
  addHizbToList,
  getHizbForWeek,
  removeHizbFromList,
  updateHizbInList,
  moveHizbInList
} from './utils/hizbLogic'
import { computeStreaks, computeRegularity } from './utils/stats'

function getToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function getStartOfDay(date) {
  const d = new Date()
  d.setTime(date.getTime())
  d.setHours(0, 0, 0, 0)
  return d
}

export default function App() {
  const [now, setNow] = useState(() => new Date())
  const [today, setToday] = useState(() => getToday())

  // Liste complète des Hizb en rotation (triée)
  const [hizbList, setHizbList] = useLocalStorage('hizbList', DEFAULT_HIZB_LIST)

  // Ancre du cycle : le lundi de la toute première semaine (semaine 1 = groupe 1)
  const [cycleStart, setCycleStart] = useLocalStorage('cycleStart', toISODate(getMonday(today)))

  // Toutes les coches : { "YYYY-MM-DD__hizb": true }
  const [completions, setCompletions] = useLocalStorage('completions', {})
  const [theme, setTheme] = useLocalStorage('theme', 'dark')

  // Lundi de la semaine actuellement affichée
  const [currentMonday, setCurrentMonday] = useState(() => getMonday(today))

  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingHizb, setEditingHizb] = useState(null)

  useEffect(() => {
    const id = setInterval(() => {
      const current = new Date()
      setNow(current)
      const currentDay = getStartOfDay(current)
      setToday((prev) => (prev.getTime() === currentDay.getTime() ? prev : currentDay))
    }, 1000)

    return () => clearInterval(id)
  }, [])

  const cycleStartMonday = useMemo(() => getMonday(new Date(cycleStart)), [cycleStart])

  const weeksSince = useMemo(
    () => weeksBetween(cycleStartMonday, currentMonday),
    [cycleStartMonday, currentMonday]
  )

  const weekHizb = useMemo(() => getHizbForWeek(hizbList, weeksSince), [hizbList, weeksSince])

  const weekDates = useMemo(() => getWeekDates(currentMonday), [currentMonday])

  const weekLabel = useMemo(() => {
    const groupNum = ((weeksSince % 2) + 2) % 2 === 0 ? 1 : 2
    return `Semaine ${groupNum} du cycle — ${weekHizb.length > 0 ? `Hizb ${weekHizb[0]} à ${weekHizb[weekHizb.length - 1]}` : 'aucun Hizb'}`
  }, [weeksSince, weekHizb])

  const weekRangeLabel = useMemo(() => {
    const start = weekDates[0]
    const end = weekDates[6]
    return `${formatDayLabel(start)} → ${formatDayLabel(end)}`
  }, [weekDates])

  const browserLocale = useMemo(() => {
    if (typeof navigator === 'undefined') return 'fr-FR'
    return navigator.languages?.[0] || navigator.language || 'fr-FR'
  }, [])

  const detectedTimeZone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    } catch {
      return 'UTC'
    }
  }, [])

  const dateTimeLabel = useMemo(
    () => {
      const formatted = new Intl.DateTimeFormat(browserLocale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: detectedTimeZone,
        timeZoneName: 'short'
      }).format(now)

      return `${formatted} (${detectedTimeZone})`
    },
    [now, browserLocale, detectedTimeZone]
  )

  const isDark = theme === 'dark'

  function isCurrentWeekComplete(state) {
    if (weekHizb.length === 0) return false
    for (const d of weekDates) {
      const iso = toISODate(d)
      for (const h of weekHizb) {
        if (!state[`${iso}__${h}`]) return false
      }
    }
    return true
  }

  function toggleCell(dateISO, hizb) {
    let shouldAdvanceWeek = false

    setCompletions((prev) => {
      const key = `${dateISO}__${hizb}`
      const nextChecked = !prev[key]
      const next = { ...prev, [key]: nextChecked }

      if (nextChecked && isCurrentWeekComplete(next)) {
        shouldAdvanceWeek = true
      }

      return next
    })

    if (shouldAdvanceWeek) {
      setCurrentMonday((m) => addDays(m, 7))
    }
  }

  function handleAddHizb(n) {
    setHizbList((prev) => addHizbToList(prev, n))
  }

  function openAddModal() {
    setEditingHizb(null)
    setModalOpen(true)
  }

  function openEditModal(hizb) {
    setEditingHizb(hizb)
    setEditModalOpen(true)
  }

  function handleEditHizb(nextValue) {
    if (editingHizb === null) return

    setHizbList((prev) => updateHizbInList(prev, editingHizb, nextValue))
    setCompletions((prev) => {
      const next = {}
      for (const [key, value] of Object.entries(prev)) {
        const [dateISO, hizb] = key.split('__')
        if (Number(hizb) === editingHizb) {
          next[`${dateISO}__${nextValue}`] = value
        } else {
          next[key] = value
        }
      }
      return next
    })
    setEditingHizb(null)
  }

  function handleDeleteHizb(hizb) {
    setHizbList((prev) => removeHizbFromList(prev, hizb))
    setCompletions((prev) => {
      const next = {}
      for (const [key, value] of Object.entries(prev)) {
        const [, keyHizb] = key.split('__')
        if (Number(keyHizb) !== hizb) next[key] = value
      }
      return next
    })
  }

  function handleReorder(index, direction) {
    setHizbList((prev) => moveHizbInList(prev, index, direction))
  }

  function goToday() {
    setCurrentMonday(getMonday(today))
  }

  function goPrevWeek() {
    setCurrentMonday((m) => addDays(m, -7))
  }

  function goNextWeek() {
    setCurrentMonday((m) => addDays(m, 7))
  }

  // Stats
  const thisWeekMonday = useMemo(() => getMonday(today), [today])
  const thisWeekSunday = useMemo(() => addDays(thisWeekMonday, 6), [thisWeekMonday])
  const thisWeekSince = useMemo(
    () => weeksBetween(cycleStartMonday, thisWeekMonday),
    [cycleStartMonday, thisWeekMonday]
  )
  const thisWeekHizb = useMemo(
    () => getHizbForWeek(hizbList, thisWeekSince),
    [hizbList, thisWeekSince]
  )

  const thisWeekRegularity = useMemo(
    () => computeRegularity(completions, thisWeekHizb, thisWeekMonday, today),
    [completions, thisWeekHizb, thisWeekMonday, today]
  )

  const thisWeekCount = useMemo(() => {
    let count = 0
    const dates = getWeekDates(thisWeekMonday)
    for (const d of dates) {
      const iso = toISODate(d)
      for (const h of thisWeekHizb) {
        if (completions[`${iso}__${h}`]) count++
      }
    }
    return count
  }, [completions, thisWeekHizb, thisWeekMonday])

  const streaks = useMemo(
    () => computeStreaks(completions, hizbList, new Date(cycleStart), today),
    [completions, hizbList, cycleStart, today]
  )

  return (
    <div
      className={`min-h-screen pb-10 transition-colors ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      <Navbar
        onPrevWeek={goPrevWeek}
        onNextWeek={goNextWeek}
        onToday={goToday}
        onAddHizb={openAddModal}
        weekRangeLabel={weekRangeLabel}
        dateTimeLabel={dateTimeLabel}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />

      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 flex flex-col gap-4">
        <SummaryCards
          thisWeekCount={thisWeekCount}
          thisWeekPercent={thisWeekRegularity.percent}
          currentStreak={streaks.current}
          bestStreak={streaks.best}
          theme={theme}
        />

        <HizbManager
          hizbList={hizbList}
          onOpenAdd={openAddModal}
          onEdit={openEditModal}
          onDelete={handleDeleteHizb}
          onReorder={handleReorder}
          theme={theme}
        />

        <WeekTable
          weekDates={weekDates}
          hizbList={weekHizb}
          completions={completions}
          onToggle={toggleCell}
          today={today}
          weekLabel={weekLabel}
          theme={theme}
        />

        <RegularityChart
          completions={completions}
          hizbList={hizbList}
          today={today}
          cycleStart={cycleStart}
          theme={theme}
        />

        <p className={`text-center text-xs pt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Toutes tes données sont stockées uniquement sur cet appareil (localStorage).
          Fonctionne hors ligne une fois l'app chargée une première fois.
        </p>
      </main>

      <AddHizbModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddHizb}
        existingList={hizbList}
        theme={theme}
        title="Ajouter un Hizb"
        description="Le Hizb sera inséré et le planning se rééquilibrera entre les deux semaines."
      />

      <AddHizbModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditHizb}
        existingList={hizbList}
        theme={theme}
        title="Modifier un Hizb"
        description="Change le numéro du Hizb sans perdre l’historique des coches associées."
        initialValue={editingHizb ?? ''}
      />
    </div>
  )
}
