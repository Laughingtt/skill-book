import { computed } from 'vue'
import { useUsageTracker } from './useUsageTracker'

export function useStats() {
  const { stats } = useUsageTracker()

  // Generate heatmap data for the last 90 days
  const heatmapData = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Create a map of date -> count
    const dateCounts = new Map()

    // Initialize all 90 dates with 0
    for (let i = 0; i < 90; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      dateCounts.set(dateStr, 0)
    }

    // For each stat entry, add 1 view to the date of lastViewedAt
    // This gives us "last activity" counts per day
    for (const [slug, stat] of Object.entries(stats.value)) {
      if (stat.lastViewedAt) {
        const dateStr = stat.lastViewedAt.split('T')[0]
        if (dateCounts.has(dateStr)) {
          dateCounts.set(dateStr, dateCounts.get(dateStr) + 1)
        }
      }
    }

    // Convert to array sorted by date ascending
    return Array.from(dateCounts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  })

  return {
    heatmapData
  }
}
