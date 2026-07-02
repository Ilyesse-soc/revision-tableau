// Gère la liste des Hizb en rotation et leur répartition sur les 2 semaines
// du cycle.
//
// Principe : on garde une liste triée de Hizb (ex: [47..60]).
// On la coupe en 2 groupes consécutifs :
//   - groupe "Semaine 1" = première moitié (arrondi au-dessus)
//   - groupe "Semaine 2" = deuxième moitié
// Quand on ajoute un nouveau Hizb, on l'insère à sa place dans l'ordre trié
// puis on recoupe en 2 : ça rééquilibre automatiquement sans "casser" tout
// le planning (les Hizb déjà présents restent dans le même ordre relatif).

export const DEFAULT_HIZB_LIST = Array.from({ length: 14 }, (_, i) => 47 + i) // 47..60

function isAscending(list) {
  for (let i = 1; i < list.length; i++) {
    if (list[i - 1] > list[i]) return false
  }
  return true
}

function insertSorted(list, value) {
  const next = [...list]
  const index = next.findIndex((item) => item > value)
  if (index === -1) {
    next.push(value)
  } else {
    next.splice(index, 0, value)
  }
  return next
}

export function addHizbToList(list, newHizb) {
  const n = Number(newHizb)
  if (!Number.isInteger(n) || n < 1 || n > 60) return list
  if (list.includes(n)) return list
  return isAscending(list) ? insertSorted(list, n) : [...list, n]
}

export function removeHizbFromList(list, hizb) {
  return list.filter((h) => h !== hizb)
}

export function updateHizbInList(list, oldHizb, newHizb) {
  const nextValue = Number(newHizb)
  if (!Number.isInteger(nextValue) || nextValue < 1 || nextValue > 60) return list
  if (oldHizb === nextValue) return list
  if (list.includes(nextValue)) return list

  const next = list.map((h) => (h === oldHizb ? nextValue : h))
  return isAscending(next) ? [...next].sort((a, b) => a - b) : next
}

export function moveHizbInList(list, fromIndex, direction) {
  const toIndex = fromIndex + direction
  if (fromIndex < 0 || fromIndex >= list.length) return list
  if (toIndex < 0 || toIndex >= list.length) return list

  const next = [...list]
  const [item] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, item)
  return next
}

// Retourne { week1: number[], week2: number[] }
export function splitIntoGroups(sortedList) {
  const list = [...sortedList]
  const half = Math.ceil(list.length / 2)
  return {
    week1: list.slice(0, half),
    week2: list.slice(half)
  }
}

// Détermine si la semaine dont le lundi est `weeksSinceCycleStart` semaines
// après l'ancre du cycle correspond au groupe 1 ou au groupe 2.
// weeksSinceCycleStart peut être négatif (semaines avant l'ancre).
export function getGroupIndexForWeek(weeksSinceCycleStart) {
  const mod = ((weeksSinceCycleStart % 2) + 2) % 2
  return mod // 0 -> groupe 1, 1 -> groupe 2
}

export function getHizbForWeek(hizbList, weeksSinceCycleStart) {
  const { week1, week2 } = splitIntoGroups(hizbList)
  return getGroupIndexForWeek(weeksSinceCycleStart) === 0 ? week1 : week2
}
