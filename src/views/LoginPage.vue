<template>
  <div class="min-h-screen flex items-center justify-center bg-dark-950 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-medical-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-medical-600/10 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 1s"></div>
    </div>
    <div class="relative z-10 w-full max-w-md px-8">
      <div class="text-center mb-10">
        <div class="w-16 h-16 bg-gradient-to-br from-medical-400 to-medical-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-medical-500/20">
          <DnaIcon class="w-9 h-9 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gradient mb-2">CausalBioTwin</h1>
        <p class="text-dark-400">Sign in to access the healthcare platform</p>
      </div>
      <div class="glass-panel p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-dark-300 mb-2">Username</label>
            <input v-model="form.username" type="text" class="input-field" placeholder="Enter username" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-dark-300 mb-2">Password</label>
            <input v-model="form.password" type="password" class="input-field" placeholder="Enter password" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-dark-300 mb-2">Role</label>
            <select v-model="form.role" class="select-field">
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
              <option value="patient">Patient</option>
              <option value="health_worker">Health Worker</option>
            </select>
          </div>
          <div v-if="authStore.error" class="p-4 bg-danger-500/10 border border-danger-500/20 rounded-xl text-danger-400 text-sm">
            {{ authStore.error }}
          </div>
          <button type="submit" class="btn-primary w-full flex items-center justify-center gap-2" :disabled="authStore.loading">
            <LoaderIcon v-if="authStore.loading" class="w-5 h-5 animate-spin" />
            <span v-else>Sign In</span>
            <ArrowRightIcon v-if="!authStore.loading" class="w-5 h-5" />
          </button>
        </form>
        <div class="mt-6 pt-6 border-t border-dark-700/50">
          <p class="text-xs text-dark-500 text-center">
            Demo credentials: any username / password works.<br>
            Backend: <span class="text-medical-400">sumoy47-infinity-ai-bf.hf.space</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { DnaIcon, ArrowRightIcon, LoaderIcon } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: 'dr-demo',
  password: 'demo123',
  role: 'doctor',
})

async function handleLogin() {
  const success = await authStore.login(form)
  if (success) router.push('/dashboard')
}
</script>
