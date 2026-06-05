<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

// Cell size and gap
const CELL_SIZE = 11
const CELL_GAP = 3
const CELL_TOTAL = CELL_SIZE + CELL_GAP

// Get color level based on count
function getLevel(count) {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 7) return 3
  return 4
}

// Build the grid data structure
const gridData = computed(() => {
  if (!props.data || props.data.length === 0) {
    return { cells: [], months: [], weeks: 0 }
  }

  // Find the date range
  const dates = props.data.map(d => d.date).sort()
  const firstDate = new Date(dates[0])
  const lastDate = new Date(dates[dates.length - 1])

  // Find the Sunday that is 90 days ago (or the nearest Sunday before that)
  const startDate = new Date(firstDate)
  startDate.setHours(0, 0, 0, 0)
  // Adjust to Sunday (day 0)
  const dayOfWeek = startDate.getDay()
  startDate.setDate(startDate.getDate() - dayOfWeek)

  // Create a map for quick lookup
  const dataMap = new Map()
  for (const item of props.data) {
    dataMap.set(item.date, item.count)
  }

  // Calculate number of weeks
  const totalDays = Math.ceil((lastDate - startDate) / (1000 * 60 * 60 * 24)) + 1
  const weeks = Math.ceil(totalDays / 7)

  // Build cells array
  const cells = []
  const months = []
  let currentMonth = -1
  let monthIndex = 0

  for (let week = 0; week < weeks; week++) {
    for (let day = 0; day < 7; day++) {
      const cellDate = new Date(startDate)
      cellDate.setDate(cellDate.getDate() + week * 7 + day)

      const dateStr = cellDate.toISOString().split('T')[0]
      const count = dataMap.get(dateStr) || 0
      const level = getLevel(count)

      // Only include cells that are within our data range or today
      const isInRange = cellDate >= firstDate && cellDate <= lastDate
      const isToday = dateStr === new Date().toISOString().split('T')[0]

      if (isInRange || isToday || cellDate <= lastDate) {
        cells.push({
          date: dateStr,
          count,
          level,
          week,
          day,
          x: week * CELL_TOTAL,
          y: day * CELL_TOTAL
        })

        // Track month labels (only on first row of each week)
        if (day === 0) {
          const month = cellDate.getMonth()
          if (month !== currentMonth) {
            currentMonth = month
            months.push({
              label: cellDate.toLocaleDateString('zh-CN', { month: 'short' }),
              x: week * CELL_TOTAL,
              index: monthIndex++
            })
          }
        }
      }
    }
  }

  return { cells, months, weeks }
})

// Tooltip state
const tooltip = ref({
  visible: false,
  text: '',
  x: 0,
  y: 0
})

function showTooltip(event, cell) {
  tooltip.value = {
    visible: true,
    text: `${cell.date}: ${cell.count} 次查看`,
    x: event.clientX,
    y: event.clientY
  }
}

function hideTooltip() {
  tooltip.value.visible = false
}
</script>

<template>
  <div class="heatmap-container">
    <svg
      :width="gridData.weeks * CELL_TOTAL + CELL_GAP"
      :height="7 * CELL_TOTAL + 20"
      class="heatmap-svg"
    >
      <!-- Month labels -->
      <text
        v-for="month in gridData.months"
        :key="month.label + month.x"
        :x="month.x + 2"
        y="10"
        class="month-label"
      >
        {{ month.label }}
      </text>

      <!-- Day cells -->
      <g transform="translate(0, 18)">
        <rect
          v-for="cell in gridData.cells"
          :key="cell.date"
          :x="cell.x"
          :y="cell.y"
          :width="CELL_SIZE"
          :height="CELL_SIZE"
          :class="`heatmap-cell heatmap-level-${cell.level}`"
          rx="2"
          ry="2"
          @mouseenter="showTooltip($event, cell)"
          @mouseleave="hideTooltip()"
        />
      </g>
    </svg>

    <!-- Tooltip -->
    <div
      v-if="tooltip.visible"
      class="heatmap-tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      {{ tooltip.text }}
    </div>

    <!-- Legend -->
    <div class="heatmap-legend">
      <span class="legend-label">少</span>
      <span
        v-for="i in 5"
        :key="i"
        :class="`legend-cell heatmap-level-${i - 1}`"
      ></span>
      <span class="legend-label">多</span>
    </div>
  </div>
</template>

<style scoped>
.heatmap-container {
  position: relative;
  display: inline-block;
}

.heatmap-svg {
  display: block;
}

.month-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  fill: var(--color-text-tertiary, #8a8a87);
}

.heatmap-cell {
  transition: opacity 0.15s ease;
}

.heatmap-cell:hover {
  opacity: 0.8;
  stroke: var(--color-border-strong, rgba(10, 10, 10, 0.15));
  stroke-width: 1;
}

.heatmap-level-0 { fill: var(--color-heatmap-0, #ebedf0); }
.heatmap-level-1 { fill: var(--color-heatmap-1, #9be9a8); }
.heatmap-level-2 { fill: var(--color-heatmap-2, #40c463); }
.heatmap-level-3 { fill: var(--color-heatmap-3, #30a14e); }
.heatmap-level-4 { fill: var(--color-heatmap-4, #216e39); }

.heatmap-tooltip {
  position: fixed;
  z-index: 1000;
  background: var(--color-ink, #0a0a0a);
  color: var(--color-text-inverse, #faf9f6);
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
  pointer-events: none;
  transform: translate(-50%, -100%);
  margin-top: -8px;
  white-space: nowrap;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
}

.legend-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  color: var(--color-text-tertiary, #8a8a87);
}

.legend-cell {
  display: inline-block;
  width: 11px;
  height: 11px;
  border-radius: 2px;
}
</style>
