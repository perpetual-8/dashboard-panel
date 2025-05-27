
 
<template>
  <header class="top-nav">
    <div class="nav-content">
      <!-- Mobile menu toggle -->
      <button 
        class="btn-menu-toggle d-md-none"
        @click="$emit('toggle-menu')"
        aria-label="Toggle navigation"
      >
        <i class="bi bi-list"></i>
      </button>

      <!-- Page title or breadcrumb -->
      <div class="nav-title">
        <h5 class="mb-0">{{ getPageTitle() }}</h5>
      </div>

      <!-- Right side items -->
      <div class="nav-actions">
        <!-- Notifications -->
        <button class="btn-nav-action" title="Notifications">
          <i class="bi bi-bell"></i>
        </button>
        
        <!-- User menu -->
        <div class="user-menu">
          <button class="btn-user" title="User menu">
            <i class="bi bi-person-circle"></i>
            <span class="d-none d-sm-inline ms-2">Admin</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Emits
defineEmits(['toggle-menu'])

const route = useRoute()

const getPageTitle = () => {
  const titles = {
    '/revenue': 'Revenue Analysis',
    '/inventory': 'Inventory Management',
    '/register': 'Register Product'
  }
  return titles[route.path] || 'Dashboard'
}
</script>

<style scoped lang="scss">
.top-nav {
  background-color: white;
  border-bottom: 1px solid #dee2e6;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1030;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  min-height: 60px;

  @include respond-below(sm) {
    padding: 0.5rem 0.75rem;
  }

  @include respond-between(sm, md) {
    padding: 0.75rem 1rem;
  }
}

.btn-menu-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  margin-right: 1rem;

  &:hover {
    color: #495057;
  }
}

.nav-title h5 {
  color: #495057;
  font-weight: 600;

  @include respond-below(sm) {
    font-size: 1rem;
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-nav-action {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
    color: #495057;
  }
}

.btn-user {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
    color: #495057;
  }
}
</style>
