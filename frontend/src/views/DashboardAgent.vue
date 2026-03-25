<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  ChartBarIcon, ExclamationTriangleIcon, BeakerIcon, 
  ArrowTrendingUpIcon, ArchiveBoxIcon, UserGroupIcon,
  EllipsisVerticalIcon, BellIcon, ArrowUpRightIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline';

import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// --- LOGIQUE DE L'HORLOGE TEMPS RÉEL ---
const currentTime = ref(new Date());
let timer;

const updateTime = () => {
  currentTime.value = new Date();
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date).replace('.', '').toUpperCase();
};

const formatTime = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
};

// --- CONFIGURATION GRAPHIQUE ---
const chartData = {
  labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  datasets: [{
    label: 'Performance',
    data: [1100, 1250, 1180, 1500, 1420, 1680, 1550],
    fill: true,
    borderColor: '#059669',
    backgroundColor: 'rgba(5, 150, 105, 0.05)',
    tension: 0.4,
    borderWidth: 2,
    pointRadius: 4,
    pointBackgroundColor: '#fff',
    pointHoverRadius: 8,
  }]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 2000, easing: 'easeOutQuart' },
  plugins: { legend: { display: false } },
  scales: { 
    y: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono' } } },
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } } 
  }
};

const stats = ref([
  { name: 'Capital Production', value: '1,250 kg', trend: '+12%', status: 'up', icon: ArrowTrendingUpIcon },
  { name: 'Actifs Vivants', value: '4,800', trend: 'Stable', status: 'neutral', icon: UserGroupIcon },
  { name: 'Réserve Aliment', value: '12 sacs', trend: '-15%', status: 'danger', icon: ArchiveBoxIcon },
  { name: 'Score Survie', value: '98.2%', trend: '+0.5%', status: 'up', icon: ChartBarIcon },
]);

const isLoaded = ref(false);

onMounted(() => {
  // Lancer l'horloge
  timer = setInterval(updateTime, 1000);
 
  setTimeout(() => isLoaded.value = true, 100);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-sans text-slate-900 overflow-x-hidden">
    
    <header 
      class="max-w-7xl mx-auto flex justify-between items-end mb-12 transition-all duration-1000 transform"
      :class="[isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0']"
    >
      <div>
        <div class="flex items-center gap-2 mb-2">
          <div class="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">{{ formatDate(currentTime) }}</span>
        </div>
        <!-- <h1 class="text-3xl font-black tracking-tight text-slate-900 italic">
          AVIS<span class="text-emerald-600">CAPITAL</span>
        </h1> -->
      </div>

      <div class="text-right hidden md:block">
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dernière mise à jour flux</p>
        <p class="text-sm font-mono font-bold text-slate-700 tabular-nums flex items-center justify-end gap-2">
          <span></span>
          <span class="text-emerald-500 animate-pulse">•</span>
          <span>{{ formatTime(currentTime) }}</span>
        </p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto space-y-10">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="(stat, index) in stats" 
          :key="stat.name"
          class="stat-card group bg-white p-7 rounded-[24px] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 cursor-pointer"
          :style="{ transitionDelay: `${index * 100}ms` }"
          :class="[isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0']"
        >
          <div class="flex justify-between items-start mb-8">
            <div class="p-3 bg-slate-50 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
              <component :is="stat.icon" class="h-6 w-6" />
            </div>
            <span :class="[
              'text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border',
              stat.status === 'danger' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            ]">
              {{ stat.trend }}
            </span>
          </div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{{ stat.name }}</p>
          <h3 class="text-3xl font-black text-slate-900 group-hover:scale-105 transition-transform duration-500 origin-left tabular-nums">{{ stat.value }}</h3>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div 
          class="lg:col-span-2 bg-white p-10 rounded-[32px] border border-slate-200/60 shadow-sm transition-all duration-1000 delay-500"
          :class="[isLoaded ? 'opacity-100' : 'opacity-0 translate-x-[-20px]']"
        >
          <div class="flex justify-between items-center mb-10">
            <div>
              <h3 class="text-xl font-black text-slate-900 tracking-tight">Analyse de Croissance</h3>
              <p class="text-sm text-slate-500 font-medium">Flux de performance hebdomadaire</p>
            </div>
            <div class="flex bg-slate-100 p-1 rounded-xl">
              <button class="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-900">Jour</button>
              <button class="px-4 py-2 bg-white shadow-sm rounded-lg text-xs font-bold text-emerald-600">Semaine</button>
            </div>
          </div>
          <div class="h-80">
            <Line v-if="isLoaded" :data="chartData" :options="chartOptions" />
          </div>
        </div>

        <div class="space-y-8">
          <div 
            class="bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl shadow-slate-300 relative overflow-hidden group transition-all duration-1000 delay-700"
            :class="[isLoaded ? 'opacity-100' : 'opacity-0 translate-x-[20px]']"
          >
            <div class="relative z-10">
              <h3 class="text-2xl font-bold mb-3 tracking-tight">Nouvel Entrant ?</h3>
              <p class="text-slate-400 text-sm mb-8 leading-relaxed">Enregistrez les flux de trésorerie ou les données de ponte immédiatement.</p>
              <button class="group/btn w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3">
                <BeakerIcon class="h-5 w-5 group-hover/btn:rotate-12 transition-transform" />
                Saisie Transactionnelle
              </button>
            </div>
            <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000"></div>
          </div>

          <div 
            class="bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm transition-all duration-1000 delay-800"
            :class="[isLoaded ? 'opacity-100' : 'opacity-0']"
          >
            <h3 class="font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
              Journal d'Audit
            </h3>
            <div class="space-y-4">
              <div v-for="i in 2" :key="i" class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-emerald-200 hover:bg-white transition-all cursor-pointer group">
                <div class="flex items-center gap-4">
                  <div class="h-2 w-2 rounded-full bg-emerald-500 group-hover:animate-ping"></div>
                  <p class="text-sm font-bold text-slate-700">Flux Lot #A2{{i}} validé</p>
                </div>
                <ChevronRightIcon class="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,800;1,800&family=JetBrains+Mono:wght@700&display=swap');

:deep(*) {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.font-mono {
  font-family: 'JetBrains Mono', monospace !important;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
}
</style>