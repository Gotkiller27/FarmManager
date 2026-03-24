import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => {
    const savedUser = localStorage.getItem('user');
    // On évite le crash si la chaîne "undefined" est stockée
    const user = (savedUser && savedUser !== "undefined") 
      ? JSON.parse(savedUser) 
      : null;

    return {
      user: user,
      token: localStorage.getItem('token') || null,
    };
  },
  actions: {
    async login(credentials) {
      // 1. On récupère la réponse de l'API
      const { data } = await api.post('/auth/login', credentials);
      
      // 2. CORRECTION ICI : Ton backend envoie loginData
      // On extrait user et token depuis data.loginData
      const { user, token } = data.loginData; 

      // 3. On met à jour le state de Pinia
      this.user = user;
      this.token = token;

      // 4. On stocke proprement dans le localStorage
      // On utilise JSON.stringify(user) car c'est un objet
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Ou localStorage.clear();
    }
  }
});