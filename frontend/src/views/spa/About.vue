<template>
  <div class="about-container">
    <!-- Hero Section -->
    <section class="hero-section" ref="heroSection">
      <div class="hero-background">
        <div class="animated-bg">
          <div class="bg-shape shape-1" ref="shape1"></div>
          <div class="bg-shape shape-2" ref="shape2"></div>
          <div class="bg-shape shape-3" ref="shape3"></div>
        </div>
      </div>
      
      <div class="hero-content">
        <div class="hero-text" ref="heroText">
          <h1 class="hero-title">À Propos de FarmManager</h1>
          <p class="hero-subtitle">
            La solution innovante pour transformer la gestion agricole moderne
          </p>
        </div>
        
        <div class="hero-visual" ref="heroVisual">
          <div class="floating-cards">
            <div class="card card-1" ref="card1">
              <div class="card-icon">
                <Target />
              </div>
              <div class="card-text">Mission</div>
            </div>
            <div class="card card-2" ref="card2">
              <div class="card-icon">
                <Eye />
              </div>
              <div class="card-text">Vision</div>
            </div>
            <div class="card card-3" ref="card3">
              <div class="card-icon">
                <Heart />
              </div>
              <div class="card-text">Valeurs</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="mission-section" ref="missionSection">
      <div class="container">
        <div class="mission-content">
          <div class="mission-text" ref="missionText">
            <h2 class="section-title">Notre Mission</h2>
            <p class="mission-description">
              FarmManager a pour mission de révolutionner la gestion agricole en fournissant
              des outils numériques puissants et intuitifs. Nous croyons que la technologie
              peut aider les agriculteurs à optimiser leurs opérations, réduire leurs coûts
              et augmenter leur productivité de manière durable.
            </p>
            <div class="mission-points">
              <div class="point" v-for="(point, index) in missionPoints" :key="index" :ref="`point${index}`">
                <div class="point-icon">
                  <CheckCircle />
                </div>
                <span class="point-text">{{ point }}</span>
              </div>
            </div>
          </div>
          
          <div class="mission-visual" ref="missionVisual">
            <div class="illustration">
              <div class="growth-chart">
                <div class="chart-bar" v-for="(height, index) in chartBars" :key="index" :style="{ height: height + '%' }" :ref="`bar${index}`"></div>
              </div>
              <div class="chart-label">Croissance Continue</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section" ref="valuesSection">
      <div class="container">
        <div class="section-header" ref="sectionHeader">
          <h2 class="section-title">Nos Valeurs</h2>
          <p class="section-subtitle">Les principes qui guident notre action</p>
        </div>
        
        <div class="values-grid">
          <div class="value-card" v-for="(value, index) in values" :key="index" :ref="`value${index}`">
            <div class="value-icon">
              <component :is="value.icon" />
            </div>
            <h3 class="value-title">{{ value.title }}</h3>
            <p class="value-description">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section" ref="teamSection">
      <div class="container">
        <div class="section-header" ref="teamHeader">
          <h2 class="section-title">Notre Équipe</h2>
          <p class="section-subtitle">Des passionnés dédiés à l'innovation agricole</p>
        </div>
        
        <div class="team-grid">
          <div class="team-member" v-for="(member, index) in teamMembers" :key="index" :ref="`member${index}`">
            <div class="member-avatar">
              <div class="avatar-placeholder">
                <User />
              </div>
            </div>
            <h4 class="member-name">{{ member.name }}</h4>
            <p class="member-role">{{ member.role }}</p>
            <p class="member-description">{{ member.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section" ref="ctaSection">
      <div class="container">
        <div class="cta-content" ref="ctaContent">
          <h2 class="cta-title">Prêt à Transformer Votre Exploitation ?</h2>
          <p class="cta-subtitle">
            Rejoignez des centaines d'agriculteurs qui utilisent déjà FarmManager
            pour optimiser leurs opérations quotidiennes.
          </p>
          <button class="cta-button" @click="scrollToContact">
            Contacter Nous
            <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Target, 
  Eye, 
  Heart, 
  CheckCircle, 
  Leaf, 
  Users, 
  Lightbulb, 
  Shield,
  User,
  ArrowRight
} from 'lucide-vue-next'

import { useRouter } from 'vue-router'

const router = useRouter()

const heroSection = ref(null)
const heroText = ref(null)
const heroVisual = ref(null)
const shape1 = ref(null)
const shape2 = ref(null)
const shape3 = ref(null)
const card1 = ref(null)
const card2 = ref(null)
const card3 = ref(null)
const missionSection = ref(null)
const missionText = ref(null)
const missionVisual = ref(null)
const valuesSection = ref(null)
const sectionHeader = ref(null)
const teamSection = ref(null)
const teamHeader = ref(null)
const ctaSection = ref(null)
const ctaContent = ref(null)

const missionPoints = [
  'Simplifier la gestion agricole',
  'Augmenter la productivité',
  'Promouvoir des pratiques durables',
  'Faciliter la prise de décision',
  'Connecter les agriculteurs'
]

const values = [
  {
    icon: Leaf,
    title: 'Durabilité',
    description: 'Nous promouvons des pratiques agricoles qui respectent l\'environnement et assurent la viabilité à long terme.'
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Nous croyons au pouvoir de la communauté et au partage des connaissances pour faire progresser tous les agriculteurs.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Nous poussons constamment les limites de la technologie pour apporter des solutions toujours plus performantes.'
  },
  {
    icon: Shield,
    title: 'Fiabilité',
    description: 'La sécurité et la fiabilité de nos données sont au cœur de notre engagement envers nos utilisateurs.'
  }
]

const teamMembers = [
  {
    name: 'Jean Dupont',
    role: 'CEO & Fondateur',
    description: 'Agriculteur de troisième génération passionné par la technologie.'
  },
  {
    name: 'Marie Martin',
    role: 'CTO',
    description: 'Expert en développement logiciel spécialisé dans les solutions agricoles.'
  },
  {
    name: 'Pierre Bernard',
    role: 'Directeur Agricole',
    description: '20 ans d\'expérience dans la conseil et l\'optimisation des exploitations.'
  },
  {
    name: 'Sophie Petit',
    role: 'Responsable Client',
    description: 'Dédiée à l\'accompagnement des agriculteurs dans leur transformation digitale.'
  }
]

const chartBars = [60, 80, 45, 90, 70, 85]

const scrollToContact = () => {
  router.push('/contact')
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  // Hero animations
  const tl = gsap.timeline()
  
  tl.from(heroText.value, { y: 100, opacity: 0, duration: 1.2, ease: 'power3.out' })
    .from(card1.value, { scale: 0, rotation: -180, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.6')
    .from(card2.value, { scale: 0, rotation: 180, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.4')
    .from(card3.value, { scale: 0, rotation: -180, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.4')

  // Background shapes animation
  gsap.to(shape1.value, {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: 'none'
  })
  
  gsap.to(shape2.value, {
    rotation: -360,
    duration: 25,
    repeat: -1,
    ease: 'none'
  })
  
  gsap.to(shape3.value, {
    rotation: 360,
    duration: 30,
    repeat: -1,
    ease: 'none'
  })

  // Floating cards animation
  gsap.to(card1.value, {
    y: -20,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })
  
  gsap.to(card2.value, {
    y: -15,
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
    delay: 0.5
  })
  
  gsap.to(card3.value, {
    y: -25,
    duration: 3.5,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
    delay: 1
  })

  // Mission section animations
  gsap.from(missionText.value, {
    scrollTrigger: {
      trigger: missionSection.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    x: -100,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  })

  gsap.from(missionVisual.value, {
    scrollTrigger: {
      trigger: missionSection.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    x: 100,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  })

  // Mission points avec sélecteur CSS
  gsap.from('.point', {
    scrollTrigger: {
      trigger: missionSection.value,
      start: 'top 60%',
      toggleActions: 'play none none reverse'
    },
    x: -50,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    stagger: 0.1
  })

  // Chart bars animation avec sélecteur CSS
  gsap.from('.chart-bar', {
    scrollTrigger: {
      trigger: missionSection.value,
      start: 'top 50%',
      toggleActions: 'play none none reverse'
    },
    scaleY: 0,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.1
  })

  // Values section
  gsap.from(sectionHeader.value, {
    scrollTrigger: {
      trigger: valuesSection.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  })

  // Values cards avec sélecteur CSS
  gsap.from('.value-card', {
    scrollTrigger: {
      trigger: valuesSection.value,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.15
  })

  // Team section
  gsap.from(teamHeader.value, {
    scrollTrigger: {
      trigger: teamSection.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  })

  // Team members avec sélecteur CSS
  gsap.from('.team-member', {
    scrollTrigger: {
      trigger: teamSection.value,
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    },
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.7)',
    stagger: 0.1
  })

  // CTA section
  gsap.from(ctaContent.value, {
    scrollTrigger: {
      trigger: ctaSection.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  })
})
</script>

<style scoped>
.about-container {
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

.animated-bg {
  position: relative;
  width: 100%;
  height: 100%;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.shape-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 10%;
}

.shape-2 {
  width: 80px;
  height: 80px;
  top: 70%;
  right: 15%;
}

.shape-3 {
  width: 150px;
  height: 150px;
  bottom: 10%;
  left: 30%;
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
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  opacity: 0.9;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-cards {
  position: relative;
  width: 300px;
  height: 300px;
}

.card {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
}

.card-1 {
  top: 0;
  left: 0;
}

.card-2 {
  top: 0;
  right: 0;
}

.card-3 {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.card-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #48bb78, #38a169);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.card-text {
  font-weight: 600;
  color: #1a202c;
}

.mission-section {
  padding: 6rem 0;
  background: #f7fafc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.mission-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 1.5rem;
}

.mission-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a5568;
  margin-bottom: 2rem;
}

.mission-points {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.point {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.point-icon {
  color: #48bb78;
  flex-shrink: 0;
}

.point-text {
  color: #2d3748;
  font-weight: 500;
}

.mission-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.illustration {
  text-align: center;
}

.growth-chart {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 200px;
  margin-bottom: 1rem;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(135deg, #48bb78, #38a169);
  border-radius: 8px 8px 0 0;
  min-height: 20px;
}

.chart-label {
  font-weight: 600;
  color: #4a5568;
}

.values-section {
  padding: 6rem 0;
  background: white;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-subtitle {
  font-size: 1.25rem;
  color: #718096;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.value-card {
  background: #f7fafc;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.value-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #48bb78, #38a169);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 1.5rem;
}

.value-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
}

.value-description {
  color: #718096;
  line-height: 1.6;
}

.team-section {
  padding: 6rem 0;
  background: #f7fafc;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.team-member {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.team-member:hover {
  transform: translateY(-5px);
}

.member-avatar {
  margin-bottom: 1.5rem;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #48bb78, #38a169);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto;
}

.member-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.member-role {
  color: #48bb78;
  font-weight: 600;
  margin-bottom: 1rem;
}

.member-description {
  color: #718096;
  line-height: 1.6;
  font-size: 0.9rem;
}

.cta-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.cta-content {
  text-align: center;
  color: white;
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
}

.cta-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
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

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .mission-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
}
</style>
