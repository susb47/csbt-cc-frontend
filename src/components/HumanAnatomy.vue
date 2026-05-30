<template>
  <div class="relative w-full max-w-sm mx-auto select-none">
    <svg
      viewBox="0 0 240 480"
      class="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
      @click="selectedOrgan = ''"
    >
      <!-- Background body shape -->
      <path
        :d="bodyPath"
        fill="none"
        stroke="#334155"
        stroke-width="1.5"
        opacity="0.4"
      />

      <!-- Brain -->
      <g
        class="cursor-pointer transition-all duration-300"
        :class="organClass('brain')"
        @click.stop="selectOrgan('brain')"
      >
        <ellipse
          cx="120"
          :cy="brainY"
          rx="18"
          ry="14"
          :fill="organFill('brain')"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <text
          :x="120"
          :y="brainY + 4"
          text-anchor="middle"
          fill="white"
          font-size="8"
          font-weight="600"
          font-family="Inter, sans-serif"
          class="pointer-events-none"
        >Brain</text>
      </g>

      <!-- Lungs -->
      <g
        class="cursor-pointer transition-all duration-300"
        :class="organClass('lungs')"
        @click.stop="selectOrgan('lungs')"
      >
        <ellipse
          cx="102"
          :cy="lungY"
          rx="14"
          ry="18"
          :fill="organFill('lungs')"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <ellipse
          cx="138"
          :cy="lungY"
          rx="14"
          ry="18"
          :fill="organFill('lungs')"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <text
          :x="120"
          :y="lungY + 3"
          text-anchor="middle"
          fill="white"
          font-size="8"
          font-weight="600"
          font-family="Inter, sans-serif"
          class="pointer-events-none"
        >Lungs</text>
      </g>

      <!-- Heart -->
      <g
        class="cursor-pointer transition-all duration-300"
        :class="organClass('heart')"
        @click.stop="selectOrgan('heart')"
      >
        <path
          :d="heartPath"
          :fill="organFill('heart')"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <text
          :x="120"
          :y="heartY + 3"
          text-anchor="middle"
          fill="white"
          font-size="8"
          font-weight="600"
          font-family="Inter, sans-serif"
          class="pointer-events-none"
        >Heart</text>
      </g>

      <!-- Liver -->
      <g
        class="cursor-pointer transition-all duration-300"
        :class="organClass('liver')"
        @click.stop="selectOrgan('liver')"
      >
        <path
          :d="liverPath"
          :fill="organFill('liver')"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <text
          :x="120"
          :y="liverY + 3"
          text-anchor="middle"
          fill="white"
          font-size="8"
          font-weight="600"
          font-family="Inter, sans-serif"
          class="pointer-events-none"
        >Liver</text>
      </g>

      <!-- Stomach -->
      <g
        class="cursor-pointer transition-all duration-300"
        :class="organClass('stomach')"
        @click.stop="selectOrgan('stomach')"
      >
        <ellipse
          cx="120"
          :cy="stomachY"
          rx="16"
          ry="12"
          :fill="organFill('stomach')"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <text
          :x="120"
          :y="stomachY + 3"
          text-anchor="middle"
          fill="white"
          font-size="8"
          font-weight="600"
          font-family="Inter, sans-serif"
          class="pointer-events-none"
        >Stomach</text>
      </g>

      <!-- Kidneys -->
      <g
        class="cursor-pointer transition-all duration-300"
        :class="organClass('kidney')"
        @click.stop="selectOrgan('kidney')"
      >
        <ellipse
          cx="108"
          :cy="kidneyY"
          rx="9"
          ry="12"
          :fill="organFill('kidney')"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <ellipse
          cx="132"
          :cy="kidneyY"
          rx="9"
          ry="12"
          :fill="organFill('kidney')"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <text
          :x="120"
          :y="kidneyY + 3"
          text-anchor="middle"
          fill="white"
          font-size="8"
          font-weight="600"
          font-family="Inter, sans-serif"
          class="pointer-events-none"
        >Kidneys</text>
      </g>

      <!-- Spine -->
      <g
        class="cursor-pointer transition-all duration-300"
        :class="organClass('spine')"
        @click.stop="selectOrgan('spine')"
      >
        <line
          x1="120"
          :y1="spineTop"
          x2="120"
          :y2="spineBottom"
          stroke="#475569"
          stroke-width="2"
          stroke-linecap="round"
        />
        <text
          :x="120"
          :y="spineTop + (spineBottom - spineTop) / 2"
          text-anchor="middle"
          fill="#64748b"
          font-size="7"
          font-weight="500"
          font-family="Inter, sans-serif"
          class="pointer-events-none"
        >Spine</text>
      </g>
    </svg>

    <!-- Selected organ info overlay -->
    <div
      v-if="selectedOrgan"
      class="absolute bottom-2 left-2 right-2 glass-panel-light p-3 text-center animate-fade-in"
    >
      <div class="text-sm font-bold capitalize">{{ selectedOrgan }}</div>
      <div class="text-xs text-dark-500">
        Health: <span class="font-mono font-bold" :class="healthTextClass">{{ organHealth[selectedOrgan] ?? 'N/A' }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  organHealth: { type: Object, default: () => ({}) },
  bodyType: { type: String, default: 'average' },
  gender: { type: String, default: 'male' },
})

