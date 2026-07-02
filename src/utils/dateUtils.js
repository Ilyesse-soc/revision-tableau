// Utilitaires de date. On travaille toujours en "date locale" au format
// YYYY-MM-DD (pas d'heure, pas de fuseau) pour éviter les décalages.

export const DAY_LABELS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
export const DAY_LABELS_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function fromISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

// Retourne le lundi de la semaine contenant `date`
export function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay() // 0 = dimanche, 1 = lundi, ...
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function getWeekDates(mondayDate) {
  return Array.from({ length: 7 }, (_, i) => addDays(mondayDate, i))
}

export function isSameDay(a, b) {
  return toISODate(a) === toISODate(b)
}

// Nombre de semaines complètes entre deux lundis (peut être négatif)
export function weeksBetween(mondayA, mondayB) {
  const ms = getMonday(mondayB) - getMonday(mondayA)
  return Math.round(ms / (7 * 24 * 3600 * 1000))
}

export function formatDayLabel(date) {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}
