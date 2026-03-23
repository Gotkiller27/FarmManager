<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  last_name: '',
  first_name: '',
  email: '',
  password: '',
  role: 'admin0', // J'ai mis Par défaut Admin pour la première création
})

const handleSignup = async () => {
  try {
    await api.post('/auth/register', form.value)
    alert('Compte créé avec succès ! Connectez-vous maintenant.')
    router.push('/login')
  } catch (err) {
    alert('Erreur lors de la création du compte.')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Créer un compte utilisateur
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        FarmManager : Gestion des accès et départements
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
        <form @submit.prevent="handleSignup" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">First_name</label>
              <input
                v-model="form.first_name"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Last_name</label>
              <input
                v-model="form.last_name" 
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              v-model="form.password"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          

          <div class="pt-4">
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
            >
              Enregistrer l'utilisateur
            </button>
             <p class="mt-4 text-center text-sm text-gray-600">
  vous avez déjà un compte ? 
  <router-link to="/login" class="text-green-600 hover:underline font-medium">
    Se connecter
  </router-link>
</p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>