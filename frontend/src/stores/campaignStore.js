import { defineStore } from 'pinia';
import api from '@/services/api.js';

/** * EXPORT : useCampaignStore
 * Ce store gère l'état global des campagnes, incluant les sujets, la santé, 
 * l'alimentation et la comptabilité financière.
 */
export const useCampaignStore = defineStore('campaignStore', {
  /**
   * STATE : Définition des données réactives
   */
  state: () => ({
    // Données de base des campagnes
    campaigns: [],
    myCampaigns: [], // AJOUTÉ : Pour stocker les campagnes spécifiques à l'agent
    currentCampaign: null,
    campaign: null,
    
    // Données relatives aux sujets (animaux)
    sujets: [],
    sujet: null,
    
    // Historique et statistiques de santé (mortalité, maladies)
    healthHistory: [],
    healthStats: { vivant: 0, mort: 0, malade: 0 },
    
    // Suivi de l'alimentation (consommation et graphiques)
    feedingHistory: [],
    feedings: [],
    feedingStats: { total_kg: 0, total_cout: 0, cout_moyen_kg: 0 },
    feedingChart: { labels: [], datasets: [] },
    
    // Gestion des ventes et résumés financiers
    ventes: [],
    salesSummary: { recettes: 0, charges: 0, benefice: 0 },
    expenses: [],
    financeSummary: { recettes: 0, charges: 0, benefice: 0 },
    finances: null,
    financeChart: [],
    agentStats: { nb_missions: 0, total_morts: 0, total_sujets: 0, distributions_jour: 0 },
    // États de l'interface utilisateur
    loading: false,
    error: null
  }),

  getters: {
    // Filtre les éléments dont le statut est "En cours"
    activeCampaigns: (state) => {
      return state.campaigns.filter(item => item.statut === 'en_cours');
    },

    // Optionnel : Compter le nombre de campagnes actives pour le badge du dashboard
    activeCount: (state) => {
      return state.campaigns.filter(item => item.statut === 'en_cours').length;
    }
  },

  /**
   * ACTIONS : Méthodes de manipulation des données et appels API
   */
  actions: {
    /** 1. Gestion des erreurs internes du store */
    setError(message) {
      this.error = message;
      console.error('[campaignStore]', message);
    },

    /** 2. Réinitialisation du message d'erreur */
    clearError() {
      this.error = null;
    },

    /** 3. Récupération des campagnes par département */
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

    /** 4. Création d'une nouvelle campagne */
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

    /** 5. Récupération des détails d'une campagne spécifique */
    async fetchCampaignById(campaignId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}`);
        this.currentCampaign = resp.data;
        this.campaign = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Campagne introuvable');
        this.currentCampaign = null;
        this.campaign = null;
        return null;
      } finally {
        this.loading = false;
      }
    },

    /** 6. Récupération de la liste des sujets d'une campagne */
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

    /** 7. Récupération d'un sujet précis par son identifiant */
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

    /** 8. Récupération de l'historique de santé (global ou par sujet) */
    async fetchHealthHistory(campaignId, subjectId) {
      this.loading = true;
      this.clearError();
      try {
        const params = subjectId ? { subjectId } : {};
        const resp = await api.get(`/campaigns/${campaignId}/health-history`, { params });
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

    /** 9. Récupération des compteurs de santé (vivants, morts, malades) */
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

    /** 10. Récupération des distributions alimentaires */
    async fetchFeedings(campaignId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}/feedings`);
        this.feedingHistory = resp.data;
        this.feedings = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Impossible de charger les distributions');
        this.feedingHistory = [];
        this.feedings = [];
        return [];
      } finally {
        this.loading = false;
      }
    },

    /** 11. Récupération de l'historique d'alimentation */
    async fetchFeedingHistory(campaignId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}/feedings`);
        this.feedingHistory = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Impossible de charger l\'historique d\'alimentation');
        this.feedingHistory = [];
        return [];
      } finally {
        this.loading = false;
      }
    },

    /** 12. Récupération des statistiques globales d'alimentation */
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

    /** 13. Récupération des données formatées pour le graphique d'alimentation */
    async fetchFeedingChart(campaignId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}/feeding-chart`);
        this.feedingChart = {
          labels: resp.data.map(item => item.label),
          datasets: [{
            label: 'Consommation (kg)',
            backgroundColor: '#16a34a',
            borderRadius: 8,
            data: resp.data.map(item => item.total_day_kg)
          }]
        };
        return this.feedingChart;
      } catch (err) {
        this.setError('Impossible de charger le graphique alimentation');
        this.feedingChart = null;
        return null;
      } finally {
        this.loading = false;
      }
    },

    /** 14. Récupération de l'historique des ventes */
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

    /** 15. Récupération du résumé des ventes (recettes, etc.) */
    async fetchSalesSummary(campaignId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}/financial-summary`);
        this.salesSummary = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Impossible de charger le résumé des ventes');
        this.salesSummary = null;
        return null;
      } finally {
        this.loading = false;
      }
    },

    /** 16. Récupération du bilan financier complet */
    async fetchFinancialSummary(campaignId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}/financial-summary`);
        this.financeSummary = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Impossible de charger le résumé financier');
        this.financeSummary = null;
        return null;
      } finally {
        this.loading = false;
      }
    },

    /** 17. Alias pour la récupération du résumé financier */
    async fetchFinanceSummary(campaignId) {
      return this.fetchFinancialSummary(campaignId);
    },

    /** 18. Récupération de la liste des dépenses */
    async fetchExpenses(campaignId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}/expenses`);
        this.expenses = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Impossible de charger les dépenses');
        this.expenses = [];
        return [];
      } finally {
        this.loading = false;
      }
    },

    /** 19. Récupération des données pour le graphique financier */
    async fetchFinanceChart(campaignId) {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get(`/campaigns/${campaignId}/financial-chart`);
        this.financeChart = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Impossible de charger le graphique financier');
        this.financeChart = [];
        return [];
      } finally {
        this.loading = false;
      }
    },

    /** 20. Ajout massif (batch) de sujets à une campagne */
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

    /** 21. Enregistrement d'un nouvel événement de santé */
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

    /** 22. Enregistrement d'une nouvelle distribution de nourriture */
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

    /** 23. Enregistrement d'une nouvelle vente */
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
    },

    /** 24. AJOUTÉ : Récupération des campagnes assignées à l'agent connecté */
    async fetchMyCampaigns() {
      this.loading = true;
      this.clearError();
      try {
        const resp = await api.get('/campaigns/my-campaigns');
        this.myCampaigns = resp.data;
        return resp.data;
      } catch (err) {
        this.setError('Impossible de charger vos missions personnelles');
        this.myCampaigns = [];
        return [];
      } finally {
        this.loading = false;
      }
    },
    
    async fetchAgentGlobalStats() {
  try {
    const resp = await api.get('/campaigns/agent/global-stats');
    this.agentStats = resp.data;
  } catch (err) {
    console.error("Erreur stats agent", err);
  }
}
  }
});