<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { Plus, Users, Calendar, TrendingUp, X, UserPlus } from 'lucide-vue-next';
import { useToastStore } from '@/stores/toast'
import { useCampaignStore } from '@/stores/campaignStore'
// Import du nouveau store pour les départements
import { useDepartmentStore } from '@/stores/departementStore';
import { useAuthStore } from '@/stores/auth';

const toastStore = useToastStore();
const campaignStore = useCampaignStore();
const departmentStore = useDepartmentStore();
const authStore = useAuthStore();

// Vérifier si l'utilisateur est un gérant
const isGerant = computed(() => {
  const rawRole = (authStore.user?.role || '').toString();
  const normalized = rawRole
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
  const result = normalized === 'gerant';
  console.log('isGerant computed:', result, 'role:', rawRole, 'normalized:', normalized);
  return result;
});

// Vérifier si l'utilisateur est un administrateur
const isAdmin = computed(() => {
  const rawRole = (authStore.user?.role || '').toString();
  const normalized = rawRole
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
  return normalized === 'admin';
});

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
  departement_id: 3 // Bétail
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
    const data = await departmentStore.fetchCurrentDeptGerant(3); // 3 = Bétail
    if (data) {
      currentGerant.value = data;
      selectedGerantId.value = data.user_id;
      form.gerant_id = data.user_id;
    } else {
      currentGerant.value = null;
      selectedGerantId.value = null;
      form.gerant_id = null;
    }
  } catch (err) {
    console.error("Erreur gérant actuel:", err);
  }
};

// RÉCUPÉRER LES CAMPAGNES
const fetchCampaigns = async () => {
  try {
    loading.value = true;
    await campaignStore.fetchDepartmentCampaigns(3);
  } catch (err) {
    console.error("Erreur API:", err);
  } finally {
    loading.value = false;
  }
};

