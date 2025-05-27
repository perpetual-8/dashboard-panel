 
<template>
  <div class="admin-layout">
    <!-- Mobile overlay for sidebar -->
    <div 
      v-if="isMobileMenuOpen" 
      class="mobile-overlay"
      @click="closeMobileMenu"
    ></div>
    
    <!-- Sidebar -->
    <Sidebar 
      :is-mobile-open="isMobileMenuOpen"
      @close="closeMobileMenu"
    />
    
    <!-- Main content area -->
    <div class="main-content" :class="{ 'sidebar-open': isMobileMenuOpen }">
      <TopNav @toggle-menu="toggleMobileMenu" />
      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from "../components/macroUI/SideBar.vue"
import TopNav from "../components/macroUI/TopNav.vue"

// Mobile menu state
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Close mobile menu on window resize to desktop
const handleResize = () => {
  if (window.innerWidth >= 768 && isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

 <style scoped lang="scss">
.admin-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;  
  transition: margin-left 0.3s ease;
}

.content-area {
  flex: 1;
  padding: 1rem;
  background-color: #f8f9fa;
  overflow-x: auto;

  @include respond-below(md) {
    padding: 0.75rem;
  }

  @include respond-between(md, lg) {
    padding: 1rem;
  }

  @include respond-above(lg) {
    padding: 1.5rem;
  }
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
  display: none;

  @include respond-below(md) {
    display: block;
  }
}
</style>
