<script setup>
const navItems = [
  { name: 'Dashboard', route: '/revenue', icon: 'bi bi-speedometer2' },
  { name: 'Products', route: '/inventory', icon: 'bi bi-box' },
  { name: 'Add Product', route: '/register', icon: 'bi bi-plus-circle' }
]
</script>


<template>
  <div class="d-flex flex-column p-3 bg-light min-vh-100" style="width: 240px;">
    <h4 class="mb-4">Commerce Admin</h4>
    <ul class="nav nav-pills flex-column">
      <li class="nav-item" v-for="item in navItems" :key="item.name">
        <router-link class="nav-link" :to="item.route">
          <i :class="item.icon" class="me-2"></i>{{ item.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

