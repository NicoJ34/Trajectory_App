export function weeksBetween(start: Date, end: Date): number {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  return Math.floor((end.getTime() - start.getTime()) / msPerWeek)
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  // Utiliser UTC pour éviter les décalages de timezone
  const day = d.getUTCDay() // 0=dim, 1=lun, ..., 6=sam
  const diff = day === 0 ? -6 : 1 - day
  d.setUTCDate(d.getUTCDate() + diff)
  d.setUTCHours(0, 0, 0, 0)
  return d
}

export function addWeeks(date: Date, n: number): Date {
  const d = new Date(date)
  d.setUTCDate(d.getUTCDate() + n * 7)
  return d
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function getDayOfWeek(date: Date): number {
  return date.getUTCDay() // 0=dim, 1=lun, ..., 6=sam
}

/**
 * Retourne la prochaine occurrence de `targetDay` à partir de `from` (inclus).
 * targetDay : 0=dim, 1=lun, ..., 6=sam
 */
export function getNextWeekday(from: Date, targetDay: number): Date {
  const d = new Date(from)
  d.setUTCHours(0, 0, 0, 0)
  const current = d.getUTCDay()
  const diff = (targetDay - current + 7) % 7
  d.setUTCDate(d.getUTCDate() + diff)
  return d
}
