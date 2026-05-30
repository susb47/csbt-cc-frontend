import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'

export const usePatientStore = defineStore('patient', () => {
  const patients = ref([])
  const currentPatient = ref(null)
  const currentTwin = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const hasPatient = computed(() => !!currentPatient.value)
  const hasTwin = computed(() => !!currentTwin.value)

  async function createTwin(profile) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/patients/create-twin', profile)
      currentTwin.value = res.data
      currentPatient.value = { ...profile, twin_id: res.data.twin_id || res.data.id }
      patients.value.push(currentPatient.value)
      return res.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to create twin'
      const mockTwin = {
        twin_id: `twin-${Date.now()}`,
        patient_state: profile,
        risk_score: Math.floor(Math.random() * 40) + 10,
        vitals: (() => {
                const stage = profile.disease_stage || 'moderate'
                const severity = { early: 0.2, moderate: 0.5, advanced: 0.8, critical: 1.0 }[stage] || 0.5
                return {
                  heart_rate: Math.floor(60 + 40 * severity + Math.random() * 15),
                  blood_pressure: {
                    systolic: Math.floor(110 + 40 * severity + Math.random() * 15),
                    diastolic: Math.floor(70 + 25 * severity + Math.random() * 10),
                  },
                  oxygen: Math.floor(99 - 15 * severity + Math.random() * 5),
                  glucose: Math.floor(85 + 60 * severity + Math.random() * 20),
                  kidney_function: Math.floor(90 - 70 * severity + Math.random() * 10),
                }
              })(),
        organ_health: (() => {
          const stage = profile.disease_stage || 'moderate'
          const ranges = {
            early:    [85, 100],
            moderate: [55, 75],
            advanced: [25, 45],
            critical: [8, 22],
          }
          const [min, max] = ranges[stage] || ranges.moderate
          const rand = () => Math.floor(min + Math.random() * (max - min))
          const isCKD = profile.disease === 'CKD'
          return {
            brain:  isCKD && stage === 'critical' ? rand() : rand(),
            lungs:  rand(),
            heart:  rand(),
            liver:  rand(),
            stomach: rand(),
            kidney: isCKD ? Math.floor(min * 0.7 + Math.random() * (max - min) * 0.7) : rand(),
            spine:  Math.min(100, rand() + 20),
          }
        })(),
        ...profile,
      }
      currentTwin.value = mockTwin
      currentPatient.value = { ...profile, twin_id: mockTwin.twin_id }
      patients.value.push(currentPatient.value)
      return mockTwin
    } finally {
      loading.value = false
    }
  }

  async function listPatients() {
    try {
      const res = await api.get('/patients/list')
      patients.value = res.data.patients || []
      return patients.value
    } catch {
      return patients.value
    }
  }

  function clearPatient() {
    currentPatient.value = null
    currentTwin.value = null
  }

  return { patients, currentPatient, currentTwin, loading, error, hasPatient, hasTwin, createTwin, listPatients, clearPatient }
})
