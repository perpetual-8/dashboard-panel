<template>
  <div>
    <h2 class="mb-4">Revenue Analysis</h2>
    <div class="row mb-4">
      <div class="col-md-6 col-lg-3">
        <StatCard title="Total Orders" value="1,234" trend="+12%" />
      </div>
      <div class="col-md-6 col-lg-3">
        <StatCard title="Total Sales" value="$56,789" trend="+8%" />
      </div>
    </div>

    <h5 class="mt-4 mb-2">Revenue Trends</h5>
    <div class="row">
      <div class="col-md-4">
        <LineChart title="Orders" trend="+12%" />
      </div>
      <div class="col-md-4">
        <LineChart title="Sales" trend="+8%" />
      </div>
      <div class="col-md-4">
        <LineChart title="Inventory" trend="-5%" />
      </div>
    </div>
  </div>
</template>

<script setup>
import StatCard from '../components/StatCard.vue'
import LineChart from '../components/charts/LineChart.vue'
</script>
