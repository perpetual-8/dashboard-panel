<template>
  <div>
    <h2>Revenue Analysis</h2>
    <ul>
      <li v-for="entry in revenue" :key="entry.date">
        {{ entry.date }} — {{ entry.orders }} orders — ${{ entry.sales }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRevenue } from '../services/dataService'

const revenue = ref([])

onMounted(async () => {
  revenue.value = await getRevenue()
})
</script>
