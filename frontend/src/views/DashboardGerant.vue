<script setup>
import { computed, onMounted } from 'vue'
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
import { useToastStore } from '@/stores/toast'
import Toast from '@/components/Toast.vue'

const campaignStore = useCampaignStore()
const toastStore = useToastStore()

// 1. On s'assure de charger les données au montage
onMounted(() => {
  campaignStore.fetchCampaigns()
})

// 2. Récupération des Getters réactifs
const activeCampaigns = computed(() => campaignStore.activeCampaigns)
const totalActive = computed(() => campaignStore.activeCount)

// 3. IMPORTANT : 'stats' doit être un computed pour réagir aux changements de 'totalActive'
const stats = computed(() => [
  { 
    name: 'Campagnes Actives', 
    value: totalActive.value, // Maintenant réactif !
    icon: ActivityIcon, 
    color: 'text-blue-600', 
    bg: 'bg-blue-50' 
  },
  { 
    name: 'Sujets Totaux', 
    value: '4,250', 
    icon: TrendingUpIcon, 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50' 
  },
  { 
    name: 'Taux Mortalité', 
    value: '2.4%', 
    icon: SkullIcon, 
    color: 'text-red-600', 
    bg: 'bg-red-50' 
  },
  { 
    name: 'Stock Aliments', 
    value: '850 kg', 
    icon: PackageIcon, 
    color: 'text-amber-600', 
    bg: 'bg-amber-50' 
  },
])

const alerts = [
  { id: 1, msg: 'Stock de vaccin Newcastle faible', type: 'warning' },
  { id: 2, msg: 'Pic de chaleur détecté - Bâtiment B', type: 'critical' },
]

const showAlertToast = (alert) => {
  toastStore.showToast({
    message: alert.msg,
    type: alert.type === 'critical' ? 'error' : 'warning',
  })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Tableau de Bord Gérant</h1>
          <p class="text-slate-500 text-sm font-medium">Vue d'ensemble de l'exploitation</p>
        </div>
        <button class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-100 active:scale-95">
          <PlusIcon class="h-4 w-4" />
          Nouvelle Campagne
        </button>
      </div>

      <div v-for="alert in alerts" :key="alert.id">
        <button @click="() => showAlertToast(alert)">Afficher l'alerte</button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="stat in stats" :key="stat.name" class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-hover hover:shadow-md">
          <div class="flex items-center justify-between mb-4">
            <div :class="[stat.bg, stat.color]" class="p-3 rounded-2xl">
              <component :is="stat.icon" class="h-6 w-6" />
            </div>
          </div>
          <p class="text-2xl font-black text-slate-900">{{ stat.value }}</p>
          <p class="text-sm font-medium text-slate-500">{{ stat.name }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h3 class="font-bold text-slate-900">Campagnes en cours</h3>
            <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
              {{ totalActive }} active(s)
            </span>
          </div>
          
          <div v-if="activeCampaigns.length > 0" class="divide-y divide-slate-100">
            <div v-for="camp in activeCampaigns" :key="camp.id" class="p-6 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h4 class="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{{ camp.name }}</h4>
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{{ camp.dept }} • {{ camp.subjects }} sujets</span>
                </div>
                <span class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase">{{ camp.status }}</span>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between text-xs font-bold text-slate-500">
                  <span>Progression cycle</span>
                  <span>{{ camp.progress }}%</span>
                </div>
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div :style="{ width: camp.progress + '%' }" class="bg-emerald-500 h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all duration-700"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="p-12 text-center">
            <ActivityIcon class="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p class="text-slate-400 font-medium">Aucune campagne active pour le moment.</p>
          </div>
        </div>

        <div class="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
          <div class="relative z-10">
             <h3 class="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">Trésorerie Campagnes</h3>
             <div class="space-y-1 mb-8">
               <p class="text-sm text-slate-400">Balance Totale Actuelle</p>
               <p class="text-4xl font-black italic">2.450.000 <span class="text-lg font-light text-slate-500 not-italic">FCFA</span></p>
             </div>
             
             <div class="space-y-4">
               <div class="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                 <span class="text-sm text-slate-400">Dépenses engagées</span>
                 <span class="font-bold text-red-400">- 850k</span>
               </div>
               <div class="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                 <span class="text-sm text-slate-400">Ventes prévues</span>
                 <span class="font-bold text-emerald-400">+ 4.2M</span>
               </div>
             </div>

             <button class="w-full mt-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]">
               Rapport Financier
               <ArrowUpRightIcon class="h-4 w-4" />
             </button>
          </div>
          <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl"></div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
</style>