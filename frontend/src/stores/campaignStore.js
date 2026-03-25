import { defineStore } from 'pinia';
import api from '@/services/api.js';

export const useCampaignStore = defineStore('campaignStore', {
  state: () => ({
    campaigns: [],
    campaign: null,
    sujets: [],
    sujet: null,
    healthHistory: [],
    healthStats: null,
    feedings: [],
    feedingStats: null,
    feedingChart: [],
    ventes: [],
    financialSummary: null,
    financialChart: [],
    loading: false,
    error: null
  }),

  actions: {
    setError(message) {
      this.error = message;
      console.error('[campaignStore]', message);
    },

    clearError() {
      this.error = null;
    },

    async fetchDepartmentCampaigns(departmentId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/department/${departmentId}`);
        this.campaigns = resp.data;
      } catch (err) {
        this.setError('Impossible de charger les campagnes du département');
      } finally {
        this.loading = false;
      }
    },

    async createCampaign(payload) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.post('/campaigns', payload);
        if (resp.data) {
          this.campaigns.unshift(resp.data);
        }
        return resp.data;
      } catch (err) {
        this.setError('Échec de création de la campagne');
        return null;
      } finally {
        this.loading = false;
      }
    },

    async fetchCampaignById(campaignId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}`);
        this.campaign = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Campagne introuvable');
        this.campaign = null;
        return null;
      } finally {
        this.loading = false;
      }
    },

    async fetchSujets(campaignId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}/sujets`);
        this.sujets = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Impossible de charger les sujets');
        this.sujets = [];
        return [];
      } finally {
        this.loading = false;
      }
    },

    async fetchSujetById(campaignId, subjectId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}/sujets/${subjectId}`);
        this.sujet = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Sujet introuvable');
        this.sujet = null;
        return null;
      } finally {
        this.loading = false;
      }
    },

    async fetchHealthHistory(campaignId, subjectId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}/health-history`, { params: { subjectId } });
        this.healthHistory = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Impossible de charger l\'historique de santé');
        this.healthHistory = [];
        return [];
      } finally {
        this.loading = false;
      }
    },

    async fetchHealthStats(campaignId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}/health-stats`);
        this.healthStats = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Impossible de charger les statistiques santé');
        this.healthStats = null;
        return null;
      } finally {
        this.loading = false;
      }
    },

    async fetchFeedings(campaignId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}/feedings`);
        this.feedings = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Impossible de charger les distributions');
        this.feedings = [];
        return [];
      } finally {
        this.loading = false;
      }
    },

    async fetchFeedingStats(campaignId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}/feeding-stats`);
        this.feedingStats = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Impossible de charger les statistiques alimentation');
        this.feedingStats = null;
        return null;
      } finally {
        this.loading = false;
      }
    },

    async fetchFeedingChart(campaignId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}/feeding-chart`);
        this.feedingChart = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Impossible de charger le graphique alimentation');
        this.feedingChart = [];
        return [];
      } finally {
        this.loading = false;
      }
    },

    async fetchVentes(campaignId, subjectId = null) {
      this.loading = true;
      this.clearError();
      try {
        const params = subjectId ? { subjectId } : {};
        const resp = await api.get(`/campaigns/${campaignId}/ventes`, { params });
        this.ventes = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Impossible de charger les ventes');
        this.ventes = [];
        return [];
      } finally {
        this.loading = false;
      }
    },

    async fetchFinancialSummary(campaignId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}/financial-summary`);
        this.financialSummary = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Impossible de charger le résumé financier');
        this.financialSummary = null;
        return null;
      } finally {
        this.loading = false;
      }
    },

    async fetchFinancialChart(campaignId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}/financial-chart`);
        this.financialChart = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Impossible de charger le graphique financier');
        this.financialChart = [];
        return [];
      } finally {
        this.loading = false;
      }
    },

    async addSujetBatch(payload) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.post('/campaigns/sujets/batch', payload);
        return resp.data;
      } catch (err) {
        this.setError('Impossible de générer les sujets en batch');
        return null;
      } finally {
        this.loading = false;
      }
    },

    async addHealthRecord(payload) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.post('/campaigns/health-records', payload);
        return resp.data;
      } catch (err) {
        this.setError('Impossible d\'enregistrer le soin santé');
        return null;
      } finally {
        this.loading = false;
      }
    },

    async addFeeding(payload) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.post('/campaigns/feeding', payload);
        return resp.data;
      } catch (err) {
        this.setError('Impossible d\'enregistrer la distribution');
        return null;
      } finally {
        this.loading = false;
      }
    },

    async addVente(campaignId, payload) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.post(`/campaigns/${campaignId}/ventes`, payload);
        return resp.data;
      } catch (err) {
        this.setError('Impossible d\'enregistrer la vente');
        return null;
      } finally {
        this.loading = false;
      }
    }
  }
});