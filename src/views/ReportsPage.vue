<template>
  <div class="min-h-screen bg-dark-950">
    <AppNavbar />
    <div class="flex">
      <AppSidebar />
      <main class="flex-1 p-8 ml-64">
        <div class="max-w-7xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
            <p class="text-dark-400">Simulation history and system analytics</p>
          </div>
          <div class="glass-panel p-6 mb-8">
            <h3 class="font-bold mb-4">Recent Simulations</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-left text-dark-500 border-b border-dark-700">
                    <th class="pb-3 font-medium">Time</th>
                    <th class="pb-3 font-medium">Disease</th>
                    <th class="pb-3 font-medium">Drug</th>
                    <th class="pb-3 font-medium">Dose</th>
                    <th class="pb-3 font-medium">Risk</th>
                    <th class="pb-3 font-medium">Toxicity</th>
                    <th class="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in simStore.history" :key="i" class="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                    <td class="py-3 text-dark-500">{{ formatTime(item.timestamp) }}</td>
                    <td class="py-3">{{ item.params.disease }}</td>
                    <td class="py-3 font-mono">{{ item.params.drug }}</td>
                    <td class="py-3 capitalize">{{ item.params.dose }}</td>
                    <td class="py-3">
                      <span class="px-2 py-0.5 rounded text-xs font-medium" :class="riskClass(item.result.risk_level)">{{ item.result.risk_level }}</span>
                    </td>
                    <td class="py-3 capitalize">{{ item.result.toxicity }}</td>
                    <td class="py-3"><span class="text-success-400 text-xs">● Completed</span></td>
                  </tr>
                  <tr v-if="!simStore.history.length">
                    <td colspan="7" class="py-8 text-center text-dark-500">No simulations run yet. Go to the Simulator to start.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="glass-panel p-6">
            <h3 class="font-bold mb-4">Feature Importance (XAI)</h3>
            <div v-if="featureImportance.length" class="space-y-3">
              <div v-for="feat in featureImportance" :key="feat.name" class="flex items-center gap-4">
                <span class="w-32 text-sm text-dark-300">{{ feat.name }}</span>
                <div class="flex-1 h-3 bg-dark-800 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-medical-500 to-medical-400 rounded-full" :style="{ width: `${feat.importance * 100}%` }"></div>
                </div>
                <span class="w-16 text-right text-sm font-mono text-dark-400">{{ (feat.importance * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useSimulationStore } from '@/stores/simulation'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'

const simStore = useSimulationStore()
const featureImportance = ref([])

onMounted(async () => {
  const data = await simStore.getFeatureImportance()
  featureImportance.value = data.features || []
})

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function riskClass(level) {
  const map = { critical: 'bg-danger-500/10 text-danger-400', moderate: 'bg-warning-500/10 text-warning-400', low: 'bg-success-500/10 text-success-400' }
  return map[level] || map.low
}
</script>
