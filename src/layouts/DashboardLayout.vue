<template>
  <div class="d-flex">
    <Sidebar />
    <div class="flex-grow-1">
      <!-- <TopNav /> -->
      <main class="container-fluid py-4 px-4">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
// import TopNav from '../components/TopNav.vue'
</script>
