<!-- LineChart.vue -->
<template>
  <div class="card shadow-sm p-3">
    <h6 class="text-muted">{{ title }} <span :class="trendClass" class="float-end">{{ trend }}</span></h6>
    <apexchart type="line" height="150" :options="options" :series="series" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import ApexChart from 'vue3-apexcharts'
const props = defineProps(['title', 'trend'])

const options = {
  chart: { toolbar: { show: false } },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
  stroke: { curve: 'smooth' },
}

const series = [{ name: 'Data', data: [30, 50, 40, 60, 80, 70, 90] }]

const trendClass = computed(() =>
  props.trend.startsWith('+') ? 'text-success' : 'text-danger'
)
</script>
