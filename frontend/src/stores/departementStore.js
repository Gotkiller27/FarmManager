import { defineStore } from 'pinia';
import api from '@/services/api.js';

export const useDepartmentStore = defineStore('departmentStore', {
  state: () => ({
    loading: false,
    error: null,
    currentGerant: null,
    allGerants: []
  }),

  actions: {
    // 1. Récupérer tous les gérants pour les menus déroulants
    async fetchAllGerants() {
      this.loading = true;
      try {
        const resp = await api.get('/departments/gerants'); 
        this.allGerants = resp.data;
        return resp.data;
      } catch (err) {
        this.error = "Erreur lors du chargement des gérants";
        return [];
      } finally {
        this.loading = false;
      }
    },

    // 2. Assigner un gérant à un département (Upsert)
    async assignGerantToDept(payload) {
      this.loading = true;
      try {
        const resp = await api.post('/departments/assign-gerant', payload);
        return resp.data;
      } catch (err) {
        this.error = "Erreur lors de l'assignation";
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 3. Récupérer le gérant actuel d'un département
    async fetchCurrentDeptGerant(departmentId) {
      this.loading = true;
      try {
        const resp = await api.get(`/departments/${departmentId}/gerant`);
        this.currentGerant = resp.data;
        return resp.data;
      } catch (err) {
        this.error = "Erreur lors de la récupération du gérant";
        return null;
      } finally {
        this.loading = false;
      }
    }
  }
});