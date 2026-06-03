<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSkills } from '../composables/useSkills'
import { useBookmarks } from '../composables/useBookmarks'
import { useSkillStatus } from '../composables/useSkillStatus'
import { useUsageTracker } from '../composables/useUsageTracker'
import SubNav from '../components/SubNav.vue'

const router = useRouter()
const { skills, getSkillBySlug } = useSkills()
const { bookmarks } = useBookmarks()
const { statuses, statusStats, getStatus, setStatus } = useSkillStatus()
const { recentlyViewed, getStaleLearning, getViewCount, getLastViewed } = useUsageTracker()

// Grouped skill lists by status
const masteredSkills = computed(() => {
  const list = []
  for (const [slug, status] of Object.entries(statuses.value)) {
    if (status === 'mastered') {
      const skill = getSkillBySlug(slug)
      if (skill) list.push(skill)
    }
  }
  return list
})

const learningSkills = computed(() => {
  const list = []
  for (const [slug, status] of Object.entries(statuses.value)) {
    if (status === 'learning') {
      const skill = getSkillBySlug(slug)
      if (skill) list.push(skill)
    }
  }
  return list
})

const todoSkills = computed(() => {
  const list = []
  for (const [slug, status] of Object.entries(statuses.value)) {
    if (status === 'todo') {
      const skill = getSkillBySlug(slug)
      if (skill) list.push(skill)
    }
  }
  return list
})

const bookmarkedSkills = computed(() => {
  return bookmarks.value.map(slug => getSkillBySlug(slug)).filter(Boolean)
})

const staleSkills = computed(() => {
  return getStaleLearning(statuses.value).map(s => {
    const skill = getSkillBySlug(s.slug)
    if (skill) {
      return { ...skill, lastViewed: getLastViewed(s.slug), viewCount: getViewCount(s.slug) }
    }
    return null
  }).filter(Boolean)
})

const recentSkills = computed(() => {
  return recentlyViewed.value.map(r => {
    const skill = getSkillBySlug(r.slug)
    if (skill) {
      return { ...skill, lastViewed: r.lastViewed, viewCount: r.count }
    }
    return null
  }).filter(Boolean)
})

function goToSkill(slug) {
  router.push({ name: 'skill-detail', params: { slug } })
}

