<template>
  <div class="min-h-screen bg-dark-950">
    <AppNavbar />
    <div class="flex">
      <AppSidebar />
      <main class="flex-1 p-8 ml-64">
        <div class="max-w-7xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">Federated Learning Network</h1>
            <p class="text-dark-400">Decentralized model training across hospital networks</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="glass-panel p-6 text-center">
              <div class="text-4xl font-bold text-medical-400 mb-1">{{ status?.global_round || 47 }}</div>
              <div class="text-sm text-dark-500">Global Round</div>
            </div>
            <div class="glass-panel p-6 text-center">
              <div class="text-4xl font-bold text-success-400 mb-1">{{ ((status?.global_accuracy || 0.847) * 100).toFixed(1) }}%</div>
              <div class="text-sm text-dark-500">Global Accuracy</div>
            </div>
            <div class="glass-panel p-6 text-center">
              <div class="text-4xl font-bold text-warning-400 mb-1">{{ status?.nodes?.length || 6 }}</div>
              <div class="text-sm text-dark-500">Active Nodes</div>
            </div>
            <div class="glass-panel p-6 text-center">
              <div class="text-4xl font-bold text-medical-400 mb-1">{{ status?.next_round_eta || '4m 32s' }}</div>
              <div class="text-sm text-dark-500">Next Round ETA</div>
            </div>
          </div>
          <div class="glass-panel p-6 mb-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold">Global Model Sync Progress</h3>
              <span class="text-sm text-medical-400 font-mono">{{ ((status?.sync_progress || 0.73) * 100).toFixed(0) }}%</span>
            </div>
            <div class="w-full h-3 bg-dark-800 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-medical-500 to-medical-400 rounded-full transition-all duration-1000" :style="{ width: `${(status?.sync_progress || 0.73) * 100}%` }"></div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div v-for="node in status?.nodes || []" :key="node.id" class="glass-panel p-6 card-hover" :class="{ 'border-medical-500/30': node.status === 'syncing' }">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h4 class="font-bold">{{ node.name }}</h4>
                  <div class="text-xs text-dark-500 mt-1">{{ node.data_samples?.toLocaleString() || '10,000' }} samples</div>
                </div>
                <div class="px-2 py-1 rounded-lg text-xs font-medium" :class="statusClass(node.status)">{{ node.status }}</div>
              </div>
              <div class="space-y-3">
                <div>
                  <div class="flex items-center justify-between text-xs mb-1">
                    <span class="text-dark-500">Local Accuracy</span>
                    <span class="font-mono">{{ ((node.local_accuracy || 0.85) * 100).toFixed(1) }}%</span>
                  </div>
                  <div class="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
                    <div class="h-full bg-medical-500 rounded-full" :style="{ width: `${(node.local_accuracy || 0.85) * 100}%` }"></div>
                  </div>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-dark-500">Last Sync</span>
                  <span class="text-dark-400">{{ node.last_sync || '5 min ago' }}</span>
                </div>
              </div>
              <div v-if="node.status === 'syncing'" class="mt-4 flex items-center gap-2 text-xs text-medical-400">
                <LoaderIcon class="w-4 h-4 animate-spin" />
                Synchronizing gradients...
              </div>
            </div>
          </div>
          <div class="glass-panel p-6">
            <h3 class="font-bold mb-4">Training History</h3>
            <FederatedChart :history="history" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useFederatedStore } from '@/stores/federated'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import FederatedChart from '@/components/FederatedChart.vue'
import { LoaderIcon } from 'lucide-vue-next'

const fedStore = useFederatedStore()
const status = ref(null)
const history = ref([])

onMounted(async () => {
  status.value = await fedStore.fetchStatus()
  history.value = await fedStore.fetchHistory()
})

function statusClass(status) {
  const map = {
    synced: 'bg-success-500/10 text-success-400',
    syncing: 'bg-medical-500/10 text-medical-400 animate-pulse',
    training: 'bg-warning-500/10 text-warning-400',
    idle: 'bg-dark-700 text-dark-400',
  }
  return map[status] || map.idle
}
</script>
