<template>
  <div class="h-80">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps({
  history: { type: Array, default: () => [] },
})

const chartData = computed(() => ({
  labels: props.history.map((h) => `R${h.round}`),
  datasets: [
    {
      label: 'Global Accuracy',
      data: props.history.map((h) => (h.global_accuracy * 100).toFixed(1)),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderWidth: 3,
      pointBackgroundColor: '#22c55e',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      tension: 0.3,
      yAxisID: 'y',
    },
    {
      label: 'Loss',
      data: props.history.map((h) => (h.loss * 100).toFixed(1)),
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.3,
      yAxisID: 'y1',
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } },
    tooltip: {
      backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#cbd5e1',
      borderColor: '#334155', borderWidth: 1, padding: 12, cornerRadius: 8,
    },
  },
  scales: {
    x: { grid: { color: '#334155', drawBorder: false }, ticks: { color: '#64748b', font: { family: 'Inter' } } },
    y: {
      type: 'linear', display: true, position: 'left', min: 50, max: 100,
      grid: { color: '#334155', drawBorder: false },
      ticks: { color: '#64748b', font: { family: 'Inter' } },
      title: { display: true, text: 'Accuracy (%)', color: '#64748b' },
    },
    y1: {
      type: 'linear', display: true, position: 'right', min: 0, max: 50,
      grid: { drawOnChartArea: false },
      ticks: { color: '#64748b', font: { family: 'Inter' } },
      title: { display: true, text: 'Loss', color: '#64748b' },
    },
  },
}
</script>