function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const diffMs = now - d
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)
  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin} 分钟前`
  if (diffHr < 24) return `${diffHr} 小时前`
  if (diffDay < 7) return `${diffDay} 天前`
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function clearStatus(slug) {
  setStatus(slug, null)
}

const statusLabel = { todo: '待尝试', learning: '学习中', mastered: '已掌握' }
const statusIcon = {
  todo: '⏳',
  learning: '📖',
  mastered: '✅'
}
</script>

<template>
  <div>
  <SubNav />

  <div class="my-space">
    <!-- Page Header -->
    <div class="my-header">
      <button class="back-btn" @click="router.push({ name: 'home' })">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        返回首页
      </button>
      <h1 class="my-title">我的空间</h1>
      <p class="my-subtitle">学习进度、收藏与浏览记录</p>
      <div class="my-rule"></div>
    </div>

    <!-- ── Section: Learning Progress ── -->
    <section class="my-section">
      <div class="section-head">
        <h2 class="section-title">学习进度</h2>
        <span class="section-badge">{{ statusStats.mastered + statusStats.learning + statusStats.todo }} 项</span>
      </div>

      <!-- Progress Overview Ring -->
      <div class="progress-overview">
        <div class="progress-overview-ring">
          <svg viewBox="0 0 120 120">
            <circle class="ov-ring-bg" cx="60" cy="60" r="50" />
            <circle class="ov-ring-fill ov-ring--mastered" cx="60" cy="60" r="50"
              :stroke-dasharray="`${statusStats.mastered / Math.max(skills.length, 1) * 314.16} 314.16`" />
            <circle class="ov-ring-fill ov-ring--learning" cx="60" cy="60" r="50"
              :stroke-dasharray="`${statusStats.learning / Math.max(skills.length, 1) * 314.16} 314.16`"
              :stroke-dashoffset="`-${statusStats.mastered / Math.max(skills.length, 1) * 314.16}`" />
            <circle class="ov-ring-fill ov-ring--todo" cx="60" cy="60" r="50"
              :stroke-dasharray="`${statusStats.todo / Math.max(skills.length, 1) * 314.16} 314.16`"
              :stroke-dashoffset="`-${(statusStats.mastered + statusStats.learning) / Math.max(skills.length, 1) * 314.16}`" />
          </svg>
          <div class="ov-ring-center">
            <span class="ov-ring-num">{{ statusStats.mastered }}</span>
            <span class="ov-ring-label">已掌握</span>
          </div>
        </div>
        <div class="progress-overview-legend">
          <div class="ov-legend-item">
            <i class="ov-dot ov-dot--mastered"></i>
            <span>已掌握</span>
            <strong>{{ statusStats.mastered }}</strong>
          </div>
          <div class="ov-legend-item">
            <i class="ov-dot ov-dot--learning"></i>
            <span>学习中</span>
            <strong>{{ statusStats.learning }}</strong>
          </div>
          <div class="ov-legend-item">
            <i class="ov-dot ov-dot--todo"></i>
            <span>待尝试</span>
            <strong>{{ statusStats.todo }}</strong>
          </div>
        </div>
      </div>

      <!-- Skill lists by status -->
      <div v-if="masteredSkills.length" class="status-group">
        <h3 class="status-group-title"><i class="ov-dot ov-dot--mastered"></i> 已掌握</h3>
        <div class="skill-grid">
          <div v-for="skill in masteredSkills" :key="skill.slug" class="skill-item" @click="goToSkill(skill.slug)">
            <span class="skill-item__cat">{{ skill.category }}</span>
            <span class="skill-item__name">{{ skill.name }}</span>
            <span class="skill-item__desc">{{ skill.description }}</span>
            <button class="skill-item__clear" @click.stop="clearStatus(skill.slug)" title="清除状态">×</button>
          </div>
        </div>
      </div>

      <div v-if="learningSkills.length" class="status-group">
        <h3 class="status-group-title"><i class="ov-dot ov-dot--learning"></i> 学习中</h3>
        <div class="skill-grid">
          <div v-for="skill in learningSkills" :key="skill.slug" class="skill-item" @click="goToSkill(skill.slug)">
            <span class="skill-item__cat">{{ skill.category }}</span>
            <span class="skill-item__name">{{ skill.name }}</span>
            <span class="skill-item__desc">{{ skill.description }}</span>
            <button class="skill-item__clear" @click.stop="clearStatus(skill.slug)" title="清除状态">×</button>
          </div>
        </div>
      </div>

      <div v-if="todoSkills.length" class="status-group">
        <h3 class="status-group-title"><i class="ov-dot ov-dot--todo"></i> 待尝试</h3>
        <div class="skill-grid">
          <div v-for="skill in todoSkills" :key="skill.slug" class="skill-item" @click="goToSkill(skill.slug)">
            <span class="skill-item__cat">{{ skill.category }}</span>
            <span class="skill-item__name">{{ skill.name }}</span>
            <span class="skill-item__desc">{{ skill.description }}</span>
            <button class="skill-item__clear" @click.stop="clearStatus(skill.slug)" title="清除状态">×</button>
          </div>
        </div>
      </div>

      <p v-if="!masteredSkills.length && !learningSkills.length && !todoSkills.length" class="empty-hint">
        还没有标记任何学习状态，浏览技能时点击状态按钮开始记录
      </p>
    </section>

    <!-- ── Section: Bookmarks ── -->
    <section class="my-section">
      <div class="section-head">
        <h2 class="section-title">我的收藏</h2>
        <span class="section-badge">{{ bookmarkedSkills.length }} 项</span>
      </div>

      <div v-if="bookmarkedSkills.length" class="skill-grid">
        <div v-for="skill in bookmarkedSkills" :key="skill.slug" class="skill-item" @click="goToSkill(skill.slug)">
          <span class="skill-item__cat">{{ skill.category }}</span>
          <span class="skill-item__name">{{ skill.name }}</span>
          <span class="skill-item__desc">{{ skill.description }}</span>
        </div>
      </div>
      <p v-else class="empty-hint">点击技能卡片上的 ❤️ 收藏感兴趣的技能</p>
    </section>

    <!-- ── Section: Stale Learning ── -->
    <section v-if="staleSkills.length" class="my-section my-section--alert">
      <div class="section-head">
        <h2 class="section-title section-title--alert">该复习了</h2>
        <span class="section-badge section-badge--alert">{{ staleSkills.length }} 项</span>
      </div>
      <div class="skill-grid">
        <div v-for="skill in staleSkills" :key="skill.slug" class="skill-item skill-item--stale" @click="goToSkill(skill.slug)">
          <span class="skill-item__cat">{{ skill.category }}</span>
          <span class="skill-item__name">{{ skill.name }}</span>
          <span class="skill-item__meta">上次查看: {{ formatDate(skill.lastViewed) }} · {{ skill.viewCount }} 次</span>
        </div>
      </div>
    </section>

    <!-- ── Section: Recently Viewed ── -->
    <section class="my-section">
      <div class="section-head">
        <h2 class="section-title">最近查看</h2>
      </div>

      <div v-if="recentSkills.length" class="recent-timeline">
        <div v-for="skill in recentSkills" :key="skill.slug" class="recent-item" @click="goToSkill(skill.slug)">
          <div class="recent-dot"></div>
          <div class="recent-content">
            <span class="recent-name">{{ skill.name }}</span>
            <span class="recent-meta">{{ skill.category }} · {{ formatDate(skill.lastViewed) }} · {{ skill.viewCount }} 次</span>
          </div>
        </div>
      </div>
      <p v-else class="empty-hint">浏览技能后会自动记录在这里</p>
    </section>
  </div>
  </div>
</template>

<style scoped>
.my-space {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 22px 80px;
}

/* ── Header ── */

.my-header {
  padding-top: 40px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  color: #8a8a87;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-bottom: 16px;
  transition: color 0.15s ease;
}

.back-btn:hover {
  color: #c4553a;
}

.my-title {
  font-family: 'Crimson Pro', serif;
  font-size: 40px;
  font-weight: 600;
  color: #0a0a0a;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0;
}

.my-subtitle {
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  color: #6b6560;
  margin: 6px 0 0;
}

.my-rule {
  width: 60px;
  height: 2px;
  background: #c4553a;
  margin-top: 16px;
}

/* ── Section ── */

.my-section {
  margin-top: 48px;
}

.my-section--alert {
  background: rgba(229, 168, 75, 0.04);
  border: 1px solid rgba(229, 168, 75, 0.15);
  border-radius: 12px;
  padding: 24px;
  margin-left: -24px;
  margin-right: -24px;
  margin-top: 48px;
}

.section-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 20px;
}

.section-title {
  font-family: 'Crimson Pro', serif;
  font-size: 22px;
  font-weight: 600;
  color: #0a0a0a;
  margin: 0;
}

.section-title--alert {
  color: #b8860b;
}

.section-badge {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: #8a8a87;
  background: rgba(0,0,0,0.05);
  padding: 2px 8px;
  border-radius: 8px;
}

.section-badge--alert {
  color: #fff;
  background: #e5a84b;
}

/* ── Progress Overview ── */

.progress-overview {
  display: flex;
  align-items: center;
  gap: 32px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 14px;
  padding: 24px 28px;
  margin-bottom: 24px;
}

.progress-overview-ring {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.progress-overview-ring svg {
  width: 120px;
  height: 120px;
  transform: rotate(-90deg);
}

.ov-ring-bg {
  fill: none;
  stroke: rgba(0,0,0,0.05);
  stroke-width: 8;
}

.ov-ring-fill {
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease;
}

.ov-ring--mastered { stroke: #4caf7d; }
.ov-ring--learning { stroke: #5b8dd9; }
.ov-ring--todo { stroke: #e5a84b; }

.ov-ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ov-ring-num {
  font-family: 'Crimson Pro', serif;
  font-size: 28px;
  font-weight: 600;
  color: #0a0a0a;
  line-height: 1;
}

.ov-ring-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  color: #8a8a87;
  margin-top: 2px;
}

.progress-overview-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ov-legend-item {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #6b6560;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ov-legend-item strong {
  color: #0a0a0a;
  font-weight: 600;
  margin-left: auto;
}

.ov-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ov-dot--mastered { background: #4caf7d; }
.ov-dot--learning { background: #5b8dd9; }
.ov-dot--todo { background: #e5a84b; }

/* ── Status Groups ── */

.status-group {
  margin-bottom: 20px;
}

.status-group-title {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #6b6560;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ── Skill Grid ── */

.skill-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.skill-item {
  background: #fff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 10px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.skill-item:hover {
  border-color: rgba(196, 85, 58, 0.2);
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

.skill-item--stale {
  border-left: 3px solid #e5a84b;
}

.skill-item__cat {
  font-family: 'DM Sans', sans-serif;
  font-size: 9px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #c4553a;
}

.skill-item__name {
  font-family: 'Crimson Pro', serif;
  font-size: 15px;
  font-weight: 500;
  color: #0a0a0a;
  line-height: 1.3;
}

.skill-item__desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: #8a8a87;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.skill-item__meta {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  color: #b0ada8;
  margin-top: 2px;
}

.skill-item__clear {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #b0ada8;
  font-size: 14px;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.15s ease;
  line-height: 1;
  padding: 0;
}

.skill-item__clear:hover {
  background: rgba(0,0,0,0.06);
  color: #c4553a;
}

/* ── Recently Viewed Timeline ── */

.recent-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.recent-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 12px 0;
  cursor: pointer;
  transition: background 0.15s ease;
  border-bottom: 1px solid rgba(0,0,0,0.04);
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-item:hover {
  background: rgba(196, 85, 58, 0.02);
}

.recent-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c4553a;
  flex-shrink: 0;
  margin-top: 5px;
}

.recent-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.recent-name {
  font-family: 'Crimson Pro', serif;
  font-size: 15px;
  font-weight: 500;
  color: #0a0a0a;
}

.recent-meta {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  color: #8a8a87;
}

/* ── Empty State ── */

.empty-hint {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #b0ada8;
  font-style: italic;
  padding: 16px 0;
  margin: 0;
}
</style>
