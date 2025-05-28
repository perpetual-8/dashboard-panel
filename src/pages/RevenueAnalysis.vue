<template>
  <div>
    <h2 class="mb-4">Dashboard</h2>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p class="mt-2">Loading dashboard data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      <i class="fas fa-exclamation-triangle"></i>
      {{ error }}
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Stat Cards -->
      <div class="row mb-4">
        <div class="col-md-6 col-lg-3">
          <StatCard title="Revenue Today" value="$1,234" trend="+12%" subtitle="vs Yesterday" />
        </div>
        <div class="col-md-6 col-lg-3">
          <StatCard title="Orders Today" value="56" trend="+8%" subtitle="vs Yesterday" />
        </div>
        <div class="col-md-6 col-lg-3">
          <StatCard title="Total Orders" value="1,234" trend="+12%" subtitle="vs Last Month" />
        </div>
        <div class="col-md-6 col-lg-3">
          <StatCard title="Total Sales" value="$78,910" trend="+10%" subtitle="vs Last Month" />
        </div>
      </div>

      <!-- Revenue Analysis -->
      <h5 class="mt-4 mb-3">Revenue Analysis</h5>
      <div class="row">
        <div class="col-md-6">
          <ChartComponent 
            title="Revenue by Category"
            subtitle="Monthly revenue comparison across categories"
            trend="+15%"
            :data="revenueData"
            analysis-type="revenue"
            chart-type="line"
            :height="350"
          />
        </div>
        <div class="col-md-6">
          <ChartComponent 
            title="Profit Analysis"
            subtitle="Monthly profit trends by category"
            trend="+8%"
            :data="revenueData"
            analysis-type="profit"
            chart-type="area"
            :height="350"
          />
        </div>
      </div>

      <!-- Order Analysis -->
      <h5 class="mt-4 mb-3">Order Analysis</h5>
      <div class="row">
        <div class="col-md-6">
          <ChartComponent 
            title="Orders by Category"
            subtitle="Monthly order volume across categories"
            trend="+12%"
            :data="revenueData"
            analysis-type="orders"
            chart-type="bar"
            :height="350"
          />
        </div>
        <div class="col-md-6">
          <ChartComponent 
            title="Expenses Overview"
            subtitle="Monthly expenses by category"
            trend="+5%"
            :data="revenueData"
            analysis-type="expenses"
            chart-type="line"
            :height="350"
          />
        </div>
      </div>

      <!-- Combined Analysis -->
      <div class="row mt-4">
        <div class="col-12">
          <ChartComponent 
            title="Complete Revenue Analysis"
            subtitle="Comprehensive view of revenue across all categories"
            trend="+18%"
            :data="revenueData"
            analysis-type="revenue"
            chart-type="area"
            :height="400"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StatCard from '../components/ui/StatCard.vue'
import ChartComponent from '../components/ui/LineChart.vue'

// Reactive revenue data
const revenueData = ref([])
const isLoading = ref(true)
const error = ref(null)
 const loadRevenueData = async () => {
  try {
    const response = await fetch('/data/revenue.json')
    if (!response.ok) throw new Error('Network response was not ok')
    revenueData.value = await response.json()
    isLoading.value = false
  } catch (err) {
    console.error('Error loading revenue data:', err)
    error.value = 'Failed to load revenue data'
    isLoading.value = false
  }
} 
onMounted(() => {
  loadRevenueData()
})
</script>

<style scoped>
.row {
  margin-left: -15px;
  margin-right: -15px;
}

.col-md-6, .col-lg-3, .col-12 {
  padding-left: 15px;
  padding-right: 15px;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.mt-4 {
  margin-top: 1.5rem;
}

h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
}

h5 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #444;
}

/* Loading and Alert Styles */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

.text-center {
  text-align: center;
}

.py-5 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.text-primary {
  color: #007bff;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.alert {
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
</style>