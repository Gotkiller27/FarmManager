import { defineStore } from 'pinia';
import api from '../services/api.js';

export const useAdminStore = defineStore('adminStore', {
  state: () => ({
    admins: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAdmins() {
      this.loading = true;
      try {
        const response = await api.get('/admins');
        this.admins = response.data;
      } catch (err) {
        this.error = "Erreur lors du chargement des administrateurs";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async createAdmin(adminData) {
      this.loading = true;
      try {
        const response = await api.post('/admins', adminData);
        this.admins.push(response.data);
      } catch (err) {
        this.error = "Erreur lors de la création de l'administrateur";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async updateAdmin(adminId, updateData) {
      this.loading = true;
      try {
        const response = await api.put(`/admins/admin`, updateData, {
          params: { id: adminId },
        });
        const index = this.admins.findIndex(admin => admin.id === adminId);
        if (index !== -1) {
          this.admins[index] = response.data;
        }
      } catch (err) {
        this.error = "Erreur lors de la mise à jour de l'administrateur";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
});