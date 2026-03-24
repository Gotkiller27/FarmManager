<template>
  <div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-500 to-green-700">
    <div class="absolute inset-0 z-10">
      <div class="relative w-full h-full">
        <div class="absolute w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full top-10 left-10 animate-pulse"></div>
        <div class="absolute w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full top-1/2 right-20 animate-bounce"></div>
        <div class="absolute w-40 h-40 bg-white/10 backdrop-blur-sm rounded-full bottom-20 left-1/3 animate-pulse"></div>
      </div>
    </div>
    
    <div class="relative z-20 min-h-screen flex items-center justify-center p-4">
      <div class="bg-white/95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl w-full max-w-md">
        <div class="text-center mb-8">
          <div class="flex items-center justify-center gap-3 mb-6">
            <Tractor class="w-8 h-8 text-green-600" />
            <span class="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">FarmManager</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Bon retour !</h1>
          <p class="text-gray-600">Connectez-vous pour accéder à votre tableau de bord</p>
        </div>
        
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              v-model="loginForm.email"
              placeholder="votre@email.com"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
            <input
              type="password"
              id="password"
              v-model="loginForm.password"
              placeholder="•••••••"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
            />
          </div>
          
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="loginForm.remember" 
                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span class="text-sm text-gray-700">Se souvenir de moi</span>
            </label>
            <a href="#" class="text-sm text-green-600 hover:text-green-700 transition-colors">Mot de passe oublié ?</a>
          </div>
          
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold py-3 px-4 rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="!isLoading">Se connecter</span>
            <span v-else class="flex items-center gap-2">
              Connexion en cours...
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </span>
          </button>
        </form>
        
        <div class="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
          <p class="text-sm font-semibold text-green-800 mb-2">Accès Démo</p>
          <div class="space-y-1">
            <div class="text-sm text-green-700">
              <strong>Email:</strong> admin@farmmanager.com
            </div>
            <div class="text-sm text-green-700">
              <strong>Mot de passe:</strong> admin123
            </div>
          </div>
        </div>
        
        <div class="mt-6 text-center">
          <router-link to="/" class="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors">
            <ArrowLeft class="w-4 h-4" />
            Retour à l'accueil
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Tractor, ArrowLeft } from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const toastStore = useToastStore()
const isLoading = ref(false)

const loginForm = ref({
  email: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  isLoading.value = true
  
  try {
    // Simulation de connexion
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Vérification des identifiants de démo
    if (loginForm.value.email === 'admin@farmmanager.com' && loginForm.value.password === 'admin123') {
      // Rediriger vers le dashboard
      router.push('/dashboard')
    } else {
      toastStore.error('Identifiants incorrects. Utilisez les identifiants de démo.', {
        title: 'Erreur de connexion',
        duration: 5000
      })
    }
  } catch (error) {
    console.error('Erreur de connexion:', error)
    toastStore.error('Une erreur est survenue. Veuillez réessayer.', {
      title: 'Erreur système',
      duration: 5000
    })
  } finally {
    isLoading.value = false
  }
}
</script>
