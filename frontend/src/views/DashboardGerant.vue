<script setup>
import { ref } from 'vue'
import { 
  TrendingUpIcon, 
  SkullIcon, 
  ActivityIcon, 
  PackageIcon, 
  AlertTriangleIcon,
  PlusIcon,
  ArrowUpRightIcon
} from 'lucide-vue-next'

import { useCampaignStore } from '@/stores/campaignStore'

const campaignStore = useCampaignStore()

// Données en dur pour la démo
const stats = [
  { name: 'Campagnes Actives', value: 12, icon: ActivityIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Sujets Totaux', value: '4,250', icon: TrendingUpIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { name: 'Taux Mortalité', value: '2.4%', icon: SkullIcon, color: 'text-red-600', bg: 'bg-red-50' },
  { name: 'Stock Aliments', value: '850 kg', icon: PackageIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
]

const activeCampaigns = [
  { id: 1, name: 'Brahma Mars 2026', dept: 'Volaille', progress: 65, subjects: 500, status: 'En cours' },
  { id: 2, name: 'Bovins Engraissement', dept: 'Bétail', progress: 30, subjects: 25, status: 'En cours' },
  { id: 3, name: 'Tilapia Bassin A', dept: 'Pisciculture', progress: 90, subjects: 1200, status: 'Fin de cycle' },
]

const alerts = [
  { id: 1, msg: 'Stock de vaccin Newcastle faible', type: 'warning' },
  { id: 2, msg: 'Pic de chaleur détecté - Bâtiment B', type: 'critical' },
]
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Tableau de Bord Gérant</h1>
          <p class="text-slate-500 text-sm font-medium">Ferme Alpha - Vue d'ensemble du 26 Mars 2026</p>
        </div>
        <button class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-100">
          <PlusIcon class="h-4 w-4" />
          Nouvelle Campagne
        </button>
      </div>

      <div v-if="alerts.length > 0" class="space-y-3">
        <div v-for="alert in alerts" :key="alert.id" 
             :class="alert.type === 'critical' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'"
             class="flex items-center gap-3 p-4 rounded-2xl border">
          <AlertTriangleIcon :class="alert.type === 'critical' ? 'text-red-600' : 'text-amber-600'" class="h-5 w-5" />
          <span :class="alert.type === 'critical' ? 'text-red-800' : 'text-amber-800'" class="text-sm font-semibold">
            {{ alert.msg }}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="stat in stats" :key="stat.name" class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div :class="[stat.bg, stat.color]" class="p-3 rounded-2xl">
              <component :is="stat.icon" class="h-6 w-6" />
            </div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global</span>
          </div>
          <p class="text-2xl font-black text-slate-900">{{ stat.value }}</p>
          <p class="text-sm font-medium text-slate-500">{{ stat.name }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 class="font-bold text-slate-900">Campagnes en cours</h3>
            <button class="text-emerald-600 text-sm font-bold hover:underline">Voir tout</button>
          </div>
          <div class="divide-y divide-slate-100">
            <div v-for="camp in activeCampaigns" :key="camp.id" class="p-6 hover:bg-slate-50 transition-colors">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h4 class="font-bold text-slate-800">{{ camp.name }}</h4>
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{{ camp.dept }} • {{ camp.subjects }} sujets</span>
                </div>
                <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase">{{ camp.status }}</span>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between text-xs font-bold text-slate-500">
                  <span>Progression cycle</span>
                  <span>{{ camp.progress }}%</span>
                </div>
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div :style="{ width: camp.progress + '%' }" class="bg-emerald-500 h-full rounded-full transition-all duration-1000"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">Trésorerie Campagnes</h3>
            <div class="space-y-1 mb-8">
              <p class="text-sm text-slate-400">Balance Totale Actuelle</p>
              <p class="text-4xl font-black">2.450.000 <span class="text-lg font-light text-slate-500">FCFA</span></p>
            </div>
            
            <div class="space-y-4">
              <div class="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <span class="text-sm text-slate-400">Dépenses (Aliments/Santé)</span>
                <span class="font-bold text-red-400">- 850k</span>
              </div>
              <div class="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <span class="text-sm text-slate-400">Ventes prévisionnelles</span>
                <span class="font-bold text-emerald-400">+ 4.2M</span>
              </div>
            </div>

            <button class="w-full mt-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
              Rapport Financier Complet
              <ArrowUpRightIcon class="h-4 w-4" />
            </button>
          </div>
          <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl"></div>
        </div>

      </div>
    </div>
  </div>
</template>