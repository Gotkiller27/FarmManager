import { defineStore } from 'pinia';
import api from '@/services/api';
import { useToastStore } from './toast';

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
      loading: false,
      error: null,
    };
  },
  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      const toastStore = useToastStore();
      try {
        const response = await api.post('/auth/login', credentials);
        this.user = response.data.user;
        this.token = response.data.token;
        localStorage.setItem('token', this.token);
        return response.data;
      } catch (err) {
        this.error = 'Identifiants incorrects';
        toastStore.showToast({
          message: 'Identifiants incorrects. Veuillez réessayer.',
          type: 'error',
        });
        throw err;
      } finally {
        this.loading = false;
      }
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