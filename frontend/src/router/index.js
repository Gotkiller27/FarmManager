import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import Managers from '@/views/Managers.vue'
import Agents from '@/views/Agents.vue'
import Users from '@/views/Users.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import SpaLayout from '../layouts/SpaLayout.vue'
import DashboardGerant from '@/views/DashboardGerant.vue'
import DashboardAgent from '@/views/DashboardAgent.vue'
import { useAuthStore } from '@/stores/auth.js'

const routes = [
  {
    path: '/layout-principale', // On utilise la racine pour le layout principal
    component: AdminLayout,
    children: [
      // Ici, les paths doivent correspondre EXACTEMENT à ceux du sidebarItems
      { path: 'dashboard', name: 'dashboard', component: Dashboard },
      { path: 'dashboard-gerant', name: 'dashboard-gerant', component: DashboardGerant },
      { path: 'dashboard-agent', name: 'dashboard-agent', component: DashboardAgent },
      { path: 'managers', name: 'managers', component: Managers },
      { path: 'agents', name: 'agents', component: Agents },
      { path: 'users', name: 'users', component: Users },

      // Ajoute des routes vides ou vers Dashboard pour les départements en attendant
      { path: 'departments/volaille', name: 'volaille', component: Dashboard },
      { path: 'departments/betail', name: 'betail', component: Dashboard },
      { path: 'departments/pisciculture', name: 'pisciculture', component: Dashboard },
      { path: 'my-campaigns', name: 'campaigns', component: Dashboard },
    ],
    meta: {requireAuth: true}
  },

  {
    path: '/',
    component: SpaLayout,
    children: [
      {
        path: '',
        name: 'SpaHome',
        component: () => import('../views/spa/Home.vue'),
      },
      {
        path: 'about',
        name: 'SpaAbout',
        component: () => import('../views/spa/About.vue'),
      },
      {
        path: 'login',
        name: 'login',
        component: LoginView,
      },
      {
        path: 'register',
        name: 'register',
        component: RegisterView,
      },
      {
        path: 'contact',
        name: 'SpaContact',
        component: () => import('../views/spa/Contact.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.token

  // 1. Vérification de l'authentification
  if (to.meta.requireAuth && !isAuthenticated) {
    // Si la route demande une auth et que l'user n'est pas connecté
    return next({ name: 'login' })
  }

  // 2. Empêcher l'accès aux pages Login/Register si déjà connecté
  if (isAuthenticated && (to.name === 'login' || to.name === 'register')) {
    // On redirige vers son dashboard selon son rôle
    return next({ name: 'dashboard' }) 
  }

  // 3. (Optionnel) Garde par Rôle
  // Si tu veux restreindre /users aux admins seulement
  if (to.path.includes('users') && authStore.user?.role !== 'admin') {
    alert("Accès refusé : Réservé aux administrateurs")
    return next({ name: 'dashboard' })
  }

  next() // Autorise la navigation
})

export default router
