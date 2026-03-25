<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/services/api';
import { Line } from 'vue-chartjs';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, 
  PointElement, LineElement, Title, Tooltip, Filler, Legend 
} from 'chart.js';
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-vue-next';

// Enregistrement des composants Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const props = defineProps(['campaignId']);
const expenses = ref([]);
const chartDataFromServer = ref([]);
const summary = ref({ recettes: 0, charges: 0, benefice: 0 });

const fetchData = async () => {
  if (!props.campaignId) return;
  try {
    const [expRes, sumRes, chartRes] = await Promise.all([
      api.get(`/campaigns/${props.campaignId}/expenses`),
      api.get(`/campaigns/${props.campaignId}/financial-summary`),
      api.get(`/campaigns/${props.campaignId}/financial-chart`) // Ta nouvelle route SQL
    ]);
    
    expenses.value = expRes.data;
    
    // Protection contre le bug du collage de texte (Number)
    summary.value = {
      recettes: Number(sumRes.data.recettes) || 0,
      charges: Number(sumRes.data.charges) || 0,
      benefice: Number(sumRes.data.benefice) || 0
    };
    
    chartDataFromServer.value = chartRes.data;
  } catch (err) {
    console.error("Erreur Finance:", err);
  }
};

// Configuration du Graphique
const chartConfig = computed(() => ({
  labels: chartDataFromServer.value.map(d => d.date),
  datasets: [
    {
      label: 'Recettes',
      data: chartDataFromServer.value.map(d => d.recettes),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 3
    },
    {
      label: 'Charges',
      data: chartDataFromServer.value.map(d => d.charges),
      borderColor: '#ef4444',
      backgroundColor: 'transparent',
      borderDash: [5, 5],
      tension: 0.4,
      borderWidth: 2
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { display: false },
    x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } }
  }
};

onMounted(fetchData);
</script>

<template>
  <div class="space-y-6 p-1">
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Recettes Totales</p>
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-black text-slate-800">{{ summary.recettes.toLocaleString() }} <small class="text-[10px]">FCFA</small></h3>
          <ArrowUpRight class="text-green-500 w-5 h-5" />
        </div>
      </div>

      <div class="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Charges Totales</p>
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-black text-slate-800">{{ summary.charges.toLocaleString() }} <small class="text-[10px]">FCFA</small></h3>
          <ArrowDownRight class="text-red-500 w-5 h-5" />
        </div>
      </div>

      <div :class="summary.benefice >= 0 ? 'bg-[#065f46]' : 'bg-red-600'" class="p-5 rounded-[2rem] shadow-lg text-white">
        <p class="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Bénéfice Net</p>
        <h3 class="text-2xl font-black">{{ summary.benefice.toLocaleString() }} <small class="text-[10px]">FCFA</small></h3>
      </div>
    </div>

    <div class="bg-[#0f172a] p-6 rounded-[2.5rem] shadow-xl border border-slate-800">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-white font-bold flex items-center gap-2 text-sm">
          <TrendingUp class="text-[#10b981] w-4 h-4" /> Flux de Trésorerie
        </h3>
        <div class="flex gap-4">
           <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#10b981]"></span> <span class="text-[10px] text-gray-400">Ventes</span></div>
           <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-red-500"></span> <span class="text-[10px] text-gray-400">Dépenses</span></div>
        </div>
      </div>
      <div class="h-[250px]">
        <Line :data="chartConfig" :options="chartOptions" />
      </div>
    </div>

    <div class="space-y-4">
      <div class="flex justify-between items-center px-2">
        <h3 class="font-bold text-slate-800 flex items-center gap-2">
          <Wallet class="w-4 h-4 text-green-600" /> Historique détaillé
        </h3>
        <button class="text-[10px] font-bold bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-100 hover:bg-green-600 hover:text-white transition-all">
          + NOUVELLE DÉPENSE
        </button>
      </div>

      <div class="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black">
            <tr>
              <th class="p-5">Libellé / Date</th>
              <th class="p-5">Catégorie</th>
              <th class="p-5 text-right">Montant</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="exp in expenses" :key="exp.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="p-5">
                <p class="font-bold text-slate-700">{{ exp.libelle }}</p>
                <p class="text-[10px] text-gray-400">{{ new Date(exp.date_depense).toLocaleDateString() }}</p>
              </td>
              <td class="p-5">
                <span class="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-tighter">
                  {{ exp.categorie }}
                </span>
              </td>
              <td class="p-5 font-black text-red-500 text-right">
                - {{ exp.montant.toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="expenses.length === 0" class="p-10 text-center text-gray-300 text-xs italic">
          Aucune dépense enregistrée pour le moment.
        </div>
      </div>
    </div>
  </div>
</template>