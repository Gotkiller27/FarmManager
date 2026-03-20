<template>
  <aside class="sidebar">
    <div class="profile-section">
      <p class="user-name">{{ auth.user?.prenom }} {{ auth.user?.nom }}</p>
      <span class="badge">{{ auth.user?.role }}</span>
    </div>

    <nav class="nav-links">
      <router-link to="/dashboard">Tableau de Bord</router-link>
      
      <router-link v-if="canAccess('Elevage')" to="/animals">Élevage</router-link>
      <router-link v-if="canAccess('Cultures')" to="/campaigns">Campagnes</router-link>
      <router-link v-if="canAccess('Stock')" to="/stock">Stocks</router-link>

      <div v-if="auth.user?.role === 'Admin'" class="divider">
        <span>ADMIN</span>
        <router-link to="/signup">Nouveau Membre</router-link>
        <router-link to="/departements">Gérer Départements</router-link>
      </div>
    </nav>
    
    <button @click="handleLogout" class="btn-logout">Déconnexion</button>
  </aside>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const canAccess = (dept) => {
  // L'Admin et le Gestionnaire voient tout, le Gérant ne voit que son département
  if (['Admin', 'Gestionnaire'].includes(auth.user?.role)) return true;
  return auth.user?.departement === dept;
};

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
</script>