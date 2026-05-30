<template>
  <div class="min-h-screen bg-dark-950">
    <AppNavbar />
    <div class="flex">
      <AppSidebar />
      <main class="flex-1 p-8 ml-64">
        <div class="max-w-7xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p class="text-dark-400">Overview of your digital twin operations</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="glass-panel p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-medical-500/10 rounded-xl flex items-center justify-center">
                  <UsersIcon class="w-6 h-6 text-medical-400" />
                </div>
                <span class="text-xs font-medium text-medical-400 bg-medical-500/10 px-2 py-1 rounded-full">+12%</span>
              </div>
              <div class="text-2xl font-bold text-white">{{ patientStore.patients.length }}</div>
              <div class="text-sm text-dark-500">Active Twins</div>
            </div>
            <div class="glass-panel p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-success-500/10 rounded-xl flex items-center justify-center">
                  <ActivityIcon class="w-6 h-6 text-success-400" />
                </div>
                <span class="text-xs font-medium text-success-400 bg-success-500/10 px-2 py-1 rounded-full">+5%</span>
              </div>
              <div class="text-2xl font-bold text-white">{{ simStore.history.length }}</div>
              <div class="text-sm text-dark-500">Simulations Run</div>
            </div>
            <div class="glass-panel p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-warning-500/10 rounded-xl flex items-center justify-center">
                  <AlertTriangleIcon class="w-6 h-6 text-warning-400" />
                </div>
                <span class="text-xs font-medium text-danger-400 bg-danger-500/10 px-2 py-1 rounded-full">3 new</span>
              </div>
              <div class="text-2xl font-bold text-white">7</div>
              <div class="text-sm text-dark-500">Active Alerts</div>
            </div>
            <div class="glass-panel p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 bg-medical-500/10 rounded-xl flex items-center justify-center">
                  <NetworkIcon class="w-6 h-6 text-medical-400" />
                </div>
                <span class="text-xs font-medium text-medical-400 bg-medical-500/10 px-2 py-1 rounded-full">Live</span>
              </div>
              <div class="text-2xl font-bold text-white">6</div>
              <div class="text-sm text-dark-500">Federated Nodes</div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="glass-panel p-8">
              <h3 class="text-xl font-bold mb-4">Quick Actions</h3>
              <div class="grid grid-cols-2 gap-4">
                <router-link to="/simulator" class="glass-panel-light p-4 hover:bg-dark-700/50 transition-colors group">
                  <PillIcon class="w-8 h-8 text-medical-400 mb-3 group-hover:scale-110 transition-transform" />
                  <div class="font-semibold">New Simulation</div>
                  <div class="text-xs text-dark-500 mt-1">Run drug treatment sim</div>
                </router-link>
                <router-link to="/federated" class="glass-panel-light p-4 hover:bg-dark-700/50 transition-colors group">
                  <NetworkIcon class="w-8 h-8 text-success-400 mb-3 group-hover:scale-110 transition-transform" />
                  <div class="font-semibold">Federated Status</div>
                  <div class="text-xs text-dark-500 mt-1">Check model sync</div>
                </router-link>
                <router-link to="/governance" class="glass-panel-light p-4 hover:bg-dark-700/50 transition-colors group">
                  <ShieldCheckIcon class="w-8 h-8 text-warning-400 mb-3 group-hover:scale-110 transition-transform" />
                  <div class="font-semibold">Governance</div>
                  <div class="text-xs text-dark-500 mt-1">Vote on protocols</div>
                </router-link>
                <router-link to="/reports" class="glass-panel-light p-4 hover:bg-dark-700/50 transition-colors group">
                  <FileTextIcon class="w-8 h-8 text-medical-400 mb-3 group-hover:scale-110 transition-transform" />
                  <div class="font-semibold">Reports</div>
                  <div class="text-xs text-dark-500 mt-1">View audit logs</div>
                </router-link>
              </div>
            </div>
            <div class="glass-panel p-8">
              <h3 class="text-xl font-bold mb-4">Recent Activity</h3>
              <div class="space-y-4">
                <div v-for="(item, i) in recentActivity" :key="i" class="flex items-start gap-4 p-3 rounded-xl hover:bg-dark-800/50 transition-colors">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" :class="item.iconBg">
                    <component :is="item.icon" class="w-5 h-5" :class="item.iconColor" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-sm">{{ item.title }}</div>
                    <div class="text-xs text-dark-500 mt-0.5">{{ item.desc }}</div>
                  </div>
                  <div class="text-xs text-dark-600 shrink-0">{{ item.time }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="patientStore.currentPatient" class="glass-panel p-8 mb-8">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold">Current Patient Twin</h3>
              <router-link to="/simulator" class="btn-primary text-sm">Run Simulation</router-link>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="glass-panel-light p-4">
                <div class="text-xs text-dark-500 mb-1">Patient</div>
                <div class="font-semibold">{{ patientStore.currentPatient.disease }}</div>
                <div class="text-xs text-dark-500">{{ patientStore.currentPatient.age }}y, {{ patientStore.currentPatient.gender }}</div>
              </div>
              <div class="glass-panel-light p-4">
                <div class="text-xs text-dark-500 mb-1">Risk Score</div>
                <div class="font-semibold" :class="riskColor">{{ patientStore.currentTwin?.risk_score || 'N/A' }}</div>
                <div class="text-xs text-dark-500">out of 100</div>
              </div>
              <div class="glass-panel-light p-4">
                <div class="text-xs text-dark-500 mb-1">Twin ID</div>
                <div class="font-mono text-sm">{{ patientStore.currentTwin?.twin_id?.slice(0, 12) }}...</div>
                <div class="text-xs text-dark-500">Active</div>
              </div>
              <div class="glass-panel-light p-4">
                <div class="text-xs text-dark-500 mb-1">Status</div>
                <div class="font-semibold text-success-400">● Ready</div>
                <div class="text-xs text-dark-500">For simulation</div>
              </div>
            </div>
          </div>
          <div v-else class="glass-panel p-8 mb-8 text-center">
            <UserIcon class="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 class="text-xl font-bold mb-2">No Active Patient Twin</h3>
            <p class="text-dark-400 mb-6">Create a digital twin to begin drug simulations</p>
            <router-link to="/simulator" class="btn-primary">Create Digital Twin</router-link>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePatientStore } from '@/stores/patient'
