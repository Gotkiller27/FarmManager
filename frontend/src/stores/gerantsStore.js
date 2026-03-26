import { defineStore } from 'pinia';
import api, { createGerant, updateGerant } from '../services/api.js';

export const useGerantStore = defineStore('gerantStore', {
  state: () => ({
    gerants: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchGerants() {
      this.loading = true;
      try {
        const response = await api.get('/gerants');
        this.gerants = response.data;
      } catch (err) {
        this.error = "Erreur lors du chargement des gérants";
      } finally {
        this.loading = false;
      }
    },

    async createGerant(id, gerantData) {
      this.loading = true;
      try {
        const response = await createGerant(id, gerantData);
        // On rafraîchit la liste pour être sûr d'avoir les données à jour
        await this.fetchGerants(); 
        return response;
      } catch (err) {
        this.error = "Erreur lors de l'enregistrement";
        throw err;
      } finally {
        this.loading = false;
      }
    }
  },
});