import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';
import Campaigns from '@/views/Campaigns.vue';
import Signup from '@/views/Signup.vue'; 
import Departements from '@/views/Departements.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { 
    path: '/dashboard', 
    name: 'Dashboard',
    component: Dashboard, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/campaigns', 
    name: 'Campaigns',
    component: Campaigns, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/signup', 
    name: 'Signup',
    component: Signup, 
    // On garde requiresAuth: true mais on va gérer l'exception dans le guard
    meta: { requiresAuth: true, role: ['Admin', 'Gestionnaire'] } 
  },
  { 
    path: '/departements', 
    name: 'Departements',
    component: Departements, 
    meta: { requiresAuth: true, role: ['Admin'] } 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from) => {
  const auth = useAuthStore();

  // EXCEPTION : Si on veut aller sur Signup et qu'aucun utilisateur n'est dans le store
  // Cela permet la création du tout premier Admin.
  if (to.name === 'Signup' && !auth.token) {
    return true; 
  }

  // 1. Vérifier si la page nécessite d'être connecté
  if (to.meta.requiresAuth && !auth.token) {
    return { name: 'Login' }; 
  }

  // 2. Vérifier si l'utilisateur a le rôle nécessaire
  if (to.meta.role && !to.meta.role.includes(auth.user?.role)) {
    console.warn("Accès refusé : Permissions insuffisantes");
    return { name: 'Dashboard' };
  }

  return true;
});

export default router;