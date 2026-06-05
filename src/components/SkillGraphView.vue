<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  nodes: { type: Array, default: () => [] },
  edges: { type: Array, default: () => [] },
  currentSlug: { type: String, default: '' }
})

const emit = defineEmits(['navigate'])

const svgRef = ref(null)
const nodePositions = ref([]) // [{id, x, y}]
const dragging = ref(null) // index into nodePositions
const dragOffset = ref({ x: 0, y: 0 })
const hoveredNode = ref(null)
const tooltipStyle = ref({ display: 'none' })

const CENTER_X = 300
const CENTER_Y = 250
const ITERATIONS = 60
const REPULSION = 200
const ATTRACTION = 0.01
const CENTER_GRAVITY = 0.005

function initPositions() {
  if (!props.nodes.length) {
    nodePositions.value = []
    return
  }

  // Center node at fixed position
  const positions = [{ id: props.nodes[0].id, x: CENTER_X, y: CENTER_Y }]

  // Other nodes in a circle around center
  const others = props.nodes.slice(1)
  const radius = 120
  others.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / others.length - Math.PI / 2
    positions.push({
      id: node.id,
      x: CENTER_X + radius * Math.cos(angle) + (Math.random() - 0.5) * 20,
      y: CENTER_Y + radius * Math.sin(angle) + (Math.random() - 0.5) * 20
    })
  })

  nodePositions.value = positions
}

function runForceLayout() {
  const pos = nodePositions.value.map(p => ({ ...p }))
  if (pos.length < 2) {
    nodePositions.value = pos
    return
  }

  // Build edge lookup for attraction
  const edgeMap = new Map()
  for (const e of props.edges) {
    edgeMap.set(`${e.source}-${e.target}`, e.score)
    edgeMap.set(`${e.target}-${e.source}`, e.score)
  }

  for (let iter = 0; iter < ITERATIONS; iter++) {
    const forces = pos.map(() => ({ fx: 0, fy: 0 }))

    // Repulsion between all pairs
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const dx = pos[i].x - pos[j].x
        const dy = pos[i].y - pos[j].y
        const distSq = Math.max(dx * dx + dy * dy, 1)
        const dist = Math.sqrt(distSq)
        const force = REPULSION / distSq
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        forces[i].fx += fx
        forces[i].fy += fy
        forces[j].fx -= fx
        forces[j].fy -= fy
      }
    }

    // Attraction along edges
    for (const e of props.edges) {
      const srcIdx = pos.findIndex(p => p.id === e.source)
      const tgtIdx = pos.findIndex(p => p.id === e.target)
      if (srcIdx === -1 || tgtIdx === -1) continue
      const dx = pos[tgtIdx].x - pos[srcIdx].x
      const dy = pos[tgtIdx].y - pos[srcIdx].y
      const dist = Math.sqrt(Math.max(dx * dx + dy * dy, 1))
      const force = ATTRACTION * dist
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      forces[srcIdx].fx += fx
      forces[srcIdx].fy += fy
      forces[tgtIdx].fx -= fx
      forces[tgtIdx].fy -= fy
    }

    // Center gravity (pull toward center)
    for (let i = 0; i < pos.length; i++) {
      forces[i].fx += (CENTER_X - pos[i].x) * CENTER_GRAVITY
      forces[i].fy += (CENTER_Y - pos[i].y) * CENTER_GRAVITY
    }

    // Apply forces (skip center node - it's fixed)
    for (let i = 1; i < pos.length; i++) {
      pos[i].x += forces[i].fx
      pos[i].y += forces[i].fy
      // Clamp to viewBox
      pos[i].x = Math.max(30, Math.min(570, pos[i].x))
      pos[i].y = Math.max(30, Math.min(470, pos[i].y))
    }
  }

  nodePositions.value = pos
}

function computeLayout() {
  initPositions()
  runForceLayout()
}

function getNodePos(id) {
  const p = nodePositions.value.find(n => n.id === id)
  return p ? { x: p.x, y: p.y } : { x: CENTER_X, y: CENTER_Y }
}

function getEdgeScore(source, target) {
  const e = props.edges.find(e =>
    (e.source === source && e.target === target) ||
    (e.source === target && e.target === source)
  )
  return e ? e.score : 0
}

function edgeOpacity(score) {
  // Map score (2+) to opacity (0.2 - 0.8)
  const minScore = 2
  const maxScore = 8
  const t = Math.min(Math.max((score - minScore) / (maxScore - minScore), 0), 1)
  return 0.2 + t * 0.6
}

function nodeRadius(id) {
  return id === props.currentSlug ? 12 : 7
}

function nodeColor(id) {
  return id === props.currentSlug ? '#c4553a' : '#6b6560'
}

