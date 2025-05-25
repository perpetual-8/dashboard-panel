<template>
  <div class="card shadow-sm p-3">
    <h6 class="text-muted">
      {{ title }}
      <span :class="trendClass" class="float-end">{{ trend }}</span>
    </h6>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

import { Line } from 'vue-chartjs'

// Register chart components globally
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const props = defineProps(['title', 'trend'])

const trendClass = computed(() =>
  props.trend.startsWith('+') ? 'text-success' : 'text-danger'
)

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Data',
      data: [30, 50, 40, 60, 80, 70, 90],
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: {
      title: { display: true, text: 'Month' }
    },
    y: {
      title: { display: true, text: 'Sales' },
      beginAtZero: true
    }
  }
}
</script>
