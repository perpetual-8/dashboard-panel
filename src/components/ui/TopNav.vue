<template>
  <header class="top-nav">
    <div class="nav-content">
    
      <button
        class="btn-menu-toggle d-md-none"
        @click="$emit('toggle-menu')"
        aria-label="Toggle navigation"
      >
        <i class="bi bi-list"></i>
      </button>
 
      <div class="nav-title">
        <h5 class="mb-0">{{ getPageTitle() }}</h5>
      </div>
 
      <div class="nav-actions">
       
       
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

// Emits
defineEmits(["toggle-menu"]);

const route = useRoute();

const getPageTitle = () => {
  const titles = {
    "/revenue": "Revenue Analysis",
    "/inventory": "Inventory Management",
    "/register": "Register Product",
  };
  return titles[route.path] || "Dashboard";
};
</script>
<style scoped lang="scss">
$font-size-base: 1.25rem; //di
$font-size-title: 1.25rem; // di
$font-weight-title: 600; //di

$spacing-y-sm: 0.5rem; // di
$spacing-y-md: 0.75rem; //di
$spacing-x-sm: 0.75rem; //di
$spacing-x-md: 1rem; // di

$min-height-nav: 60px; //di

.top-nav {
  background-color: $color-bg;
  border-bottom: 1px solid $color-border;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1030;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-y-md $spacing-x-md;
  min-height: $min-height-nav;

  @include respond-below(sm) {
    padding: $spacing-y-sm $spacing-x-sm;
  }

  @include respond-between(sm, md) {
    padding: $spacing-y-md $spacing-x-md;
  }
}

.btn-menu-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: $text-muted;
  cursor: pointer;
  padding: 0.25rem;
  margin-right: 1rem;

  &:hover {
    color: $text-color;
  }
}

.nav-title h5 {
  color: $text-color;
  font-weight: $font-weight-title;

  @include respond-below(sm) {
    font-size: 1rem;
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-nav-action,
.btn-user {
  background: none;
  border: none;
  color: $text-muted;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: $radius;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  font-size: $font-size-base;

  &:hover {
    background-color: $color-hover-bg;
    color: $text-color;
  }
}

.btn-user {
  span {
    margin-left: 0.5rem;
  }
}
</style>
