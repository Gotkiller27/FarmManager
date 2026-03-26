<script setup>
import { ref, onMounted } from 'vue';
import { 
  TrendingUp, Users, Bird, AlertTriangle, 
  DollarSign, ArrowUpRight, ArrowDownRight, Activity 
} from 'lucide-vue-next';

// On imagine que tu as des stores pour les stats globales
const stats = ref({
  totalRevenue: "2,500,000",
  totalSujets: 4500,
  activeAgents: 12,
  mortaliteTaux: "2.4%"
});

const recentAlerts = ref([
  { id: 1, message: "Pic de chaleur - Bâtiment A", severity: "high", time: "10 min" },
  { id: 2, message: "Stock aliment faible (Poulets)", severity: "medium", time: "1h" },
]);
</script>

<template>
  <div class="p-6 space-y-8 bg-[#f8fafc] min-h-screen">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-[#065f46]">Tableau de Bord Gérant</h1>
        <p class="text-gray-500 font-bold uppercase text-[10px] tracking-widest">AgriManage • Vue d'ensemble</p>
      </div>
      <div class="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
        <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
          <Activity class="w-5 h-5" />
        </div>
        <span class="text-sm font-black text-gray-700">Système Opérationnel</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="(val, label) in { 'Chiffre d\'Affaire': stats.totalRevenue + ' FCFA', 'Sujets Actuels': stats.totalSujets, 'Agents Actifs': stats.activeAgents, 'Taux Mortalité': stats.mortaliteTaux }" 
           class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
        <p class="text-[10px] font-black text-gray-400 uppercase mb-2">{{ label }}</p>
        <h3 class="text-2xl font-black text-gray-900">{{ val }}</h3>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-xl font-black text-[#065f46]">Campagnes en cours</h2>
            <button class="text-[10px] font-black text-green-600 uppercase hover:underline">Voir tout</button>
          </div>
          
          <div class="space-y-4">
            <div v-for="i in 3" class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-green-200 transition-all">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Bird class="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <h4 class="font-black text-gray-800">Lot Poulets de chair #42</h4>
                  <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Département Volaille</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-black text-gray-900">85%</div>
                <div class="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                  <div class="bg-[#16a34a] h-full w-[85%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-8">
        <div class="bg-[#fef2f2] rounded-[2.5rem] p-8 border border-red-100">
          <h2 class="text-lg font-black text-red-700 flex items-center gap-2 mb-6">
            <AlertTriangle class="w-5 h-5" /> Alertes Critiques
          </h2>
          <div class="space-y-4">
            <div v-for="alert in recentAlerts" class="bg-white/60 p-4 rounded-2xl flex justify-between items-start">
              <p class="text-xs font-bold text-gray-800">{{ alert.message }}</p>
              <span class="text-[9px] font-black text-red-400 uppercase whitespace-nowrap">{{ alert.time }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
          <h2 class="text-lg font-black text-[#065f46] mb-6">Répartition Quotas</h2>
          <div class="space-y-4">
             <div v-for="i in 2" class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-[10px] font-black text-green-700">M</div>
                  <span class="text-xs font-bold text-gray-700">Agent Marc</span>
                </div>
                <span class="text-xs font-black text-gray-400">450 / 500 sujets</span>
             </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Ajoute ici tes effets de glassmorphism si tu veux un look plus futuriste */
</style>