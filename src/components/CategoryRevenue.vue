<template>
  <div class="mt-5">
    <h5>Category Revenue</h5>

    <div class="mb-3 d-flex flex-wrap gap-2">
      <select class="form-select w-auto" v-model="selectedCategory">
        <option value="All">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <div class="row g-3">
      <!-- Revenue by Category -->
      <div class="col-md-6">
        <div class="card p-3">
          <h6>Revenue by Category</h6>
          <p class="text-success fw-semibold mb-2">+15%</p>
          <small class="text-muted mb-3 d-block">This Month <span class="text-success">+15%</span></small>
          <Bar :data="revenueData" :options="chartOptions" height="120" />
        </div>
      </div>

      <!-- Category Performance -->
      <div class="col-md-6">
        <div class="card p-3">
          <h6>Category Performance</h6>
          <p class="text-danger fw-semibold mb-2">-3%</p>
          <small class="text-muted mb-3 d-block">This Month <span class="text-danger">-3%</span></small>
          <Bar :data="performanceData" :options="chartOptions" height="120" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const categories = ['Electronics', 'Clothing', 'Accessories']
const selectedCategory = ref('All')

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: {
      ticks: { font: { size: 12 } }
    },
    y: {
      beginAtZero: true,
      ticks: { stepSize: 20 }
    }
  }
}

// Dummy Data - could be filtered later
const revenueData = computed(() => ({
  labels: ['Electronics', 'Clothing', 'Accessories'],
  datasets: [
    {
      label: 'Revenue',
      data: [70, 40, 65],
      backgroundColor: '#dce8f2',
      borderColor: '#6c757d',
      borderWidth: 1
    }
  ]
}))

const performanceData = computed(() => ({
  labels: ['Electronics', 'Clothing', 'Accessories'],
  datasets: [
    {
      label: 'Performance',
      data: [30, 10, 50],
      backgroundColor: '#dce8f2',
      borderColor: '#6c757d',
      borderWidth: 1
    } 
  ]
}))
</script>
