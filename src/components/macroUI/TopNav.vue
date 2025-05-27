<template>
  <nav class="navbar navbar-expand navbar-light bg-white border-bottom px-4">
    <ul class="navbar-nav">
      <li class="nav-item" v-for="item in items" :key="item">
        <a class="nav-link" href="#">{{ item }}</a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const items = [];
</script>
