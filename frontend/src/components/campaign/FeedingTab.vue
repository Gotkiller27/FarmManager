<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api.js';
import FeedingChart from './FeedingChart.vue';
import AddFeedingModal from './AddFeedingModal.vue';
import { Utensils, TrendingUp, DollarSign, Plus } from 'lucide-vue-next';

const props = defineProps(['campaignId']);
const isModalOpen = ref(false);

// 1. État des données
const feedings = ref([]);
const stats = ref({
  total_kg: 0,
  total_cout: 0,
  cout_moyen_kg: 0
});

const dataChart = ref({
  labels: [],
  datasets: [{
    label: 'Consommation (kg)',
    backgroundColor: '#16a34a',
    borderRadius: 8,
    data: [] 
  }]
});

// 2. Fonctions de chargement
const loadStats = async () => {
  try {
    const { data } = await api.get(`/campaigns/${props.campaignId}/feeding-stats`);
    stats.value = data;
  } catch (err) { console.error("Erreur stats", err); }
};

const fetchChartData = async () => {
  try {
    const { data } = await api.get(`/campaigns/${props.campaignId}/feeding-chart`);
    dataChart.value = {
      labels: data.map(item => item.label),
      datasets: [{
        label: 'Consommation (kg)',
        backgroundColor: '#16a34a',
        borderRadius: 8,
        data: data.map(item => item.total_day_kg)
      }]
    };
  } catch (err) { console.error("Erreur graphique", err); }
};

const fetchHistory = async () => {
  try {
    const { data } = await api.get(`/campaigns/${props.campaignId}/feedings`);
    feedings.value = data;
  } catch (err) { console.error("Erreur historique", err); }
};

const loadAllData = () => {
  loadStats();
  fetchChartData();
  fetchHistory();
};

onMounted(loadAllData);
</script>

<template>
  <div class="p-4 space-y-8 bg-[#fdfdfd]">
    
    <div class="flex justify-between items-center">
       <div>
         <h2 class="text-2xl font-bold text-[#065f46]">Gestion de l'Alimentation</h2>
         <p class="text-green-600/60 text-sm font-medium">Suivi des rations et coûts alimentaires</p>
       </div>
       <button @click="isModalOpen = true" class="bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-100 transition-all">
         <Plus class="w-5 h-5" /> Enregistrer Distribution
       </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between">
        <div>
          <p class="text-gray-400 text-[10px] font-bold uppercase">Quantité Totale</p>
          <p class="text-2xl font-black text-slate-800">{{ stats.total_kg || 0 }} kg</p>
        </div>
        <Utensils class="text-green-500 w-5 h-5" />
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between">
        <div>
          <p class="text-gray-400 text-[10px] font-bold uppercase">Coût Total</p>
          <p class="text-2xl font-black text-slate-800">{{ Number(stats.total_cout).toLocaleString() }} F</p>
        </div>
        <TrendingUp class="text-green-500 w-5 h-5" />
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between text-blue-600 bg-blue-50/30">
        <div>
          <p class="text-blue-400 text-[10px] font-bold uppercase">Coût Moyen / Kg</p>
          <p class="text-2xl font-black text-blue-800">{{ Math.round(stats.cout_moyen_kg || 0) }} F</p>
        </div>
        <DollarSign class="w-5 h-5" />
      </div>
    </div>

    <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
      <h3 class="font-bold text-slate-800 mb-6">Consommation Journalière</h3>
      <FeedingChart v-if="dataChart.labels.length > 0" :chartData="dataChart" />
      <div v-else class="h-64 flex items-center justify-center text-gray-400 italic">
        Aucune donnée de consommation sur les 7 derniers jours
      </div>
    </div>

    <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-50"><h3 class="font-bold">Historique des Distributions</h3></div>
      <div class="p-6 space-y-4">
        <div v-for="item in feedings" :key="item.id" class="flex items-center justify-between bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          <div class="flex items-center gap-4">
            <div class="bg-[#16a34a] p-3 rounded-2xl text-white"><Utensils class="w-5 h-5" /></div>
            <div>
              <p class="font-bold text-slate-800">{{ item.nom_aliment || 'Aliment Standard' }}</p>
              <p class="text-[11px] text-gray-400">
                {{ new Date(item.date_distribution).toLocaleDateString() }} • {{ item.heure_distribution }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold text-slate-800">{{ item.quantite_kg }} kg</p>
            <p class="text-sm font-bold text-[#16a34a]">{{ Number(item.prix_total).toLocaleString() }} F</p>
          </div>
        </div>
        <div v-if="feedings.length === 0" class="text-center py-10 text-gray-400">
          Aucun enregistrement trouvé.
        </div>
      </div>
    </div>

    <AddFeedingModal 
      :isOpen="isModalOpen" 
      :campaignId="campaignId"
      @close="isModalOpen = false"
      @refresh="loadAllData"
    />

  </div>
</template>