<template>
  <aside class="fixed left-0 top-16 bottom-0 w-64 bg-dark-900/50 backdrop-blur-xl border-r border-dark-800/50 overflow-y-auto scrollbar-thin z-40">
    <div class="p-4 space-y-1">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
        :class="$route.path === item.path ? 'bg-medical-500/10 text-medical-300 border border-medical-500/20' : 'text-dark-400 hover:bg-dark-800/50 hover:text-dark-200'"
      >
        <component :is="item.icon" class="w-5 h-5" />
        {{ item.label }}
      </router-link>
    </div>
    <div class="p-4 mt-4 border-t border-dark-800/50">
      <div class="glass-panel-light p-4">
        <div class="text-xs text-dark-500 mb-2">System Status</div>
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-dark-400">API</span>
            <span class="text-success-400 flex items-center gap-1">
              <div class="w-1.5 h-1.5 rounded-full bg-success-500"></div>
              Online
            </span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-dark-400">Models</span>
            <span class="text-medical-400">v2.4.1</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-dark-400">Latency</span>
            <span class="text-dark-400">{{ latency }}ms</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  LayoutDashboardIcon, FlaskConicalIcon, NetworkIcon,
  ShieldCheckIcon, FileTextIcon, HomeIcon
} from 'lucide-vue-next'

const latency = ref(42)

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { path: '/simulator', label: 'Simulator', icon: FlaskConicalIcon },
  { path: '/federated', label: 'Federated', icon: NetworkIcon },
  { path: '/governance', label: 'Governance', icon: ShieldCheckIcon },
  { path: '/reports', label: 'Reports', icon: FileTextIcon },
  { path: '/', label: 'Landing', icon: HomeIcon },
]

onMounted(() => {
  setInterval(() => { latency.value = 30 + Math.floor(Math.random() * 40) }, 3000)
})
</script>
