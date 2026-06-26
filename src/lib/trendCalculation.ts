import type { LogEntry, ShopMood } from './storage'

function parseCloseMinutes(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number)
  const hours = (h ?? 23) < 4 ? (h ?? 0) + 24 : (h ?? 23)
  return hours * 60 + (m ?? 0)
}

function scoreNight(closeTime: string, targetTime: string) {
  const closeMin = parseCloseMinutes(closeTime)
  const targetMin = parseCloseMinutes(targetTime)
  const diff = closeMin - targetMin

  if (diff <= -30) return 1.0
  if (diff <= -15) return 0.8
  if (diff <= 0) return 0.6
  if (diff <= 15) return 0.3
  if (diff <= 30) return 0.0
  if (diff <= 60) return -0.4
  if (diff <= 90) return -0.7
  return -1.0
}

export interface TrendInput {
  recentEntries: LogEntry[]
  targetLightsOffTime: string
}

export interface TrendResult {
  mood: ShopMood
  sceneMood: 'busy' | 'normal' | 'quiet'
  score: number
  daysUsed: number
}

export function calculateTrend(input: TrendInput): TrendResult {
  const { recentEntries, targetLightsOffTime } = input

  if (recentEntries.length === 0) {
    return { mood: '平常', sceneMood: 'normal', score: 0, daysUsed: 0 }
  }

  const weights = [1.0, 0.85, 0.7, 0.55, 0.45, 0.35, 0.25]
  let weightedSum = 0
  let totalWeight = 0

  for (let i = 0; i < Math.min(recentEntries.length, 7); i += 1) {
    const entry = recentEntries[i]!
    const weight = weights[i] ?? 0.2
    const nightScore = scoreNight(entry.closeTime, targetLightsOffTime)

    weightedSum += nightScore * weight
    totalWeight += weight
  }

  const rawScore = totalWeight > 0 ? weightedSum / totalWeight : 0

  if (rawScore > 0.25) {
    return { mood: '热闹', sceneMood: 'busy', score: Math.round(rawScore * 100) / 100, daysUsed: Math.min(recentEntries.length, 7) }
  }

  if (rawScore < -0.35) {
    return { mood: '安静', sceneMood: 'quiet', score: Math.round(rawScore * 100) / 100, daysUsed: Math.min(recentEntries.length, 7) }
  }

  return { mood: '平常', sceneMood: 'normal', score: Math.round(rawScore * 100) / 100, daysUsed: Math.min(recentEntries.length, 7) }
}
