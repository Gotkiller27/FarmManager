<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero-section" ref="heroSection">
      <div class="hero-background">
        <div class="floating-elements">
          <div class="floating-element element-1" ref="element1"></div>
          <div class="floating-element element-2" ref="element2"></div>
          <div class="floating-element element-3" ref="element3"></div>
          <div class="floating-element element-4" ref="element4"></div>
        </div>
      </div>
      
      <div class="hero-content">
        <div class="hero-text" ref="heroText">
          <h1 class="hero-title">
            <span class="title-line" ref="titleLine1">FarmManager</span>
            <span class="title-line" ref="titleLine2">La Gestion Agricole</span>
            <span class="title-line" ref="titleLine3">Intelligente</span>
          </h1>
          <p class="hero-subtitle" ref="heroSubtitle">
            Optimisez votre exploitation agricole avec notre solution de gestion moderne et intuitive
          </p>
          <div class="hero-cta" ref="heroCta">
            <button class="cta-button primary" @click="scrollToFeatures">
              Découvrir
              <ArrowRight class="arrow-icon" />
            </button>
          </div>
        </div>
        
        <div class="hero-visual" ref="heroVisual">
          <div class="farm-illustration">
            <div class="farm-card" ref="farmCard">
              <div class="card-header">
                <div class="card-icon">
                  <Tractor />
                </div>
                <div class="card-title">Dashboard</div>
              </div>
              <div class="card-content">
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-value">2,847</div>
                    <div class="stat-label">Hectares</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">12</div>
                    <div class="stat-label">Cultures</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">98%</div>
                    <div class="stat-label">Efficacité</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Infinite Scroll Section -->
    <section class="py-16 bg-gradient-to-br from-green-500 to-green-700 overflow-hidden relative border-t-4 border-white/20 border-b-4" ref="infiniteSection">
      <div class="absolute inset-0 bg-white/10 z-10"></div>
      <div class="relative z-20 w-full overflow-hidden">
        <div class="flex items-center gap-8 h-80 w-fit" ref="scrollContent">
          <div class="info-card flex-shrink-0 bg-white/95 backdrop-blur-lg rounded-3xl p-8 min-w-[350px] max-w-[400px] shadow-2xl transition-all duration-300 border-2 border-white/20 flex flex-col items-center text-center hover:transform hover:-translate-y-1 hover:scale-105 hover:shadow-3xl hover:border-white/40" v-for="(info, index) in infiniteCards" :key="index">
            <div class="w-32 h-32 rounded-2xl overflow-hidden mb-6 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600" v-if="info.image">
              <img :src="info.image" :alt="info.title" class="w-full h-full object-cover" />
            </div>
            <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white mb-6 text-3xl" v-else>
              <component :is="info.icon" />
            </div>
            <div class="flex-1 flex flex-col justify-center">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ info.title }}</h3>
              <p class="text-2xl font-bold text-green-600 mb-2">{{ info.value }}</p>
              <p class="text-gray-600 leading-relaxed">{{ info.description }}</p>
            </div>
          </div>
          <!-- Duplication pour l'effet infini -->
          <div class="info-card flex-shrink-0 bg-white/95 backdrop-blur-lg rounded-3xl p-8 min-w-[350px] max-w-[400px] shadow-2xl transition-all duration-300 border-2 border-white/20 flex flex-col items-center text-center hover:transform hover:-translate-y-1 hover:scale-105 hover:shadow-3xl hover:border-white/40" v-for="(info, index) in infiniteCards" :key="`duplicate-${index}`">
            <div class="w-32 h-32 rounded-2xl overflow-hidden mb-6 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600" v-if="info.image">
              <img :src="info.image" :alt="info.title" class="w-full h-full object-cover" />
            </div>
            <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white mb-6 text-3xl" v-else>
              <component :is="info.icon" />
            </div>
            <div class="flex-1 flex flex-col justify-center">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ info.title }}</h3>
              <p class="text-2xl font-bold text-green-600 mb-2">{{ info.value }}</p>
              <p class="text-gray-600 leading-relaxed">{{ info.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section" ref="featuresSection">
      <div class="container">
        <div class="section-header" ref="sectionHeader">
          <h2 class="section-title">Fonctionnalités Principales</h2>
          <p class="section-subtitle">Tout ce dont vous avez besoin pour gérer votre exploitation</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card" v-for="(feature, index) in features" :key="index" :ref="`feature${index}`">
            <div class="feature-icon">
              <component :is="feature.icon" />
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section" ref="statsSection">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card" v-for="(stat, index) in stats" :key="index" :ref="`stat${index}`">
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Tractor, Sprout, BarChart3, Users, Globe, Shield, Zap, Database, TrendingUp, Droplets, Sun, Wind } from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'

gsap.registerPlugin(ScrollTrigger)

const toastStore = useToastStore()

const heroSection = ref(null)
const heroText = ref(null)
const titleLine1 = ref(null)
const titleLine2 = ref(null)
const titleLine3 = ref(null)
const heroSubtitle = ref(null)
const heroCta = ref(null)
const heroVisual = ref(null)
const farmCard = ref(null)
const element1 = ref(null)
const element2 = ref(null)
const element3 = ref(null)
const element4 = ref(null)
const featuresSection = ref(null)
const sectionHeader = ref(null)
const statsSection = ref(null)
const infiniteSection = ref(null)
const scrollTrack = ref(null)
const scrollContent = ref(null)

const features = [
  {
    icon: BarChart3,
    title: 'Dashboard Analytique',
    description: 'Suivez vos performances en temps réel avec des graphiques interactifs'
  },
  {
    icon: Sprout,
    title: 'Gestion des Cultures',
    description: 'Planifiez et suivez toutes vos cultures facilement'
  },
  {
    icon: Users,
    title: 'Gestion des Équipes',
    description: 'Coordinez vos équipes et optimisez les tâches quotidiennes'
  },
  {
    icon: Globe,
    title: 'Suivi GPS',
    description: 'Localisez vos équipements et optimisez vos parcours'
  },
  {
    icon: Shield,
    title: 'Sécurité',
    description: 'Vos données sont protégées avec un chiffrement de bout en bout'
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Une application rapide et responsive pour une utilisation optimale'
  }
]

const stats = [
  { number: '500+', label: 'Agriculteurs' },
  { number: '10,000+', label: 'Hectares gérés' },
  { number: '99.9%', label: 'Uptime' },
  { number: '24/7', label: 'Support' }
]

const infiniteCards = ref([
  {
    title: 'Croissance',
    value: '+47%',
    description: 'Augmentation des rendements cette année',
    icon: TrendingUp,
    image: 'https://images.unsplash.com/photo-1625246333595-19a04ee8a1e7?w=120&h=120&fit=crop&crop=center'
  },
  {
    title: 'Économie d\'Eau',
    value: '-32%',
    description: 'Réduction de la consommation d\'eau',
    icon: Droplets,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b6?w=120&h=120&fit=crop&crop=center'
  },
  {
    title: 'Jours Ensoleillés',
    value: '285',
    description: 'Jours favorables cette saison',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1592210454359-90496fa98d57?w=120&h=120&fit=crop&crop=center'
  },
  {
    title: 'Vitesse du Vent',
    value: '12 km/h',
    description: 'Vitesse moyenne actuelle',
    icon: Wind,
    image: null
  },
  {
    title: 'Nouvelles Cultures',
    value: '8',
    description: 'Variétés plantées ce mois',
    icon: Sprout,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=120&h=120&fit=crop&crop=center'
  },
  {
    title: 'Données Analysées',
    value: '2.4TB',
    description: 'Données traitées cette semaine',
    icon: Database,
    image: null
  }
])

const scrollToFeatures = () => {
  featuresSection.value.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  // Test toast pour vérifier que le système fonctionne
  setTimeout(() => {
    toastStore.info('Défilement infini chargé avec succès !', {
      title: 'Système opérationnel',
      duration: 3000
    })
  }, 2000)

  // Hero animations
  const tl = gsap.timeline()
  
  tl.from(titleLine1.value, { y: 100, opacity: 0, duration: 1, ease: 'power3.out' })
    .from(titleLine2.value, { y: 100, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.7')
    .from(titleLine3.value, { y: 100, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.7')
    .from(heroSubtitle.value, { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
    .from(heroCta.value, { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.3')
    .from(farmCard.value, { scale: 0.8, opacity: 0, duration: 1.2, ease: 'back.out(1.7)' }, '-=0.8')

  // Floating elements animation
  gsap.to(element1.value, {
    y: -30,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })
  
  gsap.to(element2.value, {
    y: -20,
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
    delay: 0.5
  })
  
  gsap.to(element3.value, {
    y: -25,
    duration: 3.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
    delay: 1
  })
  
  gsap.to(element4.value, {
    y: -15,
    duration: 2.8,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
    delay: 1.5
  })

  // Features scroll animations
  gsap.from(sectionHeader.value, {
    scrollTrigger: {
      trigger: featuresSection.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  })

  // Features cards animation avec sélecteur CSS
  gsap.from('.feature-card', {
    scrollTrigger: {
      trigger: featuresSection.value,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.1
  })

  // Stats animations avec sélecteur CSS
  gsap.from('.stat-card', {
    scrollTrigger: {
      trigger: statsSection.value,
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    },
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.7)',
    stagger: 0.1
  })

  // Infinite scroll animation
  gsap.from(infiniteSection.value, {
    scrollTrigger: {
      trigger: infiniteSection.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 100,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  })

  // Animation de défilement infini
  const scrollAnimation = gsap.to(scrollContent.value, {
    x: `-50%`,
    duration: 30,
    ease: 'none',
    repeat: -1
  })

  // Pause au survol
  infiniteSection.value?.addEventListener('mouseenter', () => {
    scrollAnimation.pause()
  })

  infiniteSection.value?.addEventListener('mouseleave', () => {
    scrollAnimation.play()
  })

  // Animation des cartes individuelles avec sélecteur CSS
  gsap.from('.info-card', {
    scrollTrigger: {
      trigger: infiniteSection.value,
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    stagger: 0.1
  })
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  overflow-x: hidden;
}

.hero-section {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.element-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
}

.element-2 {
  width: 60px;
  height: 60px;
  top: 60%;
  right: 15%;
}

.element-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
}

.element-4 {
  width: 40px;
  height: 40px;
  top: 30%;
  right: 30%;
}

.hero-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  align-items: center;
}

.hero-text {
  color: white;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 2rem;
}

.title-line {
  display: block;
  opacity: 0;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-cta {
  opacity: 0;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: white;
  color: #48bb78;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.cta-button:hover .arrow-icon {
  transform: translateX(5px);
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.farm-illustration {
  position: relative;
}

.farm-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  min-width: 350px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #48bb78, #38a169);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #48bb78;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
  margin-top: 0.25rem;
}

.infinite-scroll-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  overflow: hidden;
  position: relative;
  border-top: 3px solid rgba(255, 255, 255, 0.2);
  border-bottom: 3px solid rgba(255, 255, 255, 0.2);
}

.infinite-scroll-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  z-index: 1;
}

.infinite-scroll-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  z-index: 2;
}

.scroll-track {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.scroll-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  height: 100%;
  width: fit-content;
}

.info-card {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  min-width: 350px;
  max-width: 400px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.info-card:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.card-image {
  width: 120px;
  height: 120px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #48bb78, #38a169);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-card .card-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #48bb78, #38a169);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.info-card .card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.info-card .card-value {
  font-size: 2rem;
  font-weight: 800;
  color: #48bb78;
  margin-bottom: 0.5rem;
}

.info-card .card-description {
  font-size: 0.9rem;
  color: #718096;
  line-height: 1.5;
}

.features-section {
  padding: 6rem 0;
  background: #f7fafc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.25rem;
  color: #718096;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #48bb78, #38a169);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
}

.feature-description {
  color: #718096;
  line-height: 1.6;
}

.stats-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.stats-section .stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-card {
  text-align: center;
  color: white;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.stat-card .stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .farm-card {
    min-width: 300px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>