const emit = defineEmits(['select'])
const selectedOrgan = ref('')

const base = {
  male: {
    shoulderW: 70, chestW: 60, waistW: 50, hipW: 52,
    shoulderY: 75, chestY: 105, waistY: 155, hipY: 195,
    legW: 22, legGap: 14, legLen: 140,
    headR: 22, neckH: 12,
  },
  female: {
    shoulderW: 62, chestW: 58, waistW: 42, hipW: 62,
    shoulderY: 75, chestY: 105, waistY: 155, hipY: 200,
    legW: 20, legGap: 18, legLen: 135,
    headR: 20, neckH: 10,
  },
}

const bodyMultipliers = {
  slim: { shoulder: 0.9, chest: 0.85, waist: 0.85, hip: 0.9, leg: 0.9 },
  average: { shoulder: 1.0, chest: 1.0, waist: 1.0, hip: 1.0, leg: 1.0 },
  athletic: { shoulder: 1.15, chest: 1.1, waist: 0.95, hip: 1.0, leg: 1.05 },
  overweight: { shoulder: 1.2, chest: 1.25, waist: 1.3, hip: 1.25, leg: 1.15 },
}

const dims = computed(() => {
  const g = base[props.gender]
  const m = bodyMultipliers[props.bodyType]
  return {
    shoulderW: g.shoulderW * m.shoulder,
    chestW: g.chestW * m.chest,
    waistW: g.waistW * m.waist,
    hipW: g.hipW * m.hip,
    shoulderY: g.shoulderY, chestY: g.chestY, waistY: g.waistY, hipY: g.hipY,
    legW: g.legW * m.leg, legGap: g.legGap, legLen: g.legLen,
    headR: g.headR, neckH: g.neckH,
    centerX: 120, topY: 30,
  }
})

// Sparse, non-overlapping Y positions
const brainY = computed(() => dims.value.topY + 10)
const lungY = computed(() => dims.value.chestY - 5)
const heartY = computed(() => dims.value.chestY + 22)
const liverY = computed(() => dims.value.waistY - 18)
const stomachY = computed(() => dims.value.waistY + 8)
const kidneyY = computed(() => dims.value.waistY + 32)
const spineTop = computed(() => dims.value.shoulderY - 10)
const spineBottom = computed(() => dims.value.hipY + 20)

