<template>
  <div class="flex items-center gap-3 p-3 rounded-xl bg-dark-800/50">
    <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" :class="iconBgClass">
      <component :is="iconComponent" class="w-5 h-5" :class="iconColorClass" />
    </div>
    <div class="flex-1 min-w-0">
      <div class="text-xs text-dark-500">{{ label }}</div>
      <div class="flex items-baseline gap-1">
        <span class="text-lg font-bold font-mono" :class="valueColor">{{ displayValue }}</span>
        <span class="text-xs text-dark-500">{{ unit }}</span>
      </div>
    </div>
    <div class="shrink-0">
      <div class="w-2 h-2 rounded-full" :class="statusDotClass"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { HeartIcon, ActivityIcon, WindIcon, DropletIcon } from 'lucide-vue-next'

const props = defineProps({
  label: String,
  value: [String, Number],
  unit: String,
  normal: { type: Array, default: () => [0, 100] },
  icon: { type: String, default: 'Activity' },
})

const iconMap = { Heart: HeartIcon, Activity: ActivityIcon, Wind: WindIcon, Droplet: DropletIcon }
const iconComponent = computed(() => iconMap[props.icon] || ActivityIcon)

const numericValue = computed(() => {
  if (typeof props.value === 'number') return props.value
  const num = parseFloat(props.value)
  return isNaN(num) ? 0 : num
})

const isNormal = computed(() => numericValue.value >= props.normal[0] && numericValue.value <= props.normal[1])
const isWarning = computed(() => {
  const range = props.normal[1] - props.normal[0]
  return numericValue.value < props.normal[0] - range * 0.2 || numericValue.value > props.normal[1] + range * 0.2
})

const valueColor = computed(() => isWarning.value ? 'text-danger-400' : (!isNormal.value ? 'text-warning-400' : 'text-success-400'))
const iconBgClass = computed(() => isWarning.value ? 'bg-danger-500/10' : (!isNormal.value ? 'bg-warning-500/10' : 'bg-success-500/10'))
const iconColorClass = computed(() => isWarning.value ? 'text-danger-400' : (!isNormal.value ? 'text-warning-400' : 'text-success-400'))
const statusDotClass = computed(() => isWarning.value ? 'bg-danger-500 animate-pulse' : (!isNormal.value ? 'bg-warning-500' : 'bg-success-500'))
const displayValue = computed(() => (typeof props.value === 'string' && props.value.includes('/')) ? props.value : numericValue.value)
</script>
