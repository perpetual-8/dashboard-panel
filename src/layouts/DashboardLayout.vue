 
<template>
  <div class="admin-layout">
    
    <div 
      v-if="isMobileMenuOpen" 
      class="mobile-overlay"
      @click="closeMobileMenu"
    ></div>
    
   
    <Sidebar 
      :is-mobile-open="isMobileMenuOpen"
      @close="closeMobileMenu"
    />
    
     
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
import Sidebar from "../components/ui/SideBar.vue"
import TopNav from "../components/ui/TopNav.vue"

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

$spacing-sm: 0.75rem;   
$spacing-md: 1rem;     
$spacing-lg: 1.5rem;   

$z-overlay: 1040;

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
  padding: $spacing-md;
   
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  overflow-x: auto;

  @include respond-below(md) {
    padding: $spacing-sm;
  }

  @include respond-between(md, lg) {
    padding: $spacing-md;
  }

  @include respond-above(lg) {
    padding: $spacing-lg;
  }
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: $z-overlay;
  display: none;

  @include respond-below(md) {
    display: block;
  }
}
</style>

