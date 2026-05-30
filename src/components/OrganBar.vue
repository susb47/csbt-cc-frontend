<template>
  <div class="flex items-center gap-3">
    <span class="w-20 text-sm text-dark-300 capitalize">{{ name }}</span>
    <div class="flex-1 h-3 bg-dark-800 rounded-full overflow-hidden">
      <div class="h-full rounded-full transition-all duration-700" :class="barColor" :style="{ width: `${Math.min(100, Math.max(0, value))}%` }"></div>
    </div>
    <span class="w-12 text-right text-sm font-mono" :class="textColor">{{ value }}%</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: String,
  value: { type: Number, default: 0 },
})

const barColor = computed(() => {
  if (props.value > 75) return 'bg-success-500'
  if (props.value > 50) return 'bg-warning-500'
  if (props.value > 25) return 'bg-orange-500'
  return 'bg-danger-500'
})

const textColor = computed(() => {
  if (props.value > 75) return 'text-success-400'
  if (props.value > 50) return 'text-warning-400'
  if (props.value > 25) return 'text-orange-400'
  return 'text-danger-400'
})
</script>
