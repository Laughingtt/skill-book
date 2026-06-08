<script setup>
import { onMounted } from 'vue'
import { useLeaderboard, parseInstalls } from '../composables/useLeaderboard'
import SubNav from '../components/SubNav.vue'

const { hotSkills, loading, error, lastUpdated, fetchLeaderboard } = useLeaderboard()

onMounted(fetchLeaderboard)

function formatInstalls(val) {
  const n = parseInstalls(val)
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toString()
}
</script>

<template>
  <div>
    <SubNav />
    <div class="lb-page">
      <header class="lb-header">
        <h1 class="lb-title">Skill 排行榜</h1>
        <p class="lb-subtitle">来自 skills.sh 的实时数据 · 按安装量排序</p>
        <div class="lb-rule"></div>
        <p v-if="lastUpdated" class="lb-updated">
          更新于 {{ new Date(lastUpdated).toLocaleString('zh-CN') }}
          <span class="lb-cache-hint">（每 30 分钟刷新）</span>
        </p>
      </header>

      <div v-if="loading" class="lb-loading">加载中...</div>
      <div v-else-if="error" class="lb-error">
        <p>加载排行榜失败: {{ error }}</p>
        <p class="lb-error-hint">排行榜功能需要开发服务器支持。生产环境请访问 <a href="https://skills.sh" target="_blank">skills.sh</a></p>
      </div>
      <div v-else class="lb-table-wrap">
        <table class="lb-table">
          <thead>
            <tr>
              <th class="lb-col-rank">#</th>
              <th class="lb-col-name">Skill</th>
              <th class="lb-col-installs">安装量</th>
              <th class="lb-col-link">来源</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(skill, i) in hotSkills" :key="skill.name" class="lb-row">
              <td class="lb-col-rank">
                <span v-if="i < 3" class="lb-rank-badge" :class="`lb-rank--${i + 1}`">{{ i + 1 }}</span>
                <span v-else class="lb-rank-num">{{ i + 1 }}</span>
              </td>
              <td class="lb-col-name">
                <span class="lb-skill-name">{{ skill.name }}</span>
              </td>
              <td class="lb-col-installs">{{ formatInstalls(skill.installs) }}</td>
              <td class="lb-col-link">
                <a v-if="skill.url" :href="skill.url" target="_blank" class="lb-ext-link">查看 →</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lb-page { max-width: 800px; margin: 0 auto; padding: 0 22px 80px; }
.lb-header { padding-top: 40px; }
.lb-title {
  font-family: 'Crimson Pro', serif; font-size: 40px; font-weight: 600;
  color: var(--color-text-primary); line-height: 1.1; letter-spacing: -0.02em; margin: 0;
}
.lb-subtitle {
  font-family: 'DM Sans', sans-serif; font-size: 15px;
  color: var(--color-text-secondary); margin: 6px 0 0;
}
.lb-rule { width: 60px; height: 2px; background: var(--color-accent); margin-top: 16px; }
.lb-updated {
  font-family: 'DM Sans', sans-serif; font-size: 12px;
  color: var(--color-text-tertiary); margin-top: 12px;
}
.lb-cache-hint { color: var(--color-text-tertiary); font-style: italic; }
.lb-loading, .lb-error { padding: 40px 0; text-align: center; }
.lb-loading { font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--color-text-secondary); }
.lb-error p { font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--color-text-secondary); }
.lb-error-hint { font-size: 12px !important; color: var(--color-text-tertiary) !important; margin-top: 8px; }
.lb-error-hint a { color: var(--color-accent); }
.lb-table-wrap { margin-top: 32px; }
.lb-table { width: 100%; border-collapse: collapse; }
.lb-table th {
  font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--color-text-tertiary); text-align: left;
  padding: 0 0 12px; border-bottom: 1px solid var(--color-border);
}
.lb-col-rank { width: 40px; }
.lb-col-installs { width: 100px; }
.lb-col-link { width: 80px; text-align: right; }
.lb-row td { padding: 14px 0; border-bottom: 1px solid var(--color-border); }
.lb-rank-badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border-radius: 50%;
  font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; color: white;
}
.lb-rank--1 { background: #f5a623; }
.lb-rank--2 { background: #9b9b9b; }
.lb-rank--3 { background: #cd7f32; }
.lb-rank-num { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--color-text-tertiary); }
.lb-skill-name { font-family: 'DM Mono', Menlo, monospace; font-size: 13px; color: var(--color-text-primary); word-break: break-all; }
.lb-ext-link { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--color-accent); text-decoration: none; }
.lb-ext-link:hover { text-decoration: underline; }
</style>
