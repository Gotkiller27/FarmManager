import { defineStore } from 'pinia';
import api from '@/services/api.js';

export const useAgentStore = defineStore('agentStore', {
  state: () => ({
    loading: false,
    allAgents: [],
    campaignAgents: [] // Contiendra désormais { user_id, nom, quota_initial, tel, etc. }
  }),

  actions: {
    // Récupérer tous les agents du système (pour le select)
    async fetchAllAgents() {
      this.loading = true;
      try {
        const resp = await api.get('/agentCampaign'); 
        this.allAgents = resp.data;
        return resp.data;
      } catch (err) {
        console.error("[AgentStore] Erreur fetchAllAgents", err);
        return [];
      } finally {
        this.loading = false;
      }
    },

    // Assigner un agent avec son quota
    // Le payload reçu sera : { campagne_id, agent_id, quota }
    async assignAgent(payload) {
      try {
        const resp = await api.post('/agentCampaign/assign', payload);
        return resp.data;
      } catch (err) {
        console.error("[AgentStore] Erreur assignAgent", err);
        throw err;
      }
    },

    // Récupérer les agents d'une campagne précise
    async fetchCampaignAgents(campagneId) {
      this.loading = true;
      try {
        const resp = await api.get(`/agentCampaign/campaign/${campagneId}`);
        // Ici, resp.data doit inclure la colonne quota_initial venant de ta jointure SQL
        this.campaignAgents = resp.data;
        return resp.data;
      } catch (err) {
        console.error("[AgentStore] Erreur fetchCampaignAgents", err);
        this.campaignAgents = [];
        return [];
      } finally {
        this.loading = false;
      }
    }
  }
});