const bodyPath = computed(() => {
  const d = dims.value
  const cx = d.centerX
  const ht = d.topY
  const hb = ht + d.headR * 2 + d.neckH
  const st = d.shoulderY - 8
  const sb = d.shoulderY + 8
  const aw = 14
  const al = 95
  const hbot = d.hipY + 15
  const lt = hbot
  const lb = lt + d.legLen

  let p = `M ${cx} ${ht}`
  p += ` C ${cx+d.headR} ${ht}, ${cx+d.headR} ${ht+d.headR*2}, ${cx} ${ht+d.headR*2}`
  p += ` C ${cx-d.headR} ${ht+d.headR*2}, ${cx-d.headR} ${ht}, ${cx} ${ht}`
  p += ` M ${cx-8} ${ht+d.headR*2} L ${cx-10} ${hb} L ${cx+10} ${hb} L ${cx+8} ${ht+d.headR*2}`
  p += ` M ${cx-10} ${hb} L ${cx-d.shoulderW/2} ${st}`
  p += ` L ${cx-d.shoulderW/2-aw} ${sb} L ${cx-d.shoulderW/2-aw} ${sb+al}`
  p += ` L ${cx-d.shoulderW/2} ${sb+al+5} L ${cx-d.chestW/2} ${d.chestY+20}`
  p += ` L ${cx-d.waistW/2} ${d.waistY} L ${cx-d.hipW/2} ${d.hipY}`
  p += ` L ${cx-d.legGap/2-d.legW} ${lt} L ${cx-d.legGap/2-d.legW} ${lb}`
  p += ` L ${cx-d.legGap/2} ${lb+5} L ${cx-d.legGap/2} ${lt}`
  p += ` L ${cx} ${lt+10}`
  p += ` L ${cx+d.legGap/2} ${lt} L ${cx+d.legGap/2} ${lb+5}`
  p += ` L ${cx+d.legGap/2+d.legW} ${lb} L ${cx+d.legGap/2+d.legW} ${lt}`
  p += ` L ${cx+d.hipW/2} ${d.hipY} L ${cx+d.waistW/2} ${d.waistY}`
  p += ` L ${cx+d.chestW/2} ${d.chestY+20}`
  p += ` L ${cx+d.shoulderW/2} ${sb+al+5} L ${cx+d.shoulderW/2+aw} ${sb+al}`
  p += ` L ${cx+d.shoulderW/2+aw} ${sb} L ${cx+d.shoulderW/2} ${st}`
  p += ` L ${cx+10} ${hb}`
  return p
})

const heartPath = computed(() => {
  const y = heartY.value
  const cx = 120
  const s = props.bodyType === 'overweight' ? 1.15 : props.bodyType === 'slim' ? 0.9 : 1.0
  return `M ${cx} ${y+8*s} C ${cx-8*s} ${y-6*s}, ${cx-14*s} ${y-2*s}, ${cx-14*s} ${y+4*s} C ${cx-14*s} ${y+10*s}, ${cx-6*s} ${y+14*s}, ${cx} ${y+18*s} C ${cx+6*s} ${y+14*s}, ${cx+14*s} ${y+10*s}, ${cx+14*s} ${y+4*s} C ${cx+14*s} ${y-2*s}, ${cx+8*s} ${y-6*s}, ${cx} ${y+8*s}Z`
})

const liverPath = computed(() => {
  const y = liverY.value
  const cx = 120
  const w = props.bodyType === 'overweight' ? 22 : props.bodyType === 'slim' ? 16 : 19
  const h = 14
  return `M ${cx-w} ${y-h/2} Q ${cx-w/2} ${y-h}, ${cx} ${y-h/2} Q ${cx+w/2} ${y}, ${cx+w} ${y+h/2} Q ${cx+w/3} ${y+h}, ${cx} ${y+h/2} Q ${cx-w/2} ${y+h/3}, ${cx-w} ${y-h/2}Z`
})

function selectOrgan(organ) {
  selectedOrgan.value = organ
  emit('select', organ)
}

function organFill(organ) {
  const h = props.organHealth[organ] ?? 80
  if (h > 75) return '#22c55e'
  if (h > 50) return '#f59e0b'
  if (h > 25) return '#f97316'
  return '#ef4444'
}

function organClass(organ) {
  const h = props.organHealth[organ] ?? 80
  const sel = selectedOrgan.value === organ
  const base = 'hover:opacity-90'
  if (sel) return `${base} opacity-100 drop-shadow-[0_0_8px_rgba(14,165,233,0.6)]`
  if (h < 40) return `${base} animate-pulse`
  return base
}

const healthTextClass = computed(() => {
  const h = props.organHealth[selectedOrgan.value] ?? 80
  if (h > 75) return 'text-success-400'
  if (h > 50) return 'text-warning-400'
  if (h > 25) return 'text-orange-400'
  return 'text-danger-400'
})
</script>