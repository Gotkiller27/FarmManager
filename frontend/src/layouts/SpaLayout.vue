<template>
  <div class="spa-layout">
    <!-- Loader -->
    <div v-if="showLoader" class="loader-container" ref="loaderContainer">
      <div class="loader-content">
        <div class="loader-logo">
          <Tractor />
        </div>
        <div class="loader-text">
          <span class="letter" v-for="(letter, index) in 'FarmManager'" :key="index" :ref="`letter${index}`">
            {{ letter }}
          </span>
        </div>
        <div class="loader-progress">
          <div class="progress-bar" ref="progressBar"></div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <Navbar v-if="!showLoader" />
    
    <!-- Main Content -->
    <main class="main-content" :class="{ 'content-loaded': !showLoader }">
      <router-view v-slot="{ Component }">
        <transition name="page-transition" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Toast Notifications -->
    <Toast />
    
    <!-- Floating Button -->
    <FloatingButton v-if="!showLoader" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import Navbar from '../components/spa/Navbar.vue'
import FloatingButton from '../components/spa/FloatingButton.vue'
import Toast from '../components/Toast.vue'
import { Tractor } from 'lucide-vue-next'

const showLoader = ref(true)
const loaderContainer = ref(null)
const progressBar = ref(null)

onMounted(() => {
  // Loader animation
  const tl = gsap.timeline()
  
  // Animate letters
  const letters = document.querySelectorAll('.letter')
  tl.from(letters, {
    y: 100,
    opacity: 0,
    duration: 0.5,
    stagger: 0.05,
    ease: 'power3.out'
  })
  
  // Animate logo
  tl.from('.loader-logo', {
    scale: 0,
    rotation: -360,
    duration: 1,
    ease: 'back.out(1.7)'
  }, '-=0.5')
  
  // Animate progress bar
  tl.from(progressBar.value, {
    scaleX: 0,
    duration: 1.5,
    ease: 'power2.out'
  }, '-=0.3')
  
  // Complete loader
  tl.to(loaderContainer.value, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.in',
    onComplete: () => {
      showLoader.value = false
    }
  }, '+=0.5')
})
</script>

<style scoped>
.spa-layout {
  min-height: 100vh;
  background: #f7fafc;
}

.loader-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.loader-content {
  text-align: center;
  color: white;
}

.loader-logo {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
}

.loader-logo svg {
  width: 40px;
  height: 40px;
  color: white;
}

.loader-text {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  gap: 0.1rem;
}

.letter {
  display: inline-block;
  opacity: 0;
}

.loader-progress {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin: 0 auto;
}

.progress-bar {
  height: 100%;
  background: white;
  border-radius: 2px;
  transform-origin: left;
}

.main-content {
  padding-top: 80px; /* Height of navbar */
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.content-loaded {
  opacity: 1;
  transform: translateY(0);
}

/* Page transitions */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.5s ease;
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Responsive */
@media (max-width: 768px) {
  .loader-text {
    font-size: 1.5rem;
  }
  
  .loader-logo {
    width: 60px;
    height: 60px;
  }
  
  .loader-logo svg {
    width: 30px;
    height: 30px;
  }
  
  .loader-progress {
    width: 150px;
  }
  
  .main-content {
    padding-top: 70px; /* Adjusted for mobile navbar */
  }
}
</style>
