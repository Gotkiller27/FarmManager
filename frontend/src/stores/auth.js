import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(credentials) {
      const { data } = await api.post('/auth/login', credentials);
      this.user = data.user;
      this.token = data.token;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.clear();
    }
  }
});