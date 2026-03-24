<script setup>
import { ref, onMounted, reactive } from 'vue';
import api from '@/services/api.js';
// AJOUT DE L'ICÔNE X ICI POUR ÉVITER LE CRASH
import { 
  ShoppingCart, TrendingUp, DollarSign, 
  Scan, Plus, Clock, X, Loader2 
} from 'lucide-vue-next';

const props = defineProps(['campaignId']);
const sales = ref([]);
const summary = ref({ recettes: 0, charges: 0, benefice: 0, rentabilite: 0 });
const isModalOpen = ref(false);
const isSubmitting = ref(false); // Pour éviter les doubles clics

const form = reactive({
  type_vente: 'individuel',
  qr_token: '',
  poids_kg: '',
  prix_unitaire: '',
  client_nom: ''
});

// Récupération des données
const fetchSalesData = async () => {
  if (!props.campaignId) return;
  try {
    const [salesRes, summaryRes] = await Promise.all([
      api.get(`/campaigns/${props.campaignId}/ventes`),
      api.get(`/campaigns/${props.campaignId}/financial-summary`)
    ]);
    sales.value = salesRes.data;
    summary.value = summaryRes.data;
  } catch (err) {
    console.error("Erreur lors de la récupération des ventes:", err);
  }
};

// Soumission du formulaire
const submitVente = async () => {
  console.log("Tentative d'enregistrement de la vente...", form);
  isSubmitting.value = true;
  
  try {
    await api.post(`/campaigns/${props.campaignId}/ventes`, form);
    console.log("Vente enregistrée avec succès !");
    
    // Fermeture et Reset
    isModalOpen.value = false;
    form.qr_token = ''; 
    form.poids_kg = ''; 
    form.prix_unitaire = '';
    form.client_nom = '';
    
    // Rafraîchissement
    await fetchSalesData();
  } catch (err) {
    console.error("Erreur API Ventes:", err.response?.data || err.message);
    alert("Erreur : " + (err.response?.data?.message || "Impossible d'enregistrer la vente"));
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  console.log("ID Campagne reçu :", props.campaignId);
  fetchSalesData();
});
</script>

<template>
  <div class="p-6 space-y-8 bg-[#fdfdfd]">
    
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-[#065f46]">Gestion des Ventes</h2>
        <p class="text-green-600/60 text-sm font-medium">Sorties et rentabilité de la campagne</p>
      </div>
      <button @click="isModalOpen = true" class="bg-[#065f46] hover:bg-[#044e3a] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95">
        <Plus class="w-5 h-5" /> Enregistrer une Vente
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm text-slate-800">
        <div class="flex items-center gap-4 mb-2">
          <div class="bg-green-100 p-3 rounded-xl text-green-600"><DollarSign /></div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Chiffre d'Affaires</p>
        </div>
        <p class="text-3xl font-black">{{ (summary?.recettes || 0).toLocaleString() }} FCFA</p>
      </div>

      <div class="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm text-slate-800">
        <div class="flex items-center gap-4 mb-2">
          <div class="bg-red-100 p-3 rounded-xl text-red-600"><TrendingUp /></div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Charges</p>
        </div>
        <p class="text-3xl font-black">{{ (summary?.charges || 0).toLocaleString() }} FCFA</p>
      </div>

      <div :class="(summary?.benefice || 0) >= 0 ? 'bg-[#10b981]' : 'bg-red-500'" class="p-6 rounded-[2.5rem] text-white shadow-xl transform hover:scale-105 transition-transform">
        <div class="flex items-center gap-4 mb-2">
          <div class="bg-white/20 p-3 rounded-xl"><ShoppingCart /></div>
          <p class="text-[10px] font-bold text-white/70 uppercase tracking-widest">Bénéfice Net</p>
        </div>
        <p class="text-3xl font-black">{{ (summary?.benefice || 0).toLocaleString() }} FCFA</p>
        <p class="text-xs font-bold mt-1 opacity-80">Rentabilité: {{ summary?.rentabilite || 0 }}%</p>
      </div>
    </div>

    <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-50 flex items-center gap-2">
        <Clock class="w-5 h-5 text-[#065f46]" />
        <h3 class="font-bold text-slate-800">Historique des Sorties</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400">
              <th class="p-6">Date & Client</th>
              <th class="p-6">Sujet</th>
              <th class="p-6">Poids / Prix Unit.</th>
              <th class="p-6">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="sale in sales" :key="sale.id" class="group hover:bg-green-50/30 transition-colors">
              <td class="p-6">
                <p class="font-bold text-slate-800">{{ sale.client_nom || 'Client Anonyme' }}</p>
                <p class="text-[10px] text-gray-400">{{ new Date(sale.date_vente).toLocaleDateString() }}</p>
              </td>
              <td class="p-6 text-[10px] font-bold">
                <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  {{ sale.qr_code_token ? sale.qr_code_token.split('-').pop() : 'LOT' }}
                </span>
              </td>
              <td class="p-6 text-sm">
                <p class="font-medium text-slate-600">{{ sale.poids_kg }} kg</p>
                <p class="text-xs text-gray-400">{{ sale.prix_unitaire }} FCFA/kg</p>
              </td>
              <td class="p-6">
                <p class="font-black text-[#065f46]">{{ sale.prix_total.toLocaleString() }} FCFA</p>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="sales.length === 0" class="text-center py-20 text-gray-400 italic">
           Aucune vente enregistrée.
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div class="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl relative">
        <button @click="isModalOpen = false" class="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors">
          <X class="w-6 h-6" />
        </button>
        
        <h3 class="text-2xl font-black text-[#065f46] mb-6">Enregistrer une Vente</h3>
        
        <form @submit.prevent="submitVente" class="space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 text-left">Mode de vente</label>
            <select v-model="form.type_vente" class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-[#065f46] transition-all">
              <option value="individuel">Individuel (Scan QR Code)</option>
              <option value="lot">Vente en Lot (Groupe)</option>
            </select>
          </div>

          <div v-if="form.type_vente === 'individuel'">
            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 text-left">Token du Sujet</label>
            <div class="relative">
              <input v-model="form.qr_token" type="text" placeholder="Ex: AGRI-..." class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100">
              <Scan class="absolute right-4 top-4 text-gray-300 w-5 h-5" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 text-left">Poids Total (kg)</label>
              <input v-model.number="form.poids_kg" type="number" step="0.01" required class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100">
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 text-left">Prix au kg (FCFA)</label>
              <input v-model.number="form.prix_unitaire" type="number" required class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100">
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 text-left">Nom du Client</label>
            <input v-model="form.client_nom" type="text" class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100" placeholder="Ex: Restaurant Le Gourmet">
          </div>

          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="w-full bg-[#065f46] text-white py-4 rounded-2xl font-black shadow-lg hover:bg-[#044e3a] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
            <span v-else>
              Confirmer la Vente ({{ (form.poids_kg * form.prix_unitaire).toLocaleString() }} FCFA)
            </span>
          </button>
        </form>
      </div>
    </div>

  </div>
</template>