// SOUMETTRE L'ASSIGNATION
const submitAssignation = async () => {
  if (!isAdmin.value) {
    toastStore.error("Seul un administrateur peut assigner un gérant.");
    return;
  }
  if (!selectedGerantId.value) {
    toastStore.error("Veuillez sélectionner un gérant.");
    return;
  }
  isAssigning.value = true;
  try {
    const res = await departmentStore.assignGerantToDept({
      departement_id: 3,
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

// SOUMETTRE LE FORMULAIRE
const submitForm = async () => {
  // Vérifier d'abord si l'utilisateur est connecté
  if (!authStore.user) {
    toastStore.error("Vous devez être connecté pour créer une campagne.");
    return;
  }
  
  // Si l'utilisateur est un gérant, il peut créer des campagnes dans tous les départements
  if (!isGerant.value && !currentGerant.value) {
    toastStore.error("Veuillez d'abord assigner un gérant au département.");
    return;
  }

  if (isGerant.value) {
    currentGerant.value = { user_id: authStore.user?.id, nom: authStore.user?.first_name || '', city: authStore.user?.city || '' };
  }
  
  isSubmitting.value = true;
  // Si c'est un gérant connecté, utiliser son ID, sinon utiliser le gérant assigné au département
  form.gerant_id = isGerant.value ? authStore.user.id : currentGerant.value.user_id;
  form.departement_id = 3; // S'assurer que le département est correct
  
  try {
    await campaignStore.createCampaign(form);
    toastStore.success("Campagne créée avec succès.");
    showModal.value = false;

    // Reset du formulaire
    form.nom = '';
    form.budget = null;
    form.date_debut = '';
    form.date_fin_prevue = '';
    
    // Recharger les campagnes
    await fetchCampaigns();
  } catch (err) {
    console.error("Erreur lors de la création:", err);
    toastStore.error("Erreur lors de la création de la campagne.");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    fetchGerants(),
    fetchCurrentDeptGerant(),
    fetchCampaigns()
  ]);
});
</script>

<template>
  <div class="space-y-4 sm:space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
      <div>
        <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-[#065f46]">Département Bétail</h1>
        <p class="text-gray-500 text-xs sm:text-sm">Gérez vos cycles de production bovine</p>
      </div>
      
      <div class="flex gap-2 sm:gap-3">
        <button v-if="isAdmin" @click="showAssignModal = true" class="flex items-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:shadow-md font-semibold text-sm">
          <UserPlus class="w-4 h-4 sm:w-5 sm:h-5" />
          Assigner Gérant
        </button>
        <button @click="showModal = true" class="w-full sm:w-auto flex items-center gap-2 bg-[#16a34a] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-[#15803d] transition-all shadow-sm hover:shadow-md font-semibold text-sm">
          <Plus class="w-4 h-4 sm:w-5 sm:h-5" />
          Nouvelle Campagne
        </button>
      </div>
    </div>

    <!-- INFO GÉRANT ACTUEL - Masquée pour les gérants -->
    <div v-if="currentGerant && !isGerant" class="bg-blue-50 border border-blue-200 rounded-2xl p-4">
      <div class="flex items-center gap-3">
        <div class="bg-blue-100 p-2 rounded-lg">
          <Users class="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p class="text-sm font-bold text-blue-800">Gérant actuel</p>
          <p class="text-sm text-blue-600">{{ currentGerant.nom }} {{ currentGerant.prenoms }}</p>
        </div>
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

        <h3 class="font-bold text-slate-800 mb-2">{{ camp.nom }}</h3>

        <div class="space-y-2 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <Calendar class="w-4 h-4" />
            <span>Début: {{ camp.date_debut ? new Date(camp.date_debut).toLocaleDateString() : '...' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <TrendingUp class="w-4 h-4" />
            <span>Budget: {{ camp.budget ? camp.budget.toLocaleString() + ' FCFA' : '...' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL NOUVELLE CAMPAGNE -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div class="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative">
        <button @click="showModal = false" class="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <X class="w-6 h-6" />
        </button>

        <h3 class="text-2xl font-black text-[#065f46] mb-2">Nouvelle Campagne</h3>
        <p class="text-gray-400 text-sm mb-8">Créez une nouvelle campagne d'élevage bovin.</p>

        <form @submit.prevent="submitForm" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Nom de la campagne</label>
            <input v-model="form.nom" type="text" required
              class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-green-500 transition-all font-medium"
              placeholder="ex: Campagne Bovins 2024">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Date début</label>
              <input v-model="form.date_debut" type="date" required
                class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-green-500 transition-all font-medium">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Date fin prévue</label>
              <input v-model="form.date_fin_prevue" type="date"
                class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-green-500 transition-all font-medium">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Budget (FCFA)</label>
            <input v-model="form.budget" type="number" step="0.01"
              class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-green-500 transition-all font-medium"
              placeholder="ex: 10000000">
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Gérant assigné</label>
            <select v-model="form.gerant_id" required
              class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-green-500 transition-all font-medium">
              <option value="">Sélectionner un gérant</option>
              <option v-for="gerant in listGerants" :key="gerant.user_id" :value="gerant.user_id">
                {{ gerant.nom }} {{ gerant.prenoms }}
              </option>
            </select>
          </div>

          <button type="submit" :disabled="isSubmitting" class="w-full bg-[#16a34a] text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-[#15803d] active:scale-95 transition-all mt-4 disabled:opacity-50">
            {{ isSubmitting ? 'Création...' : 'Créer la campagne' }}
          </button>
        </form>
      </div>
    </div>

    <!-- MODAL ASSIGNATION GÉRANT -->
    <div v-if="showAssignModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div class="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative">
        <button @click="showAssignModal = false" class="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <X class="w-6 h-6" />
        </button>

        <h3 class="text-2xl font-black text-[#065f46] mb-2">Assigner un Gérant</h3>
        <p class="text-gray-400 text-sm mb-8">Sélectionnez le gérant pour le département Bétail.</p>

        <form @submit.prevent="submitAssignation" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Gérant</label>
            <select v-model="selectedGerantId" required
              class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-blue-500 transition-all font-medium">
              <option value="">Sélectionner un gérant</option>
              <option v-for="gerant in listGerants" :key="gerant.user_id" :value="gerant.user_id">
                {{ gerant.nom }} {{ gerant.prenoms }}
              </option>
            </select>
          </div>

          <button type="submit" :disabled="isAssigning" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all mt-4 disabled:opacity-50">
            {{ isAssigning ? 'Assignation...' : 'Assigner le gérant' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>