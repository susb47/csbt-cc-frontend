<template>
  <div class="h-64">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps({
  data: { type: Array, default: () => [] },
})

const chartData = computed(() => ({
  labels: props.data.map((_, i) => `T${i + 1}`),
  datasets: [
    {
      label: 'Organ Health Trajectory',
      data: props.data,
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      borderWidth: 3,
      pointBackgroundColor: '#0ea5e9',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 8,
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Critical Threshold',
      data: props.data.map(() => 30),
      borderColor: '#ef4444',
      borderWidth: 2,
      borderDash: [6, 4],
      pointRadius: 0,
      fill: false,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, labels: { color: '#94a3b8', font: { family: 'Inter' } } },
    tooltip: {
      backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#cbd5e1',
      borderColor: '#334155', borderWidth: 1, padding: 12, cornerRadius: 8,
    },
  },
  scales: {
    x: { grid: { color: '#334155', drawBorder: false }, ticks: { color: '#64748b', font: { family: 'Inter' } } },
    y: { min: 0, max: 100, grid: { color: '#334155', drawBorder: false }, ticks: { color: '#64748b', font: { family: 'Inter' } } },
  },
  interaction: { intersect: false, mode: 'index' },
}
</script>
