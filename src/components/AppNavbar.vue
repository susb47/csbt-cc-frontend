<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50 h-16">
    <div class="flex items-center justify-between h-full px-6 max-w-[1920px] mx-auto">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-gradient-to-br from-medical-400 to-medical-600 rounded-lg flex items-center justify-center">
          <DnaIcon class="w-5 h-5 text-white" />
        </div>
        <router-link to="/dashboard" class="text-lg font-bold text-gradient hidden sm:block">CausalBioTwin</router-link>
      </div>
      <div class="flex items-center gap-4">
        <div class="hidden md:flex items-center gap-1 px-3 py-1.5 bg-medical-500/10 border border-medical-500/20 rounded-lg">
          <div class="w-2 h-2 rounded-full bg-success-500 animate-pulse"></div>
          <span class="text-xs text-medical-300 font-mono">API Connected</span>
        </div>
        <div class="flex items-center gap-3 pl-4 border-l border-dark-700/50">
          <div class="text-right hidden sm:block">
            <div class="text-sm font-medium">{{ authStore.user?.username || 'User' }}</div>
            <div class="text-xs text-dark-500 capitalize">{{ authStore.user?.role || 'doctor' }}</div>
          </div>
          <div class="w-9 h-9 bg-gradient-to-br from-medical-500 to-medical-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {{ (authStore.user?.username || 'U').charAt(0).toUpperCase() }}
          </div>
          <button @click="logout" class="p-2 hover:bg-dark-800 rounded-lg transition-colors text-dark-500 hover:text-danger-400">
            <LogOutIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { DnaIcon, LogOutIcon } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>
