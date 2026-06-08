import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/skill/:slug',
      name: 'skill-detail',
      component: () => import('../views/SkillDetailView.vue'),
    },
    {
      path: '/my',
      name: 'my-space',
      component: () => import('../views/MySpaceView.vue'),
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: () => import('../views/LeaderboardView.vue'),
    },
  ],
})

export default router