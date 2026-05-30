import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export const useFederatedStore = defineStore('federated', () => {
  const status = ref(null)
  const history = ref([])
  const loading = ref(false)

  async function fetchStatus() {
    loading.value = true
    try {
      const res = await api.get('/federated/status')
      status.value = res.data
      return res.data
    } catch {
      status.value = generateMockStatus()
      return status.value
    } finally {
      loading.value = false
    }
  }

  async function fetchHistory() {
    try {
      const res = await api.get('/federated/training-history')
      history.value = res.data.history || []
      return history.value
    } catch {
      history.value = generateMockHistory()
      return history.value
    }
  }

  return { status, history, loading, fetchStatus, fetchHistory }
})

function generateMockStatus() {
  return {
    global_round: 47,
    global_accuracy: 0.847,
    nodes: [
      { id: 'hospital-1', name: 'Mayo Clinic', local_accuracy: 0.891, data_samples: 12450, status: 'synced', last_sync: '2 min ago' },
      { id: 'hospital-2', name: 'Johns Hopkins', local_accuracy: 0.872, data_samples: 9870, status: 'syncing', last_sync: 'now' },
      { id: 'hospital-3', name: 'Cleveland Clinic', local_accuracy: 0.865, data_samples: 11200, status: 'synced', last_sync: '5 min ago' },
      { id: 'hospital-4', name: 'Mass General', local_accuracy: 0.858, data_samples: 7800, status: 'training', last_sync: '12 min ago' },
      { id: 'hospital-5', name: 'Stanford Health', local_accuracy: 0.881, data_samples: 10500, status: 'synced', last_sync: '1 min ago' },
      { id: 'hospital-6', name: 'UCSF Medical', local_accuracy: 0.849, data_samples: 9200, status: 'idle', last_sync: '20 min ago' },
    ],
    sync_progress: 0.73,
    next_round_eta: '4m 32s',
  }
}

function generateMockHistory() {
  return Array.from({ length: 20 }, (_, i) => ({
    round: i + 1,
    global_accuracy: 0.55 + (i * 0.015) + Math.random() * 0.02,
    loss: 0.8 - (i * 0.035) + Math.random() * 0.03,
    nodes_contributed: 4 + Math.floor(Math.random() * 3),
  }))
}
