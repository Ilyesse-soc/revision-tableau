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

export function addHizbToList(list, newHizb) {
  const n = Number(newHizb)
  if (!Number.isInteger(n) || n < 1 || n > 60) return list
  if (list.includes(n)) return list
  return [...list, n].sort((a, b) => a - b)
}

export function removeHizbFromList(list, hizb) {
  return list.filter((h) => h !== hizb)
}

// Retourne { week1: number[], week2: number[] }
export function splitIntoGroups(sortedList) {
  const list = [...sortedList].sort((a, b) => a - b)
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