// Mouse interactions
function onMouseDown(e, index) {
  if (index === 0) return // center node is fixed
  e.preventDefault()
  dragging.value = index
  const svg = svgRef.value
  if (!svg) return
  const rect = svg.getBoundingClientRect()
  const vbWidth = 600
  const vbHeight = 500
  const scaleX = vbWidth / rect.width
  const scaleY = vbHeight / rect.height
  dragOffset.value = {
    x: e.clientX * scaleX - nodePositions.value[index].x * (rect.width / vbWidth) * scaleX,
    y: e.clientY * scaleY - nodePositions.value[index].y * (rect.height / vbHeight) * scaleY
  }
}

function onMouseMove(e) {
  if (dragging.value === null) return
  const svg = svgRef.value
  if (!svg) return
  const rect = svg.getBoundingClientRect()
  const vbWidth = 600
  const vbHeight = 500
  const x = ((e.clientX - rect.left) / rect.width) * vbWidth
  const y = ((e.clientY - rect.top) / rect.height) * vbHeight
  const clampedX = Math.max(30, Math.min(570, x))
  const clampedY = Math.max(30, Math.min(470, y))
  nodePositions.value[dragging.value].x = clampedX
  nodePositions.value[dragging.value].y = clampedY
}

function onMouseUp() {
  dragging.value = null
}

function onClickNode(id) {
  if (id !== props.currentSlug) {
    emit('navigate', id)
  }
}

function onHoverNode(index) {
  hoveredNode.value = index
  const node = props.nodes[index]
  if (!node) return

  // Find edge score for this node
  const edge = props.edges.find(e =>
    (e.source === node.id || e.target === node.id) &&
    (e.source === props.currentSlug || e.target === props.currentSlug)
  )
  const score = edge ? edge.score : 0
  const pos = nodePositions.value[index]
  if (!pos) return

  tooltipStyle.value = {
    display: 'block',
    position: 'absolute',
    left: `${pos.x}px`,
    top: `${pos.y - 30}px`,
    transform: 'translate(-50%, -100%)',
    background: 'rgba(10,10,10,0.85)',
    color: '#faf9f6',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    fontFamily: "'DM Sans', sans-serif",
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    zIndex: 10
  }
}

function onLeaveNode() {
  hoveredNode.value = null
  tooltipStyle.value = { display: 'none' }
}

onMounted(() => {
  computeLayout()
})

watch(() => [props.nodes, props.edges], () => {
  nextTick(() => computeLayout())
}, { deep: true })
</script>

<template>
  <div style="position: relative; width: 100%;">
    <svg
      ref="svgRef"
      viewBox="0 0 600 500"
      style="width: 100%; height: auto; display: block;"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
    >
      <!-- Edges -->
      <line
        v-for="edge in edges"
        :key="`${edge.source}-${edge.target}`"
        :x1="getNodePos(edge.source).x"
        :y1="getNodePos(edge.source).y"
        :x2="getNodePos(edge.target).x"
        :y2="getNodePos(edge.target).y"
        :stroke-opacity="edgeOpacity(edge.score)"
        stroke="#8a8a87"
        stroke-width="1.5"
      />

      <!-- Nodes -->
      <g
        v-for="(node, index) in nodes"
        :key="node.id"
        style="cursor: pointer;"
        @mousedown="onMouseDown($event, index)"
        @click="onClickNode(node.id)"
        @mouseenter="onHoverNode(index)"
        @mouseleave="onLeaveNode"
      >
        <circle
          :cx="getNodePos(node.id).x"
          :cy="getNodePos(node.id).y"
          :r="nodeRadius(node.id)"
          :fill="nodeColor(node.id)"
          :stroke="node.id === currentSlug ? '#c4553a' : '#faf9f6'"
          :stroke-width="node.id === currentSlug ? 3 : 2"
          :style="{ transition: dragging === null ? 'cx 0.3s ease, cy 0.3s ease' : 'none' }"
        />
        <text
          :x="getNodePos(node.id).x"
          :y="getNodePos(node.id).y + nodeRadius(node.id) + 14"
          text-anchor="middle"
          style="font-family: 'DM Sans', sans-serif; font-size: 10px; fill: #6b6560; pointer-events: none;"
        >{{ node.name }}</text>
      </g>
    </svg>

    <!-- Tooltip -->
    <div :style="tooltipStyle">
      <template v-if="hoveredNode !== null && nodes[hoveredNode]">
        {{ nodes[hoveredNode].name }}
        <span v-if="edges.find(e => (e.source === nodes[hoveredNode].id || e.target === nodes[hoveredNode].id) && (e.source === currentSlug || e.target === currentSlug))">
          (score: {{ edges.find(e => (e.source === nodes[hoveredNode].id || e.target === nodes[hoveredNode].id) && (e.source === currentSlug || e.target === currentSlug)).score.toFixed(1) }})
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
