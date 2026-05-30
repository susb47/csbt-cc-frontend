import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', name: 'Landing', component: () => import('@/views/LandingPage.vue') },
  { path: '/login', name: 'Login', component: () => import('@/views/LoginPage.vue') },
  { path: '/dashboard', name: 'Dashboard', component: () => import('@/views/DashboardPage.vue'), meta: { requiresAuth: true } },
  { path: '/simulator', name: 'Simulator', component: () => import('@/views/SimulatorPage.vue'), meta: { requiresAuth: true } },
  { path: '/federated', name: 'Federated', component: () => import('@/views/FederatedPage.vue'), meta: { requiresAuth: true } },
  { path: '/governance', name: 'Governance', component: () => import('@/views/GovernancePage.vue'), meta: { requiresAuth: true } },
  { path: '/reports', name: 'Reports', component: () => import('@/views/ReportsPage.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
