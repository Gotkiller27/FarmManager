<script setup>
import { ref, onMounted, computed } from 'vue';
import { 
  ChartBarIcon, 
  ExclamationTriangleIcon, 
  BeakerIcon, 
  ArrowTrendingUpIcon,
  ArchiveBoxIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline';

// Simulation des données du département du gérant
const stats = ref([
  { name: 'Production Hebdo', value: '1,250 kg', icon: ArrowTrendingUpIcon, trend: '+12%', status: 'up' },
  { name: 'Sujets Actifs', value: '4,800', icon: UserGroupIcon, trend: 'Stable', status: 'neutral' },
  { name: 'Stock Aliment', value: '12 sacs', icon: ArchiveBoxIcon, trend: '-3j restant', status: 'danger' },
  { name: 'Taux Survie', value: '98.2%', icon: ChartBarIcon, trend: '+0.5%', status: 'up' },
]);

const alertes = ref([
  { id: 1, message: "Stock d'aliment 'Croissance' critique en Zone B", severity: 'high', time: 'Il y a 2h' },
  { id: 2, message: "Vaccination prévue demain pour le Lot #A22", severity: 'medium', time: 'Il y a 5h' },
]);

const chargement = ref(true);

onMounted(() => {
  setTimeout(() => chargement.value = false, 600);
});
</script>

<template>
  <div class="p-8 bg-slate-50 min-h-screen">
    <header class="mb-10 flex justify-between items-end">
      <div>
        <h1 class="text-2xl font-light text-slate-800">Espace <span class="font-bold text-slate-900">Gestionnaire</span></h1>
        <p class="text-slate-500 text-sm">Suivi opérationnel de vos unités de production.</p>
      </div>
      <div class="text-right">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Date du jour</span>
        <p class="text-sm font-semibold text-slate-700">24 Mars 2026</p>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div v-for="stat in stats" :key="stat.name" class="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div class="p-2 bg-slate-50 rounded-lg text-slate-600">
            <component :is="stat.icon" class="h-5 w-5" />
          </div>
          <span :class="[
            'text-[10px] font-bold px-2 py-1 rounded-md uppercase',
            stat.status === 'danger' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
          ]">
            {{ stat.trend }}
          </span>
        </div>
        <p class="text-xs font-medium text-slate-500 uppercase tracking-wider">{{ stat.name }}</p>
        <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ stat.value }}</h3>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm">
          <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ExclamationTriangleIcon class="h-5 w-5 text-amber-500" />
            Alertes et Rappels
          </h3>
          <div class="space-y-4">
            <div v-for="alerte in alertes" :key="alerte.id" class="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div class="flex items-center gap-4">
                <div :class="alerte.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'" class="h-2 w-2 rounded-full"></div>
                <p class="text-sm font-medium text-slate-700">{{ alerte.message }}</p>
              </div>
              <span class="text-xs text-slate-400">{{ alerte.time }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button class="p-6 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex flex-col items-center gap-3">
            <BeakerIcon class="h-6 w-6" />
            <span class="font-bold text-sm">Nouvelle Saisie</span>
          </button>
          <button class="p-6 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all flex flex-col items-center gap-3">
            <ChartBarIcon class="h-6 w-6 text-slate-400" />
            <span class="font-bold text-sm">Rapport Hebdo</span>
          </button>
        </div>
      </div>

      <div class="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm h-fit">
        <h3 class="text-lg font-bold text-slate-800 mb-6">Équipe de terrain</h3>
        <div class="space-y-6">
          <div v-for="i in 3" :key="i" class="flex items-center gap-4">
            <div class="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
              <UserIcon class="h-5 w-5" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-slate-800">Agent #0{{i}}</p>
              <p class="text-xs text-slate-500">Dernière activité : 14:05</p>
            </div>
            <div class="h-2 w-2 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
        <button class="w-full mt-8 py-3 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
          Gérer l'équipe
        </button>
      </div>
    </div>
  </div>
</template>