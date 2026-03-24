import { createRouter, createWebHistory } from 'vue-router'
import SpaLayout from '../layouts/SpaLayout.vue'
import Spa from '../views/Spa.vue'

// SPA routes
const spaRoutes = [
  {
    path: '/',
    component: SpaLayout,
    children: [
      {
        path: '',
        name: 'SpaHome',
        component: () => import('../views/spa/Home.vue')
      },
      {
        path: 'about',
        name: 'SpaAbout',
        component: () => import('../views/spa/About.vue')
      },
      {
        path: 'contact',
        name: 'SpaContact',
        component: () => import('../views/spa/Contact.vue')
      }
    ]
  }
]

// Main app routes (à configurer plus tard)
const mainAppRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: Spa
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/campaigns',
    name: 'Campaigns',
    component: () => import('../views/Campaigns.vue')
  },
  {
    path: '/departments',
    name: 'Departments',
    component: () => import('../views/Departements.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...spaRoutes, ...mainAppRoutes],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  }
})

export default router
