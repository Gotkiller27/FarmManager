import { defineStore } from 'pinia';
import api, { createAgent, updateAgent } from '../services/api.js';

export const useAgentsStore = defineStore('agentsStore', {
  state: () => ({
    agents: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAgents() {
      this.loading = true;
      try {
        const response = await api.get('/agents');
        this.agents = response.data;
      } catch (err) {
        this.error = "Erreur lors du chargement des agents";
      } finally {
        this.loading = false;
      }
    },

    async createAgent(id, agentsData) {
      this.loading = true;
      try {
        const response = await createAgent(id, agentsData);
        // On rafraîchit la liste pour être sûr d'avoir les données à jour
        await this.fetchAgents(); 
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