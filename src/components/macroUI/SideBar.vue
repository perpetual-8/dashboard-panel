<template>
  <aside 
    class="sidebar"
    :class="{ 
      'sidebar-mobile-open': isMobileOpen,
      'sidebar-collapsed': isCollapsed 
    }"
  > 
    <div class="sidebar-header">
      <h4 class="sidebar-title" v-show="!isCollapsed">Commerce Admin</h4>
      <h4 class="sidebar-title-collapsed" v-show="isCollapsed">CA</h4>
       
      <button 
        class="btn-close-mobile d-md-none"
        @click="$emit('close')"
        aria-label="Close menu"
      >
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
 
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li v-for="item in navItems" :key="item.name" class="nav-item">
          <router-link 
            class="nav-link" 
            :to="item.route"
            @click="$emit('close')"
            :title="item.name"
          >
            <i :class="item.icon" class="nav-icon"></i>
            <span class="nav-text" v-show="!isCollapsed">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
 
    <button 
      class="btn-collapse d-none d-md-block"
      @click="toggleCollapse"
      :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
    >
      <i :class="isCollapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'"></i>
    </button>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
 
defineProps({
  isMobileOpen: {
    type: Boolean,
    default: false
  }
})
 
defineEmits(['close'])
 
const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
 
const navItems = [
  { name: "Revenue Analysis", route: "/revenue", icon: "bi bi-speedometer2" },
  { name: "Inventory Management", route: "/inventory", icon: "bi bi-box" },
  { name: "Register Product", route: "/register", icon: "bi bi-plus-circle" },
]
</script>

<style scoped lang="scss">
.sidebar {
  width: 240px;
  background-color: #fff;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: width 0.3s ease;
  z-index: 1050;

  @include respond-below(md) {
    position: fixed;
    top: 0;
    left: -240px;
    height: 100vh;
    transition: left 0.3s ease;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }

  @include respond-between(md, lg) {
    width: 200px;
  }
}

.sidebar-mobile-open {
  @include respond-below(md) {
    left: 0;
  }
}

.sidebar-collapsed {
  width: 70px;

  @include respond-between(md, lg) {
    width: 60px;
  }
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 70px;
}

.sidebar-title,
.sidebar-title-collapsed {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #495057;
}

.btn-close-mobile {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #6c757d;
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 0.375rem;
  margin: 0 0.5rem;

  &:hover {
    background-color: #f8f9fa;
    color: #495057;
  }

  &.router-link-active {
    background-color: #0d6efd;
    color: white;
  }
}

.nav-icon {
  font-size: 1.1rem;
  min-width: 20px;
  margin-right: 0.75rem;
}

.sidebar-collapsed .nav-icon {
  margin-right: 0;
}

.nav-text {
  font-weight: 500;
}

.btn-collapse {
  position: absolute;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  color: #6c757d;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
    color: #495057;
  }
}
</style>