import { useSimulationStore } from '@/stores/simulation'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { UsersIcon, ActivityIcon, AlertTriangleIcon, NetworkIcon, PillIcon, ShieldCheckIcon, FileTextIcon, UserIcon, DnaIcon, BrainIcon, HeartIcon, TrendingUpIcon } from 'lucide-vue-next'

const patientStore = usePatientStore()
const simStore = useSimulationStore()

const riskColor = computed(() => {
  const score = patientStore.currentTwin?.risk_score || 0
  if (score > 70) return 'text-danger-400'
  if (score > 40) return 'text-warning-400'
  return 'text-success-400'
})

const recentActivity = [
  { title: 'Digital Twin Created', desc: 'CKD patient, age 67, male', time: '2m ago', icon: DnaIcon, iconBg: 'bg-medical-500/10', iconColor: 'text-medical-400' },
  { title: 'Simulation Completed', desc: 'NSAID → CKD: Critical warning', time: '5m ago', icon: BrainIcon, iconBg: 'bg-danger-500/10', iconColor: 'text-danger-400' },
  { title: 'Federated Sync', desc: 'Model v2.4 updated across 6 nodes', time: '12m ago', icon: TrendingUpIcon, iconBg: 'bg-success-500/10', iconColor: 'text-success-400' },
  { title: 'Protocol Vote', desc: 'NSAID contraindication: 75% approved', time: '1h ago', icon: HeartIcon, iconBg: 'bg-warning-500/10', iconColor: 'text-warning-400' },
]
</script>
