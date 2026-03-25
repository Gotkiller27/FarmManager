import { defineStore } from 'pinia';
import { createAdmin, updateAdmin } from '../services/api.js';

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

    async createAdmin(id, adminData) {
      this.loading = true;
      try {
        const response = await createAdmin(id, adminData);
        this.admins.push(response);
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
        const response = await updateAdmin(adminId, updateData);
        const index = this.admins.findIndex(admin => admin.id === adminId);
        if (index !== -1) {
          this.admins[index] = response;
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