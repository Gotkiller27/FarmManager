<template>
  <div class="contact-container">
    <!-- Hero Section -->
    <section class="hero-section" ref="heroSection">
      <div class="hero-background">
        <div class="animated-particles">
          <div class="particle" v-for="n in 20" :key="n" :ref="`particle${n}`"></div>
        </div>
      </div>
      
      <div class="hero-content">
        <div class="hero-text" ref="heroText">
          <h1 class="hero-title">Contactez-Nous</h1>
          <p class="hero-subtitle">
            Nous sommes là pour répondre à toutes vos questions et vous accompagner
            dans votre transformation agricole.
          </p>
        </div>
        
        <div class="hero-visual" ref="heroVisual">
          <div class="contact-illustration">
            <div class="message-bubble" ref="messageBubble">
              <Mail />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section class="contact-form-section" ref="formSection">
      <div class="container">
        <div class="contact-content">
          <div class="form-wrapper" ref="formWrapper">
            <div class="form-header">
              <h2 class="form-title">Envoyez-nous un message</h2>
              <p class="form-subtitle">
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
              </p>
            </div>
            
            <form class="contact-form" @submit.prevent="handleSubmit" ref="contactForm">
              <div class="form-group" ref="nameGroup">
                <label for="name" class="form-label">Nom Complet</label>
                <input
                  type="text"
                  id="name"
                  v-model="form.name"
                  class="form-input"
                  placeholder="Votre nom"
                  required
                />
                <div class="input-border"></div>
              </div>
              
              <div class="form-group" ref="emailGroup">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  class="form-input"
                  placeholder="votre@email.com"
                  required
                />
                <div class="input-border"></div>
              </div>
              
              <div class="form-group" ref="messageGroup">
                <label for="message" class="form-label">Message</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  class="form-textarea"
                  placeholder="Votre message..."
                  rows="6"
                  required
                ></textarea>
                <div class="input-border"></div>
              </div>
              
              <button type="submit" class="submit-button" :disabled="isSubmitting" ref="submitButton">
                <span v-if="!isSubmitting">
                  Envoyer le message
                  <Send />
                </span>
                <span v-else class="loading-text">
                  Envoi en cours...
                  <div class="spinner"></div>
                </span>
              </button>
            </form>
          </div>
          
          <div class="contact-info" ref="contactInfo">
            <div class="info-card">
              <div class="info-icon">
                <Mail />
              </div>
              <h3 class="info-title">Email</h3>
              <p class="info-text">sechegbesedami@gmail.com</p>
            </div>
            
            <div class="info-card">
              <div class="info-icon">
                <Phone />
              </div>
              <h3 class="info-title">Téléphone</h3>
              <p class="info-text">+33 1 23 45 67 89</p>
            </div>
            
            <div class="info-card">
              <div class="info-icon">
                <MapPin />
              </div>
              <h3 class="info-title">Adresse</h3>
              <p class="info-text">Paris, France</p>
            </div>
            
            <div class="info-card">
              <div class="info-icon">
                <Clock />
              </div>
              <h3 class="info-title">Disponibilité</h3>
              <p class="info-text">Lun-Ven: 9h-18h</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop ref="modalContent">
        <div class="modal-icon">
          <CheckCircle />
        </div>
        <h3 class="modal-title">Message envoyé !</h3>
        <p class="modal-message">
          Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
        </p>
        <button class="modal-button" @click="closeModal">Fermer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'

gsap.registerPlugin(ScrollTrigger)

const toastStore = useToastStore()

const heroSection = ref(null)
const heroText = ref(null)
const heroVisual = ref(null)
const messageBubble = ref(null)
const formSection = ref(null)
const formWrapper = ref(null)
const contactForm = ref(null)
const nameGroup = ref(null)
const emailGroup = ref(null)
const messageGroup = ref(null)
const submitButton = ref(null)
const contactInfo = ref(null)
const modalContent = ref(null)

const isSubmitting = ref(false)
const showSuccessModal = ref(false)

