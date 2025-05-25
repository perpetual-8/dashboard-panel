<template>
  <div class="card text-start shadow-sm">
    <div class="card-body">
      <h6 class="card-subtitle mb-2 text-muted">{{ title }}</h6>
      <h3>{{ value }}</h3>
      
    </div>
  </div>
</template>

<script setup>
defineProps(["title", "value", "trend"]);

</script>
