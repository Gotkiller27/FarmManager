<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCampaignStore } from '@/stores/campaignStore';
import { storeToRefs } from 'pinia';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Activity, Plus, HeartPulse, Skull, Clock, ChevronRight } from 'lucide-vue-next';
import AddHealthModal from './AddHealthModal.vue';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps(['campaignId']);
const campaignStore = useCampaignStore();
const { healthStats, healthHistory } = storeToRefs(campaignStore);
const isModalOpen = ref(false);

// Récupération des statistiques pour le graphique
const fetchStats = async () => {
  await campaignStore.fetchHealthStats(props.campaignId);
};

// Récupération de l'historique des soins
const fetchHistory = async () => {
  await campaignStore.fetchHealthHistory(props.campaignId);
};

const refreshAll = () => {
  fetchStats();
  fetchHistory();
};

// Configuration du graphique rond
const chartData = computed(() => ({
  labels: ['Vivants', 'Malades', 'Décédés'],
  datasets: [{
    data: [healthStats.value.vivant, healthStats.value.malade, healthStats.value.mort],
    backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
    hoverOffset: 10,
    borderWidth: 0
  }]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      position: 'bottom', 
      labels: { usePointStyle: true, font: { weight: 'bold', size: 11 } } 
    }
  }
};

onMounted(refreshAll);
</script>

<template>
  <div class="p-3 sm:p-4 md:p-6 space-y-6 sm:space-y-8 bg-[#fdfdfd]">
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
      <div>
        <h2 class="text-lg sm:text-2xl font-bold text-[#065f46]">Suivi Sanitaire</h2>
        <p class="text-green-600/60 text-xs sm:text-sm font-medium">État de santé et interventions médicales</p>
      </div>
      <button @click="isModalOpen = true" class="w-full sm:w-auto bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-3 rounded-lg sm:rounded-xl font-bold flex items-center justify-center sm:justify-start gap-2 shadow-lg transition-all text-sm sm:text-base">
        <Plus class="w-5 h-5" /> Enregistrer un Soin / Décès
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center">
        <h3 class="font-bold text-slate-800 mb-6 uppercase text-[10px] tracking-widest text-gray-400">Répartition du lot</h3>
        <div class="w-full h-64">
          <Doughnut :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <div class="lg:col-span-2 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
            <div class="bg-orange-100 p-4 rounded-2xl text-orange-600"><Activity /></div>
            <div>
              <p class="text-gray-400 text-[10px] font-bold uppercase">Sujets Malades</p>
              <p class="text-3xl font-black text-slate-800">{{ healthStats.malade }}</p>
            </div>
          </div>
          <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4 text-red-600">
            <div class="bg-red-100 p-4 rounded-2xl text-red-600"><Skull /></div>
            <div>
              <p class="text-red-400 text-[10px] font-bold uppercase">Taux de Mortalité</p>
              <p class="text-3xl font-black">
                {{ ((healthStats.mort / (healthStats.vivant + healthStats.mort + healthStats.malade || 1)) * 100).toFixed(1) }}%
              </p>
            </div>
          </div>
        </div>

        <div class="bg-[#065f46] p-6 rounded-[2rem] text-white flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="bg-white/10 p-3 rounded-xl"><HeartPulse class="w-6 h-6" /></div>
            <div>
              <p class="font-bold text-sm sm:text-base">Programme Prophylactique</p>
              <p class="text-[10px] sm:text-xs text-white/60 text-pretty">Assurez-vous que tous les vaccins sont à jour.</p>
            </div>
          </div>
          <ChevronRight class="text-white/40" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-50 flex justify-between items-center">
        <div class="flex items-center gap-2">
           <Clock class="w-5 h-5 text-[#065f46]" />
           <h3 class="font-bold text-slate-800">Dernières Interventions</h3>
        </div>
        <span class="text-[10px] bg-gray-100 px-3 py-1 rounded-full font-bold text-gray-400 uppercase">Historique récent</span>
      </div>

      <div class="p-2 space-y-1">
        <div v-for="event in healthHistory" :key="event.id" 
          class="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
          
          <div class="flex items-center gap-4">
            <div :class="{
              'bg-blue-100 text-blue-600': event.type_acte === 'vaccin',
              'bg-orange-100 text-orange-600': event.type_acte === 'traitement',
              'bg-red-100 text-red-600': event.type_acte === 'deces',
              'bg-gray-100 text-gray-600': event.type_acte === 'observation'
            }" class="p-3 rounded-xl transition-transform group-hover:scale-110">
              <Skull v-if="event.type_acte === 'deces'" class="w-5 h-5" />
              <HeartPulse v-else class="w-5 h-5" />
            </div>

            <div>
              <p class="font-bold text-slate-800 capitalize flex items-center gap-2 text-sm sm:text-base">
                {{ event.nom_produit || event.type_acte }}
                <span class="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                  {{ new Date(event.date_acte).toLocaleDateString() }}
                </span>
              </p>
              <p class="text-[10px] sm:text-xs text-gray-500">
                Sujet : <span class="font-mono font-bold text-[#16a34a]">{{ event.qr_code_token?.split('-').pop() || 'LOT' }}</span>
                <span v-if="event.notes" class="ml-2 italic text-gray-400 hidden sm:inline">• {{ event.notes }}</span>
              </p>
            </div>
          </div>

          <div class="text-right">
            <span class="text-[10px] font-black uppercase px-3 py-1.5 rounded-xl bg-white border border-gray-100 shadow-sm text-gray-500">
              {{ event.type_acte }}
            </span>
          </div>
        </div>

        <div v-if="healthHistory.length === 0" class="text-center py-12">
          <Activity class="w-12 h-12 text-gray-100 mx-auto mb-2" />
          <p class="text-gray-400 text-sm italic">Aucun acte médical enregistré pour le moment.</p>
        </div>
      </div>
    </div>

    <AddHealthModal 
      :isOpen="isModalOpen" 
      :campaignId="campaignId"
      @close="isModalOpen = false"
      @refresh="refreshAll"
    />
  </div>
</template>

<style scoped>
.group:hover {
  cursor: default;
}
</style>