<template>
  <div class="card text-center shadow-sm">
    <div class="card-body">
      <h6 class="card-subtitle mb-2 text-muted">{{ title }}</h6>
      <h3>{{ value }}</h3>
      <small :class="trendClass">{{ trend }}</small>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const { trend } = defineProps(["title", "value", "trend"]);

const trendClass = computed(() =>
  trend.startsWith("+") ? "text-success" : "text-danger"
);
</script>
