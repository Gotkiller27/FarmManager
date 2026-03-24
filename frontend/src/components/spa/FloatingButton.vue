<template>
  <div class="floating-button-container" ref="floatingContainer">
    <router-link to="/login">
      <button
        class="floating-button"
        @click="goToMainApp"
        @mouseenter="onHover"
        @mouseleave="onLeave"
        ref="floatingButton"
      >
        <div class="button-content">
          <Rocket />
          <span class="button-text">Get Started</span>
        </div>
        <div class="button-glow"></div>
        <div class="button-pulse"></div>
      </button>
    </router-link>
    
    <!-- Tooltip -->
    <div class="tooltip" :class="{ 'tooltip-visible': showTooltip }" ref="tooltip">
      Accéder à l'application
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { Rocket } from 'lucide-vue-next'

const router = useRouter()
const floatingButton = ref(null)
const floatingContainer = ref(null)
const tooltip = ref(null)
const showTooltip = ref(false)

const goToMainApp = () => {
  // Animation au clic
  gsap.to(floatingButton.value, {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    ease: 'power2.inOut',
    onComplete: () => {
      // Rediriger vers la page de connexion
      router.push('/login')
    }
  })
}

const onHover = () => {
  showTooltip.value = true
  
  // Animation hover
  gsap.to(floatingButton.value, {
    scale: 1.1,
    rotation: 5,
    duration: 0.3,
    ease: 'power2.out'
  })
  
  gsap.to(floatingButton.value.querySelector('.button-glow'), {
    opacity: 1,
    scale: 1.5,
    duration: 0.3,
    ease: 'power2.out'
  })
}

const onLeave = () => {
  showTooltip.value = false
  
  // Animation leave
  gsap.to(floatingButton.value, {
    scale: 1,
    rotation: 0,
    duration: 0.3,
    ease: 'power2.out'
  })
  
  gsap.to(floatingButton.value.querySelector('.button-glow'), {
    opacity: 0.6,
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  })
}

onMounted(() => {
  // Animation d'entrée
  gsap.from(floatingContainer.value, {
    scale: 0,
    rotation: 360,
    duration: 1.5,
    ease: 'back.out(1.7)',
    delay: 2
  })
  
  // Animation de flottement continu
  gsap.to(floatingButton.value, {
    y: -10,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })
  
  // Animation de pulse
  gsap.to(floatingButton.value.querySelector('.button-pulse'), {
    scale: 1.5,
    opacity: 0,
    duration: 2,
    repeat: -1,
    ease: 'power2.out'
  })
  
  // Animation de rotation subtile
  gsap.to(floatingButton.value, {
    rotation: 5,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })
  
  // Tooltip animation
  gsap.set(tooltip.value, {
    opacity: 0,
    y: 10
  })
  
  gsap.to(tooltip.value, {
    opacity: 1,
    y: 0,
    duration: 0.3,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: tooltip.value,
      toggleActions: 'play none none reverse'
    }
  })
})
</script>

<style scoped>
.floating-button-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 999;
}

.floating-button {
  position: relative;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #48bb78, #38a169);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  overflow: visible;
}

.button-content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  gap: 0.25rem;
}

.button-content svg {
  width: 24px;
  height: 24px;
  animation: bounce 2s infinite;
}

.button-text {
  font-size: 0.7rem;
  font-weight: 600;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
}

.floating-button:hover .button-text {
  opacity: 1;
  transform: scale(1);
}

.floating-button:hover {
  width: 120px;
  height: 120px;
  border-radius: 60px;
}

.button-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0.6;
  z-index: 1;
  transition: all 0.3s ease;
}

.button-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #48bb78, #38a169);
  border-radius: 50%;
  opacity: 0.3;
  z-index: 0;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 1rem;
  background: #1a202c;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  right: 20px;
  border: 6px solid transparent;
  border-top-color: #1a202c;
}

.tooltip-visible {
  opacity: 1;
  transform: translateY(0);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
}

/* Effet de brillance au survol */
.floating-button::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  transform: rotate(45deg);
  transition: all 0.6s ease;
  opacity: 0;
}

.floating-button:hover::before {
  animation: shine 0.6s ease-in-out;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .floating-button-container {
    bottom: 1rem;
    right: 1rem;
  }
  
  .floating-button {
    width: 60px;
    height: 60px;
  }
  
  .floating-button:hover {
    width: 100px;
    height: 100px;
  }
  
  .button-content svg {
    width: 20px;
    height: 20px;
  }
  
  .button-text {
    font-size: 0.6rem;
  }
  
  .tooltip {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }
}

/* Animation d'entrée pour les appareils mobiles */
@media (max-width: 480px) {
  .floating-button-container {
    animation: mobileEntry 1s ease-out;
  }
  
  @keyframes mobileEntry {
    from {
      transform: scale(0) rotate(180deg);
      opacity: 0;
    }
    to {
      transform: scale(1) rotate(0);
      opacity: 1;
    }
  }
}
</style>
