import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'

export const useSimulationStore = defineStore('simulation', () => {
  const drugs = ref([])
  const diseases = ref([])
  const simulationResult = ref(null)
  const xaiResult = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const history = ref([])

  const hasResult = computed(() => !!simulationResult.value)
  const hasXAI = computed(() => !!xaiResult.value)

  async function fetchDrugs() {
    try {
      const res = await api.get('/simulation/drugs')
      drugs.value = res.data.drugs || res.data || []
      if (!drugs.value.length) drugs.value = ['NSAID', 'ACE Inhibitor', 'Metformin', 'Insulin', 'Amoxicillin', 'Atorvastatin', 'Lisinopril', 'Amlodipine']
    } catch {
      drugs.value = ['NSAID', 'ACE Inhibitor', 'Metformin', 'Insulin', 'Amoxicillin', 'Atorvastatin', 'Lisinopril', 'Amlodipine']
    }
  }

  async function fetchDiseases() {
    try {
      const res = await api.get('/simulation/diseases')
      diseases.value = res.data.diseases || res.data || []
      if (!diseases.value.length) diseases.value = ['CKD', 'Diabetes', 'Hypertension', 'Heart Disease', 'COPD', 'Liver Disease', 'Asthma']
    } catch {
      diseases.value = ['CKD', 'Diabetes', 'Hypertension', 'Heart Disease', 'COPD', 'Liver Disease', 'Asthma']
    }
  }

  async function runSimulation(params) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/simulation/simulate', params)
      simulationResult.value = res.data
      history.value.unshift({ type: 'simulation', params, result: res.data, timestamp: new Date() })
      return res.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Simulation failed'
      const mock = generateMockSimulation(params)
      simulationResult.value = mock
      history.value.unshift({ type: 'simulation', params, result: mock, timestamp: new Date() })
      return mock
    } finally {
      loading.value = false
    }
  }

  async function getXAI(params) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/xai/explain', params)
      xaiResult.value = res.data
      return res.data
    } catch (err) {
      error.value = err.response?.data?.detail || 'XAI failed'
      const mock = generateMockXAI(params)
      xaiResult.value = mock
      return mock
    } finally {
      loading.value = false
    }
  }

  async function getFeatureImportance() {
    try {
      const res = await api.get('/xai/feature-importance')
      return res.data
    } catch {
      return {
        features: [
          { name: 'Age', importance: 0.28 },
          { name: 'Kidney Function', importance: 0.24 },
          { name: 'Drug Dosage', importance: 0.19 },
          { name: 'Comorbidities', importance: 0.15 },
          { name: 'Weight', importance: 0.09 },
          { name: 'Smoking', importance: 0.05 },
        ]
      }
    }
  }

  function clearSimulation() {
    simulationResult.value = null
    xaiResult.value = null
    error.value = null
  }

  return { drugs, diseases, simulationResult, xaiResult, loading, error, history, hasResult, hasXAI, fetchDrugs, fetchDiseases, runSimulation, getXAI, getFeatureImportance, clearSimulation }
})

function generateMockSimulation(params) {
  const isHarmful = params.drug === 'NSAID' && params.disease === 'CKD'
  const baseHealth = isHarmful ? 45 : 78
  const trajectory = Array.from({ length: 8 }, (_, i) => {
    const change = isHarmful ? -8 + Math.random() * 4 : -2 + Math.random() * 6
    return Math.max(10, Math.min(100, Math.round(baseHealth + change * i)))
  })

  return {
    kidney_health: trajectory[trajectory.length - 1],
    organ_health: {
      brain: Math.max(10, Math.min(100, baseHealth + Math.floor(Math.random() * 12))),
      lungs: Math.max(10, Math.min(100, baseHealth + Math.floor(Math.random() * 15))),
      heart: Math.max(10, Math.min(100, baseHealth + Math.floor(Math.random() * 20))),
      liver: Math.max(10, Math.min(100, baseHealth + Math.floor(Math.random() * 18))),
      stomach: Math.max(10, Math.min(100, baseHealth + Math.floor(Math.random() * 10))),
      kidney: trajectory[trajectory.length - 1],
      spine: Math.max(10, Math.min(100, baseHealth + Math.floor(Math.random() * 8))),
    },
    toxicity: isHarmful ? 'high' : ['low', 'moderate', 'low'][Math.floor(Math.random() * 3)],
    trajectory,
    warning: isHarmful
      ? 'Renal filtration decreasing rapidly. NSAID contraindicated in CKD patients.'
      : 'Treatment trajectory stable. Monitor kidney function periodically.',
    vitals: {
      heart_rate: 68 + Math.floor(Math.random() * 25),
      blood_pressure: { systolic: 115 + Math.floor(Math.random() * 25), diastolic: 75 + Math.floor(Math.random() * 15) },
      oxygen: 94 + Math.floor(Math.random() * 6),
      glucose: 85 + Math.floor(Math.random() * 40),
    },
    risk_level: isHarmful ? 'critical' : 'moderate',
    recommendation: isHarmful
      ? 'Switch to acetaminophen for pain management. Consider nephrology consult.'
      : 'Continue current regimen. Schedule follow-up in 2 weeks.',
  }
}

function generateMockXAI(params) {
  const isHarmful = params.drug === 'NSAID' && params.disease === 'CKD'
  return {
    explanation: isHarmful
      ? `The ${params.drug} reduces prostaglandin synthesis, which vasodilates afferent arterioles in the kidney. In ${params.disease} patients, this causes acute kidney injury by reducing renal blood flow by ~40%.`
      : `The ${params.drug} mechanism is compatible with ${params.disease} pathology. No major contraindications detected in patient profile.`,
    causal_reasoning: [
      { factor: 'Drug-Organ Interaction', impact: isHarmful ? -0.85 : 0.12, description: isHarmful ? 'NSAIDs inhibit COX enzymes → ↓ PGE2 → vasoconstriction → ↓ GFR' : 'Standard metabolic pathway clearance' },
      { factor: 'Disease Stage', impact: isHarmful ? -0.62 : -0.15, description: 'CKD Stage 3+ has compromised renal reserve' },
      { factor: 'Age Factor', impact: -0.28, description: 'Age >65 reduces drug clearance by 30%' },
      { factor: 'Comorbidity Load', impact: isHarmful ? -0.45 : -0.10, description: 'Diabetes + CKD doubles nephrotoxic risk' },
    ],
    risk_factors: [
      { name: 'Acute Kidney Injury', probability: isHarmful ? 0.78 : 0.12, severity: isHarmful ? 'high' : 'low' },
      { name: 'Electrolyte Imbalance', probability: isHarmful ? 0.55 : 0.08, severity: isHarmful ? 'moderate' : 'low' },
      { name: 'Drug Accumulation', probability: isHarmful ? 0.42 : 0.15, severity: 'moderate' },
    ],
    shap_summary: {
      top_positive: isHarmful ? [] : [{ feature: 'Drug Efficacy', value: 0.34 }],
      top_negative: isHarmful
        ? [{ feature: 'NSAID → Kidney', value: -0.72 }, { feature: 'High Dose', value: -0.41 }]
        : [{ feature: 'Age', value: -0.18 }],
    },
  }
}
