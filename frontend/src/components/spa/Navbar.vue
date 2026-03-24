<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }" ref="navbar">
    <div class="container">
      <div class="navbar-brand">
        <div class="brand-logo" @click="goToHome">
          <Tractor />
          <span class="brand-text">FarmManager</span>
        </div>
      </div>
      
      <div class="navbar-menu" :class="{ 'menu-open': isMenuOpen }">
        <div class="nav-links">
          <router-link 
            to="/" 
            class="nav-link"
            :class="{ 'active': $route.path === '/' }"
            @click="closeMenu"
          >
            Accueil
          </router-link>
          <router-link 
            to="/about" 
            class="nav-link"
            :class="{ 'active': $route.path === '/about' }"
            @click="closeMenu"
          >
            À propos
          </router-link>
          <router-link 
            to="/contact" 
            class="nav-link"
            :class="{ 'active': $route.path === '/contact' }"
            @click="closeMenu"
          >
            Contact
          </router-link>
        </div>
        
        <button class="get-started-btn" @click="goToMainApp">
          Get Started
          <ArrowRight />
        </button>
      </div>
      
      <button class="mobile-menu-toggle" @click="toggleMenu" ref="menuToggle">
        <div class="hamburger" :class="{ 'active': isMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { Tractor, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const navbar = ref(null)
const menuToggle = ref(null)
const isScrolled = ref(false)
const isMenuOpen = ref(false)

const goToHome = () => {
  router.push('/')
}

const goToMainApp = () => {
  // Rediriger vers la page de connexion de l'application principale
  router.push('/login')
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  
  // Animate hamburger menu
  gsap.to(menuToggle.value, {
    rotation: isMenuOpen.value ? 90 : 0,
    duration: 0.3,
    ease: 'power2.inOut'
  })
}

const closeMenu = () => {
  isMenuOpen.value = false
  gsap.to(menuToggle.value, {
    rotation: 0,
    duration: 0.3,
    ease: 'power2.inOut'
  })
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  // Initial navbar animation
  gsap.from(navbar.value, {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border-bottom: 1px solid transparent;
}

.navbar-scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-bottom-color: rgba(102, 126, 234, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

.navbar-brand {
  flex-shrink: 0;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.brand-logo:hover {
  transform: scale(1.05);
}

.brand-logo svg {
  width: 40px;
  height: 40px;
  color: #48bb78;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #48bb78, #38a169);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  position: relative;
  color: #4a5568;
  font-weight: 600;
  text-decoration: none;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(135deg, #48bb78, #38a169);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #48bb78;
}

.nav-link:hover::after,
.nav-link.active::after {
  transform: scaleX(1);
}

.get-started-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.get-started-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.get-started-btn svg {
  transition: transform 0.3s ease;
}

.get-started-btn:hover svg {
  transform: translateX(3px);
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger {
  width: 24px;
  height: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  width: 100%;
  height: 2px;
  background: #4a5568;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .navbar-menu {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  .navbar-menu.menu-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-links {
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    text-align: center;
  }
  
  .nav-link {
    font-size: 1.1rem;
    padding: 1rem;
  }
  
  .get-started-btn {
    width: 100%;
    justify-content: center;
    padding: 1rem;
  }
  
  .mobile-menu-toggle {
    display: block;
  }
  
  .brand-text {
    font-size: 1.25rem;
  }
}
</style>
