import { toISODate, addDays, getMonday } from './dateUtils'

// Une case cochée est stockée sous la clé `${dateISO}__${hizb}` = true

export function completionKey(dateISO, hizb) {
  return `${dateISO}__${hizb}`
}

export function countCheckedForDate(completions, dateISO, hizbList) {
  return hizbList.reduce((acc, h) => acc + (completions[completionKey(dateISO, h)] ? 1 : 0), 0)
}

export function isDayDone(completions, dateISO, hizbList) {
  return countCheckedForDate(completions, dateISO, hizbList) > 0
}

// Génère un tableau de dates (ISO) de `start` à `end` inclus
function dateRangeISO(start, end) {
  const dates = []
  let cur = new Date(start)
  const last = new Date(end)
  while (cur <= last) {
    dates.push(toISODate(cur))
    cur = addDays(cur, 1)
  }
  return dates
}

// Calcule le streak courant (jours consécutifs faits, en remontant depuis
// aujourd'hui) et le meilleur streak jamais atteint, depuis `anchorDate`
// jusqu'à `today`.
export function computeStreaks(completions, hizbList, anchorDate, today) {
  const allDates = dateRangeISO(anchorDate, today)
  let best = 0
  let running = 0
  let current = 0

  for (const iso of allDates) {
    if (isDayDone(completions, iso, hizbList)) {
      running += 1
      if (running > best) best = running
    } else {
      running = 0
    }
  }

  // streak courant : on remonte depuis aujourd'hui
  for (let i = allDates.length - 1; i >= 0; i--) {
    const iso = allDates[i]
    if (isDayDone(completions, iso, hizbList)) {
      current += 1
    } else {
      // si c'est aujourd'hui et pas encore fait, on ne casse pas le streak,
      // on regarde juste à partir d'hier
      if (iso === toISODate(today)) continue
      break
    }
  }

  return { current, best }
}

// Régularité sur une période : % de jours avec au moins une case cochée
export function computeRegularity(completions, hizbList, startDate, endDate) {
  const dates = dateRangeISO(startDate, endDate)
  if (dates.length === 0) return { percent: 0, daysDone: 0, totalDays: 0 }
  const daysDone = dates.filter((d) => isDayDone(completions, d, hizbList)).length
  return {
    percent: Math.round((daysDone / dates.length) * 100),
    daysDone,
    totalDays: dates.length
  }
}

// Nombre de Hizb distincts révisés (au moins une fois) sur une période
export function distinctHizbRevised(completions, hizbList, startDate, endDate) {
  const dates = dateRangeISO(startDate, endDate)
  const set = new Set()
  for (const iso of dates) {
    for (const h of hizbList) {
      if (completions[completionKey(iso, h)]) set.add(h)
    }
  }
  return set.size
}

// Données pour le graphique : nombre de cases cochées par jour sur la période
export function dailyCountsSeries(completions, hizbList, startDate, endDate) {
  const dates = dateRangeISO(startDate, endDate)
  return dates.map((iso) => ({
    date: iso,
    count: countCheckedForDate(completions, iso, hizbList)
  }))
}

export function getWeekStart(today) {
  return getMonday(today)
}
