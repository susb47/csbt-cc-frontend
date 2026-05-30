<template>
  <div class="min-h-screen bg-dark-950">
    <AppNavbar />
    <div class="flex">
      <AppSidebar />
      <main class="flex-1 p-6 ml-64">
        <div class="max-w-[1600px] mx-auto">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-2xl font-bold text-white">Drug Simulation Lab</h1>
              <p class="text-dark-400 text-sm">Create twins, simulate treatments, analyze outcomes</p>
            </div>
            <div class="flex items-center gap-3">
              <button v-if="patientStore.hasTwin" @click="clearAll" class="btn-secondary text-sm">
                <RotateCcwIcon class="w-4 h-4 inline mr-1" />
                Reset
              </button>
              <div class="px-3 py-1.5 bg-medical-500/10 border border-medical-500/20 rounded-lg text-xs text-medical-300 font-mono">
                API: sumoy47-infinity-ai-bf.hf.space
              </div>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-6">
            <!-- LEFT: Patient Builder -->
            <div class="col-span-3 space-y-6">
              <div class="glass-panel p-5">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-6 h-6 rounded-full bg-medical-500 text-white text-xs flex items-center justify-center font-bold">1</div>
                  <h3 class="font-bold">Patient Profile</h3>
                </div>
                <form @submit.prevent="createTwin" class="space-y-3">
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="text-xs text-dark-500 mb-1 block">Age</label>
                      <input v-model.number="profile.age" type="number" class="input-field text-sm py-2" min="1" max="120" required />
                    </div>
                    <div>
                      <label class="text-xs text-dark-500 mb-1 block">Gender</label>
                      <select v-model="profile.gender" class="select-field text-sm py-2">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="text-xs text-dark-500 mb-1 block">Weight (kg)</label>
                      <input v-model.number="profile.weight" type="number" class="input-field text-sm py-2" min="1" max="300" step="0.1" required />
                    </div>
                    <div>
                      <label class="text-xs text-dark-500 mb-1 block">Height (cm)</label>
                      <input v-model.number="profile.height" type="number" class="input-field text-sm py-2" min="1" max="300" required />
                    </div>
                  </div>
                  <div>
                    <label class="text-xs text-dark-500 mb-1 block">Body Type</label>
                    <select v-model="profile.body_type" class="select-field text-sm py-2">
                      <option value="average">Average</option>
                      <option value="athletic">Athletic</option>
                      <option value="overweight">Overweight</option>
                      <option value="underweight">Underweight</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-xs text-dark-500 mb-1 block">Disease</label>
                    <select v-model="profile.disease" class="select-field text-sm py-2" required>
                      <option v-for="d in simStore.diseases" :key="d" :value="d">{{ d }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-xs text-dark-500 mb-1 block">Disease Stage</label>
                    <select v-model="profile.disease_stage" class="select-field text-sm py-2">
                      <option value="early">Early</option>
                      <option value="moderate">Moderate</option>
                      <option value="advanced">Advanced</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div class="flex items-center gap-4">
                    <label class="flex items-center gap-2 text-sm cursor-pointer">
                      <input v-model="profile.smoking" type="checkbox" class="w-4 h-4 rounded border-dark-600 bg-dark-800 text-medical-500 focus:ring-medical-500" />
                      <span class="text-dark-300">Smoking</span>
                    </label>
                    <label class="flex items-center gap-2 text-sm cursor-pointer">
                      <input v-model="profile.diabetes" type="checkbox" class="w-4 h-4 rounded border-dark-600 bg-dark-800 text-medical-500 focus:ring-medical-500" />
                      <span class="text-dark-300">Diabetes</span>
                    </label>
                  </div>
                  <button type="submit" class="btn-primary w-full text-sm flex items-center justify-center gap-2" :disabled="patientStore.loading">
                    <LoaderIcon v-if="patientStore.loading" class="w-4 h-4 animate-spin" />
                    <DnaIcon v-else class="w-4 h-4" />
                    {{ patientStore.loading ? 'Creating...' : 'Create Digital Twin' }}
                  </button>
                </form>
              </div>
              <div class="glass-panel p-5" :class="{ 'opacity-50 pointer-events-none': !patientStore.hasTwin }">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-6 h-6 rounded-full bg-medical-500 text-white text-xs flex items-center justify-center font-bold">2</div>
                  <h3 class="font-bold">Drug & Dose</h3>
                </div>
                <div class="space-y-3">
                  <div>
                    <label class="text-xs text-dark-500 mb-1 block">Drug</label>
                    <select v-model="simParams.drug" class="select-field text-sm py-2">
                      <option v-for="d in simStore.drugs" :key="d" :value="d">{{ d }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-xs text-dark-500 mb-1 block">Dosage Level</label>
                    <select v-model="simParams.dose" class="select-field text-sm py-2">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-xs text-dark-500 mb-1 block">Organ Focus</label>
                    <select v-model="simParams.organ_focus" class="select-field text-sm py-2">
                      <option value="">Auto-detect</option>
                      <option value="heart">Heart</option>
                      <option value="lungs">Lungs</option>
                      <option value="kidney">Kidney</option>
                      <option value="liver">Liver</option>
                      <option value="brain">Brain</option>
                    </select>
                  </div>
                  <button @click="runSimulation" class="btn-primary w-full text-sm flex items-center justify-center gap-2" :disabled="simStore.loading || !patientStore.hasTwin">
                    <LoaderIcon v-if="simStore.loading" class="w-4 h-4 animate-spin" />
                    <PlayIcon v-else class="w-4 h-4" />
                    {{ simStore.loading ? 'Simulating...' : 'Run Simulation' }}
                  </button>
                </div>
              </div>
              <div v-if="patientStore.currentTwin" class="glass-panel p-5">
                <h3 class="font-bold mb-4 flex items-center gap-2">
                  <ActivityIcon class="w-4 h-4 text-medical-400" />
                  Live Vitals
                </h3>
                <div class="space-y-3">
                  <VitalTile label="Heart Rate" :value="vitals.heart_rate" unit="bpm" :normal="[60, 100]" icon="Heart" />
                  <VitalTile label="Blood Pressure" :value="`${vitals.blood_pressure?.systolic || 120}/${vitals.blood_pressure?.diastolic || 80}`" unit="mmHg" :normal="[90, 140]" icon="Activity" />
                  <VitalTile label="Oxygen" :value="vitals.oxygen" unit="%" :normal="[95, 100]" icon="Wind" />
                  <VitalTile label="Glucose" :value="vitals.glucose" unit="mg/dL" :normal="[70, 140]" icon="Droplet" />
                </div>
              </div>
            </div>
            <!-- CENTER: Anatomy + Charts -->
            <div class="col-span-6 space-y-6">
              <div class="glass-panel p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="font-bold flex items-center gap-2">
                    <UserIcon class="w-5 h-5 text-medical-400" />
                    Digital Twin Anatomy
                  </h3>
                  <div class="flex items-center gap-4 text-xs">
                    <div class="flex items-center gap-1.5">
                      <div class="w-3 h-3 rounded-full bg-success-500"></div>
                      <span class="text-dark-500">Healthy</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <div class="w-3 h-3 rounded-full bg-warning-500"></div>
                      <span class="text-dark-500">At Risk</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <div class="w-3 h-3 rounded-full bg-danger-500"></div>
                      <span class="text-dark-500">Critical</span>
                    </div>
                  </div>
                </div>
               <HumanAnatomy
                  :organ-health="organHealth"
                  :selected-organ="selectedOrgan"
                  :body-type="profile.body_type"
                  :gender="profile.gender"
                  @select="selectedOrgan = $event"
                />
              </div>
              <div v-if="simStore.hasResult" class="glass-panel p-6">
                <h3 class="font-bold mb-4 flex items-center gap-2">
                  <TrendingDownIcon class="w-5 h-5 text-medical-400" />
                  Treatment Trajectory
                </h3>
                <TrajectoryChart :data="simStore.simulationResult.trajectory || []" />
              </div>
              <div v-if="patientStore.currentTwin" class="glass-panel p-6">
                <h3 class="font-bold mb-4">Organ Health Status</h3>
                <div class="space-y-3">
                  <OrganBar v-for="(value, organ) in organHealth" :key="organ" :name="organ" :value="value" :max="100" />
                </div>
              </div>
            </div>
            <!-- RIGHT: XAI + Results -->
            <div class="col-span-3 space-y-6">
              <div v-if="simStore.hasResult" class="glass-panel p-5">
                <h3 class="font-bold mb-4 flex items-center gap-2">
                  <FlaskConicalIcon class="w-5 h-5 text-medical-400" />
                  Simulation Result
                </h3>
                <div class="space-y-4">
                  <div class="p-4 rounded-xl" :class="resultCardClass">
                    <div class="flex items-center gap-2 mb-2">
                      <component :is="resultIcon" class="w-5 h-5" />
                      <span class="font-bold">{{ resultTitle }}</span>
                    </div>
                    <p class="text-sm">{{ simStore.simulationResult.warning }}</p>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="glass-panel-light p-3 text-center">
                      <div class="text-2xl font-bold" :class="toxicityColor">{{ simStore.simulationResult.toxicity }}</div>
                      <div class="text-xs text-dark-500">Toxicity</div>
                    </div>
                    <div class="glass-panel-light p-3 text-center">
                      <div class="text-2xl font-bold" :class="riskColor">{{ simStore.simulationResult.risk_level }}</div>
                      <div class="text-xs text-dark-500">Risk Level</div>
                    </div>
                  </div>
                  <div v-if="simStore.simulationResult.recommendation" class="p-3 bg-medical-500/10 border border-medical-500/20 rounded-xl">
                    <div class="text-xs text-medical-400 font-medium mb-1">Recommendation</div>
                    <div class="text-sm">{{ simStore.simulationResult.recommendation }}</div>
                  </div>
                </div>
              </div>
              <div v-if="simStore.hasXAI" class="glass-panel p-5">
                <h3 class="font-bold mb-4 flex items-center gap-2">
                  <BrainIcon class="w-5 h-5 text-warning-400" />
                  AI Explanation
                </h3>
                <div class="space-y-4">
                  <div class="p-3 bg-dark-800/50 rounded-xl text-sm leading-relaxed">
                    {{ simStore.xaiResult.explanation }}
                  </div>
                  <div>
                    <div class="text-xs text-dark-500 font-medium mb-2">Causal Reasoning</div>
                    <div class="space-y-2">
                      <div v-for="(reason, i) in simStore.xaiResult.causal_reasoning" :key="i" class="p-3 rounded-lg text-sm"
                        :class="reason.impact < 0 ? 'bg-danger-500/10 border border-danger-500/20' : 'bg-success-500/10 border border-success-500/20'">
                        <div class="flex items-center justify-between mb-1">
                          <span class="font-medium">{{ reason.factor }}</span>
                          <span class="text-xs font-mono" :class="reason.impact < 0 ? 'text-danger-400' : 'text-success-400'">
                            {{ reason.impact > 0 ? '+' : '' }}{{ (reason.impact * 100).toFixed(0) }}%
                          </span>
                        </div>
                        <div class="text-xs text-dark-500">{{ reason.description }}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="text-xs text-dark-500 font-medium mb-2">Risk Factors</div>
                    <div class="space-y-2">
                      <div v-for="(risk, i) in simStore.xaiResult.risk_factors" :key="i" class="flex items-center justify-between p-2 rounded-lg bg-dark-800/50">
                        <span class="text-sm">{{ risk.name }}</span>
                        <div class="flex items-center gap-2">
                          <div class="w-20 h-2 bg-dark-700 rounded-full overflow-hidden">
                            <div class="h-full rounded-full" :class="risk.probability > 0.5 ? 'bg-danger-500' : 'bg-warning-500'" :style="{ width: `${risk.probability * 100}%` }"></div>
                          </div>
                          <span class="text-xs font-mono w-10 text-right">{{ (risk.probability * 100).toFixed(0) }}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="!simStore.hasResult && !simStore.hasXAI" class="glass-panel p-8 text-center">
                <FlaskConicalIcon class="w-12 h-12 text-dark-600 mx-auto mb-4" />
                <p class="text-dark-500 text-sm">Run a simulation to see AI explanations and results</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, watch, ref } from 'vue'
import { usePatientStore } from '@/stores/patient'
import { useSimulationStore } from '@/stores/simulation'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import HumanAnatomy from '@/components/HumanAnatomy.vue'
import VitalTile from '@/components/VitalTile.vue'
import OrganBar from '@/components/OrganBar.vue'
import TrajectoryChart from '@/components/TrajectoryChart.vue'
import { DnaIcon, PlayIcon, LoaderIcon, RotateCcwIcon, UserIcon, ActivityIcon, TrendingDownIcon, FlaskConicalIcon, BrainIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-vue-next'

const patientStore = usePatientStore()
const simStore = useSimulationStore()

const profile = reactive({
  age: 67, gender: 'male', weight: 78, height: 175,
  body_type: 'average', disease: 'CKD', disease_stage: 'moderate',
  family_history: [], allergies: [], current_medications: [],
  smoking: false, diabetes: true,
})

const simParams = reactive({
  disease: 'CKD', drug: 'NSAID', dose: 'high',
  twin_id: null, age: 67, weight: 78,
  comorbidities: [], organ_focus: '',
})

const selectedOrgan = ref('')

onMounted(() => {
  simStore.fetchDrugs()
  simStore.fetchDiseases()
})

watch(() => profile.disease, (val) => { simParams.disease = val })
watch(() => patientStore.currentTwin, (twin) => {
  if (twin) {
    simParams.twin_id = twin.twin_id || twin.id
    simParams.age = twin.age || profile.age
    simParams.weight = twin.weight || profile.weight
  }
})

async function createTwin() {
  await patientStore.createTwin({ ...profile })
}

async function runSimulation() {
  simParams.disease = profile.disease
  simParams.comorbidities = []
  if (profile.diabetes) simParams.comorbidities.push('diabetes')
  if (profile.smoking) simParams.comorbidities.push('smoking')
  await simStore.runSimulation({ ...simParams })
  await simStore.getXAI({
    disease: simParams.disease, drug: simParams.drug,
    dose: simParams.dose, twin_id: simParams.twin_id,
  })
}

function clearAll() {
  patientStore.clearPatient()
  simStore.clearSimulation()
}

const organHealth = computed(() => {
  if (simStore.simulationResult?.organ_health) {
    const result = { ...simStore.simulationResult.organ_health }
    const defaults = { brain: 92, lungs: 90, heart: 85, liver: 88, stomach: 80, kidney: 60, spine: 95 }
    for (const [key, val] of Object.entries(defaults)) {
      if (result[key] === undefined) result[key] = val
    }
    return result
  }
  return patientStore.currentTwin?.organ_health || { brain: 92, lungs: 90, heart: 85, liver: 88, stomach: 80, kidney: 60, spine: 95 }
})

const vitals = computed(() => {
  if (simStore.simulationResult?.vitals) return simStore.simulationResult.vitals
  return patientStore.currentTwin?.vitals || { heart_rate: 72, blood_pressure: { systolic: 120, diastolic: 80 }, oxygen: 97, glucose: 95 }
})

const resultCardClass = computed(() => {
  const r = simStore.simulationResult
  if (!r) return ''
  if (r.risk_level === 'critical' || r.toxicity === 'high') return 'bg-danger-500/10 border border-danger-500/20 text-danger-200'
  if (r.risk_level === 'moderate' || r.toxicity === 'moderate') return 'bg-warning-500/10 border border-warning-500/20 text-warning-200'
  return 'bg-success-500/10 border border-success-500/20 text-success-200'
})

const resultTitle = computed(() => {
  const r = simStore.simulationResult
  if (!r) return ''
  if (r.risk_level === 'critical') return 'Critical Warning'
  if (r.risk_level === 'moderate') return 'Caution'
  return 'Treatment Safe'
})

const resultIcon = computed(() => {
  const r = simStore.simulationResult
  if (!r) return AlertTriangleIcon
  if (r.risk_level === 'critical') return AlertTriangleIcon
  if (r.risk_level === 'moderate') return AlertTriangleIcon
  return CheckCircleIcon
})

const toxicityColor = computed(() => {
  const t = simStore.simulationResult?.toxicity
  if (t === 'high') return 'text-danger-400'
  if (t === 'moderate') return 'text-warning-400'
  return 'text-success-400'
})

const riskColor = computed(() => {
  const r = simStore.simulationResult?.risk_level
  if (r === 'critical') return 'text-danger-400'
  if (r === 'moderate') return 'text-warning-400'
  return 'text-success-400'
})
</script>
