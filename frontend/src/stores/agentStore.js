import { defineStore } from 'pinia';
import api from '@/services/api.js';

export const useAgentStore = defineStore('agentStore', {
  state: () => ({
    loading: false,
    allAgents: [],
    campaignAgents: []
  }),

  actions: {
    // Récupérer tous les agents du système
    async fetchAllAgents() {
      this.loading = true;
      try {
        const resp = await api.get('/agentCampaign'); 
        this.allAgents = resp.data;
        return resp.data;
      } catch (err) {
        return [];
      } finally {
        this.loading = false;
      }
    },

    // Assigner un agent
    async assignAgent(payload) {
      try {
        const resp = await api.post('/agentCampaign/assign', payload);
        return resp.data;
      } catch (err) {
        throw err;
      }
    },

    // Récupérer les agents d'une campagne
    async fetchCampaignAgents(campagneId) {
      try {
        const resp = await api.get(`/agentCampaign/campaign/${campagneId}`);
        this.campaignAgents = resp.data;
        return resp.data;
      } catch (err) {
        return [];
      }
    }
  }
});