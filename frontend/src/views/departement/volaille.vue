<script setup>
import { ref, onMounted, reactive } from 'vue';
import { Plus, Users, Calendar, TrendingUp, X, UserPlus } from 'lucide-vue-next';
import { useToastStore } from '@/stores/toast'
import { useCampaignStore } from '@/stores/campaignStore'
// Import du nouveau store pour les départements
import { useDepartmentStore } from '@/stores/departementStore';

const toastStore = useToastStore();
const campaignStore = useCampaignStore();
const departmentStore = useDepartmentStore();

// ÉTATS
const loading = ref(true);
const showModal = ref(false); 
const showAssignModal = ref(false); 
const isSubmitting = ref(false);
const isAssigning = ref(false);

// DONNÉES GÉRANTS
const listGerants = ref([]);
const selectedGerantId = ref(null);
const currentGerant = ref(null); 

// FORMULAIRE RÉACTIF (Campagne)
const form = reactive({
  nom: '',
  date_debut: '',
  date_fin_prevue: '',
  budget: null,
  gerant_id: null, 
  departement_id: 1 // Volaille
});

const getStatusColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-700';
  switch (status.toLowerCase()) {
    case 'en_cours': case 'en cours': return 'bg-green-100 text-green-700';
    case 'terminé': return 'bg-blue-100 text-blue-700';
    case 'en préparation': return 'bg-yellow-100 text-yellow-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

// RÉCUPÉRER LES GÉRANTS (Via le DepartmentStore)
const fetchGerants = async () => {
  try {
    const data = await departmentStore.fetchAllGerants();
    listGerants.value = data;
  } catch (err) {
    console.error("Erreur chargement gérants:", err);
  }
};

// RÉCUPÉRER LE GÉRANT ACTUEL DU DÉPARTEMENT
const fetchCurrentDeptGerant = async () => {
  try {
    const data = await departmentStore.fetchCurrentDeptGerant(1); // 1 = Volaille
    if (data) {
      currentGerant.value = data;
      selectedGerantId.value = data.user_id;
      form.gerant_id = data.user_id; 
    }
  } catch (err) {
    console.error("Erreur gérant actuel:", err);
  }
};

// RÉCUPÉRER LES CAMPAGNES
const fetchCampaigns = async () => {
  try {
    loading.value = true;
    await campaignStore.fetchDepartmentCampaigns(1);
  } catch (err) {
    console.error("Erreur API:", err);
  } finally {
    loading.value = false;
  }
};

// SOUMETTRE L'ASSIGNATION
const submitAssignation = async () => {
  if (!selectedGerantId.value) return;
  isAssigning.value = true;
  try {
    const res = await departmentStore.assignGerantToDept({
      departement_id: 1,
      gerant_id: selectedGerantId.value
    });
    
    if (res) {
      toastStore.success("Gérant assigné avec succès.");
      showAssignModal.value = false;
      await fetchCurrentDeptGerant(); 
    }
  } catch (err) {
    toastStore.error("Erreur lors de l'assignation.");
  } finally {
    isAssigning.value = false;
  }
};

// SOUMETTRE LE FORMULAIRE CAMPAGNE
const submitForm = async () => {
  if (!currentGerant.value) {
    toastStore.error("Veuillez d'abord assigner un gérant au département.");
    return;
  }
  
  isSubmitting.value = true;
  form.gerant_id = currentGerant.value.user_id; 

  try {
    const success = await campaignStore.createCampaign(form);
    if (success) {
      toastStore.success("Campagne créée avec succès.");
      showModal.value = false; 
      form.nom = '';
      form.budget = null;
      form.date_debut = '';
      form.date_fin_prevue = '';
      await fetchCampaigns();
    }
  } catch (err) {
    toastStore.error("Erreur lors de la création de la campagne.");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  // Chargement en parallèle pour plus de rapidité
  await Promise.all([
    fetchCampaigns(),
    fetchGerants(),
    fetchCurrentDeptGerant()
  ]);
});
</script>

<template>
  <div class="space-y-4 sm:space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
      <div>
        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-[#065f46]">Département Volaille</h1>
        <p class="text-gray-500 text-xs sm:text-sm">Gérez vos cycles de production avicole</p>
      </div>
      
      <div class="flex gap-2 w-full sm:w-auto">
        <button @click="showAssignModal = true" class="flex-1 sm:flex-none flex items-center gap-2 bg-white border-2 border-[#16a34a] text-[#16a34a] px-4 py-2 rounded-xl hover:bg-green-50 transition-all font-semibold text-sm">
          <UserPlus class="w-4 h-4" />
          Assigner Gérant
        </button>

        <button @click="showModal = true" class="flex-1 sm:flex-none flex items-center gap-2 bg-[#16a34a] text-white px-4 py-2 rounded-xl hover:bg-[#15803d] transition-all shadow-sm font-semibold text-sm">
          <Plus class="w-4 h-4" />
          Nouvelle Campagne
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#16a34a]"></div>
    </div>

    <div v-if="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      <div v-for="camp in campaignStore.campaigns" :key="camp.id" 
           class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1"
           @click="$router.push(`/layout-principale/campaign/${camp.id}`)">
        
        <div class="flex justify-between items-start mb-4">
          <span :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', getStatusColor(camp.statut)]">
            {{ camp.statut }}
          </span>
          <TrendingUp class="w-5 h-5 text-gray-300" />
        </div>

        <h3 class="text-lg font-bold text-gray-900 mb-3">{{ camp.nom }}</h3>
        
        <div class="space-y-3 text-sm text-[#64748b]">
          <div class="flex items-center gap-2">
            <Calendar class="w-4 h-4 text-gray-400" />
            Lancée le : {{ camp.date_debut ? new Date(camp.date_debut).toLocaleDateString() : 'Non définie' }}
          </div>
          <div class="flex items-center gap-2">
            <Users class="w-4 h-4 text-gray-400" />
            {{ camp.nb_agents || 0 }} agents assignés
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-50">
          <div class="flex justify-between text-[11px] mb-1.5">
            <span class="font-medium text-gray-500 uppercase">Utilisation Budget</span>
            <span class="font-bold text-[#16a34a]">
              {{ camp.budget > 0 ? Math.min(100, Math.round((camp.total_depenses/camp.budget)*100)) : 0 }}%
            </span>
          </div>
          <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div class="bg-[#16a34a] h-full transition-all duration-700 ease-out" 
                 :style="{ width: (camp.budget > 0 ? Math.min(100, (camp.total_depenses/camp.budget)*100) : 0) + '%' }">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAssignModal" class="fixed inset-0 bg-[#11261a]/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all">
        <div class="bg-[#f0fdf4] px-6 py-4 flex justify-between items-center border-b border-green-50">
          <h2 class="text-lg font-bold text-[#065f46]">Assigner un Responsable</h2>
          <button @click="showAssignModal = false" class="text-gray-400 hover:text-red-500 transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Choisir un gérant</label>
            <select v-model="selectedGerantId" class="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#16a34a]">
              <option :value="null" disabled>Sélectionner gérant...</option>
              <option v-for="g in listGerants" :key="g.user_id" :value="g.user_id">
                {{ g.nom || 'Gérant #' + g.user_id }} - {{ g.city }}
              </option>
            </select>
          </div>

          <div class="pt-2 flex gap-3">
            <button @click="showAssignModal = false" class="flex-1 py-3 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-colors">
              Annuler
            </button>
            <button @click="submitAssignation" :disabled="isAssigning || !selectedGerantId" class="flex-1 py-3 bg-[#16a34a] text-white rounded-xl font-bold hover:bg-[#15803d] disabled:opacity-50 transition-all">
              {{ isAssigning ? 'Traitement...' : 'Confirmer' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-[#11261a]/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div class="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all">
        <div class="bg-[#f0fdf4] px-6 py-4 flex justify-between items-center border-b border-green-50">
          <h2 class="text-lg font-bold text-[#065f46]">Nouvelle Campagne</h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-red-500 transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="submitForm" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Désignation</label>
            <input v-model="form.nom" type="text" required class="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#16a34a] focus:bg-white outline-none transition-all" placeholder="ex: Bande Poulets Avril 2026">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Date début</label>
              <input v-model="form.date_debut" type="date" required class="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#16a34a]">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Date fin prévue</label>
              <input v-model="form.date_fin_prevue" type="date" required class="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#16a34a]">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Budget prévisionnel (FCFA)</label>
            <input v-model="form.budget" type="number" required class="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#16a34a]" placeholder="Montant total">
          </div>

          <div class="pt-4 flex gap-3">
            <button type="button" @click="showModal = false" class="flex-1 py-3 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-colors">
              Annuler
            </button>
            <button type="submit" :disabled="isSubmitting" class="flex-1 py-3 bg-[#16a34a] text-white rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-[#15803d] disabled:opacity-50 transition-all">
              {{ isSubmitting ? 'Création...' : 'Lancer la bande' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>