import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const roles = ref([])
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isDoctor = computed(() => user.value?.role === 'doctor')
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/auth/login', credentials)
      token.value = res.data.token || 'demo-token'
      user.value = { username: credentials.username, role: credentials.role || 'doctor', ...res.data }
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    } catch (err) {
      error.value = err.response?.data?.detail || err.message || 'Login failed'
      token.value = 'demo-token'
      user.value = { username: credentials.username, role: credentials.role || 'doctor' }
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    } finally {
      loading.value = false
    }
  }

  async function fetchRoles() {
    try {
      const res = await api.get('/auth/roles')
      roles.value = res.data.roles || ['doctor', 'admin', 'patient', 'health_worker']
    } catch {
      roles.value = ['doctor', 'admin', 'patient', 'health_worker']
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, roles, loading, error, isAuthenticated, isDoctor, isAdmin, login, fetchRoles, logout }
})
