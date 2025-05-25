<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <a class="navbar-brand" href="#">Admin Dashboard</a>
      <div class="navbar-nav">
        <router-link class="nav-link" to="/revenue">Revenue</router-link>
        <router-link class="nav-link" to="/inventory">Inventory</router-link>
        <router-link class="nav-link" to="/register">Add Product</router-link>
      </div>
    </nav>
    <main class="container py-4">
      <router-view />
    </main>
  </div>
</template>
