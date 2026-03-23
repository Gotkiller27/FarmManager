

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

onMounted(() => {
  if (auth.token) {
    router.push('/admin-dashboard');
  }
});

const auth = useAuthStore();
const router = useRouter();
const form = ref({ email: '', password: '' });

const handleLogin = async () => {
  try {
    await auth.login(form.value);
    router.push('/admin-dashboard');
  } catch (err) {
    alert("Identifiants incorrects");
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-farm-green">FarmManager</h2>
        <p class="text-gray-500">Connectez-vous à votre exploitation</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="email" autocomplete="username" required 
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-farm-green focus:border-farm-green outline-none transition" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input v-model="form.password" type="password" autocomplete="current-password" required 
            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-farm-green focus:border-farm-green outline-none transition" />
        </div>

        <button type="submit" 
  class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors duration-200">
  Se connecter
</button>
        <p class="mt-4 text-center text-sm text-gray-600">
  Pas encore de compte ? 
  <router-link to="/register"
   class="text-green-600 hover:underline font-medium">
    Créer le premier accès Admin
  </router-link>
</p>
      </form>
    </div>
  </div>
</template>


<style scoped>


</style>