const form = ref({
  name: '',
  email: '',
  message: ''
})

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // Créer le contenu de l'email
    const emailContent = `
      🌾 NOUVEAU MESSAGE DE CONTACT - FARMMANAGER 🌾
      
      👤 Informations de l'expéditeur :
      • Nom : ${form.value.name}
      • Email : ${form.value.email}
      
      📝 Message :
      ${form.value.message}
      
      ---
      📍 Envoyé depuis : ${window.location.href}
      📅 Date : ${new Date().toLocaleString('fr-FR')}
    `.trim()
    
    // Créer un sujet pour l'email
    const subject = encodeURIComponent(`📬 Nouveau message de ${form.value.name} - FarmManager`)
    const body = encodeURIComponent(emailContent)
    
    // Ouvrir le client email dans une nouvelle fenêtre
    const mailtoLink = `mailto:sechegbesedami@gmail.com?subject=${subject}&body=${body}`
    const newWindow = window.open(mailtoLink, '_blank')
    
    // Afficher le modal de succès après un court délai
    setTimeout(() => {
      showSuccessModal.value = true
      form.value = {
        name: '',
        email: '',
        message: ''
      }
    }, 1500)
    
    // Si le mailto ne fonctionne pas (certains navigateurs/mobiles)
    setTimeout(() => {
      if (!newWindow || newWindow.closed) {
        // Alternative : copier dans le presse-papiers
        copyToClipboard(emailContent)
      }
    }, 2000)
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error)
    copyToClipboard(emailContent)
  } finally {
    isSubmitting.value = false
  }
}

const copyToClipboard = async (content) => {
  try {
    await navigator.clipboard.writeText(content)
    toastStore.success('Message copié dans le presse-papiers!', {
      title: 'Copie réussie',
      duration: 3000
    })
  } catch (error) {
    toastStore.error('Veuillez envoyer un email à sechegbesedami@gmail.com avec les informations suivantes:\n\n' + content, {
      title: 'Action manuelle requise',
      duration: 10000
    })
  }
}

const closeModal = () => {
  gsap.to(modalContent.value, {
    scale: 0.8,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      showSuccessModal.value = false
    }
  })
}

onMounted(() => {
  // Hero animations
  const tl = gsap.timeline()
  
  tl.from(heroText.value, { y: 100, opacity: 0, duration: 1.2, ease: 'power3.out' })
    .from(messageBubble.value, { scale: 0, rotation: -180, duration: 1, ease: 'back.out(1.7)' }, '-=0.6')

  // Particles animation
  for (let i = 1; i <= 20; i++) {
    const particle = document.querySelector(`[ref="particle${i}"]`)
    if (particle) {
      gsap.to(particle, {
        y: -Math.random() * 100 - 50,
        x: Math.random() * 100 - 50,
        duration: Math.random() * 3 + 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: Math.random() * 2
      })
    }
  }

  // Message bubble animation
  gsap.to(messageBubble.value, {
    y: -20,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })

  // Form section animations
  gsap.from(formWrapper.value, {
    scrollTrigger: {
      trigger: formSection.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    x: -100,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  })

  gsap.from(contactInfo.value, {
    scrollTrigger: {
      trigger: formSection.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    x: 100,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  })

  // Form groups animation
  const formGroups = [nameGroup.value, emailGroup.value, messageGroup.value]
  formGroups.forEach((group, index) => {
    gsap.from(group, {
      scrollTrigger: {
        trigger: formSection.value,
        start: 'top 60%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: index * 0.1
    })
  })

  gsap.from(submitButton.value, {
    scrollTrigger: {
      trigger: formSection.value,
      start: 'top 50%',
      toggleActions: 'play none none reverse'
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  })

  // Modal animation
  if (showSuccessModal.value) {
    gsap.from(modalContent.value, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
})
</script>

<style scoped>
.contact-container {
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

.animated-particles {
  position: relative;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
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

.contact-illustration {
  position: relative;
}

.message-bubble {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #48bb78;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.contact-form-section {
  padding: 6rem 0;
  background: #f7fafc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.contact-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  align-items: start;
}

.form-wrapper {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 1rem;
}

.form-subtitle {
  color: #718096;
  line-height: 1.6;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  position: relative;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4a5568;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f7fafc;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #48bb78;
  background: white;
  box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(135deg, #48bb78, #38a169);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.form-input:focus + .input-border,
.form-textarea:focus + .input-border {
  transform: scaleX(1);
}

.submit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #48bb78, #38a169);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.info-title {
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.info-text {
  color: #718096;
  font-size: 0.9rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.modal-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #48bb78, #38a169);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 1.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
}

.modal-message {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.modal-button {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(72, 187, 120, 0.3);
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
  
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .form-wrapper {
    padding: 2rem;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
}
</style>
