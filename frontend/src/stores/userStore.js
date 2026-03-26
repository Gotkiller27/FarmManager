import { defineStore } from 'pinia';
import api from '../services/api.js'; // Import de ton instance axios configurée

export const useUserStore = defineStore('userStore', {
  // --- ÉTAT (DATA) ---
  state: () => ({
    users: [],
    loading: false,
    error: null,
    editingUser: null, // Pour suivre l'utilisateur en cours de modification
  }),

  getters: {
    // Ce getter accepte un argument 'roleName'
    usersByRole: (state) => {
      return (roleName) => state.users.filter(user => user.role === roleName);
    },

    //  Compteur dynamique pour les statistiques
    countByRole: (state) => {
      return (roleName) => state.users.filter(user => user.role === roleName).length;
    }
  },

  // --- ACTIONS (MÉTHODES) ---
  actions: {
    // 1. Récupérer tous les utilisateurs
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await api.get('/users/getAll');
        this.users = response.data.users;
      } catch (err) {
        this.error = "Erreur lors du chargement des utilisateurs";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    // 2. Ajouter un utilisateur
   async addUser(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      // Correction ici : on accède à .user car ton back renvoie { message, user }
      this.users.push(response.data.user); 
      return true;
    } catch (err) {
      this.error = "Impossible d'ajouter l'utilisateur";
      return false;
    }
  },

    // 3. Mettre à jour un utilisateur
    async updateUser(id, userData) {
      try {
        const response = await api.put(`/users/${id}`, userData);
        // On cherche l'index dans notre tableau local pour le mettre à jour sans recharger la page
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
          this.users[index] = response.data.user;
        }
        return true;
      } catch (err) {
        this.error = "Échec de la mise à jour";
        return false;
      }
    },

    // 4. Supprimer un utilisateur
    async deleteUser(id) {
      try {
        await api.delete(`/users/${id}`);
        // On filtre le tableau local pour retirer l'utilisateur immédiatement
        this.users = this.users.filter(u => u.id !== id);
      } catch (err) {
        this.error = "Erreur lors de la suppression";
      }
    }
  }
});