<script setup>
import { onMounted, computed, ref } from 'vue';
import { useCampaignStore } from '@/stores/campaignStore';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Activity, 
  AlertCircle, 
  ArrowRight,
  Utensils,
  CheckCircle2
} from 'lucide-vue-next';
import { useToastStore } from '@/stores/toast';
import Toast from '@/components/Toast.vue';

const campaignStore = useCampaignStore();
const toastStore = useToastStore();
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  // On lance les deux appels en parallèle pour plus de rapidité
  await Promise.all([
    campaignStore.fetchMyCampaigns(),
    campaignStore.fetchAgentGlobalStats() // L'action qui récupère les chiffres
  ]);
  loading.value = false;
});

// --- LOGIQUE DYNAMIQUE ---

// 1. Nombre de missions actives
const activeCampaignsCount = computed(() => 
  campaignStore.myCampaigns.filter(c => c.statut === 'en_cours').length
);

// 2. Taux de survie dynamique
const survivalRate = computed(() => {
  const stats = campaignStore.agentStats;
  if (!stats || stats.total_sujets === 0) return 100;
  const rate = 100 - ((stats.total_morts / stats.total_sujets) * 100);
  return rate.toFixed(1);
});

// 3. Missions récentes (les 3 dernières)
const recentMissions = computed(() => 
  campaignStore.myCampaigns.slice(0, 3)
);

// 4. Alertes (Si des sujets sont marqués "malades")
const alertsCount = computed(() => campaignStore.agentStats?.total_malades || 0);
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8 pb-12">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-gray-900 flex items-center gap-3">
          Bonjour, <span class="text-green-600">Agent</span>
          <Activity class="w-8 h-8 text-green-500 animate-pulse" />
        </h1>
        <p class="text-gray-400 font-bold mt-1 uppercase tracking-widest text-xs">Tableau de bord opérationnel • AgriManage</p>
      </div>
      
      <div class="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
        <div class="w-2 h-2" :class="loading ? 'bg-orange-500 animate-pulse' : 'bg-green-500 animate-ping'"></div>
        <span class="text-sm font-black text-gray-700">{{ loading ? 'Mise à jour...' : 'Système en ligne' }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:border-green-200 transition-all">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-green-50 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
            <LayoutDashboard class="w-6 h-6" />
          </div>
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Missions</span>
        </div>
        <div class="text-3xl font-black text-gray-900">{{ activeCampaignsCount }}</div>
        <div class="text-xs font-bold text-gray-400 mt-1">Campagnes en cours</div>
      </div>

      <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:border-blue-200 transition-all">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <CheckCircle2 class="w-6 h-6" />
          </div>
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Santé</span>
        </div>
        <div class="text-3xl font-black text-gray-900">{{ survivalRate }}%</div>
        <div class="text-xs font-bold text-gray-400 mt-1">Taux de survie global</div>
      </div>

      <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:border-orange-200 transition-all">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-orange-50 rounded-xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
            <Utensils class="w-6 h-6" />
          </div>
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Logistique</span>
        </div>
        <div class="text-3xl font-black text-gray-900">{{ campaignStore.agentStats?.distributions_jour || 0 }}</div>
        <div class="text-xs font-bold text-gray-400 mt-1">Repas servis aujourd'hui</div>
      </div>

      <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:border-red-200 transition-all">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-red-50 rounded-xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
            <AlertCircle class="w-6 h-6" />
          </div>
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Urgences</span>
        </div>
        <div class="text-3xl font-black" :class="alertsCount > 0 ? 'text-red-600' : 'text-gray-900'">
          {{ alertsCount }}
        </div>
        <div class="text-xs font-bold text-gray-400 mt-1">Sujets nécessitant des soins</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2 space-y-6">
        <div class="flex items-center justify-between px-2">
          <h2 class="text-xl font-black text-gray-900">Missions Récentes</h2>
          <router-link to="/layout-principale/my-campaigns" class="text-sm font-bold text-green-600 hover:underline flex items-center gap-1">
            Voir tout <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>

        <div v-if="recentMissions.length > 0" class="space-y-4">
          <div 
            v-for="camp in recentMissions" :key="camp.id"
            class="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:bg-gray-50 transition-all"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 font-black border border-green-100">
                {{ camp.nom.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h4 class="font-black text-gray-900 group-hover:text-green-700 transition-colors">{{ camp.nom }}</h4>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ camp.nom_departement || 'Département' }}</p>
              </div>
            </div>
            <router-link 
              :to="`/layout-principale/campaign/${camp.id}`"
              class="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-green-600 group-hover:text-white transition-all"
            >
              <ArrowRight class="w-5 h-5" />
            </router-link>
          </div>
          <div class="h-80">
            <Line v-if="isLoaded" :data="chartData" :options="chartOptions" />
          </div>
        </div>
        
        <div v-else-if="loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="h-20 bg-gray-100 animate-pulse rounded-[2rem]"></div>
        </div>

        <div v-else class="bg-white p-12 rounded-[2rem] text-center border-2 border-dashed border-gray-100">
           <p class="text-gray-400 font-bold">Aucune campagne assignée pour le moment.</p>
        </div>
      </div>

      <div class="space-y-6">
        <h2 class="text-xl font-black text-gray-900 px-2">Actions Rapides</h2>
        <div class="bg-[#065f46] p-8 rounded-[2.5rem] shadow-xl shadow-green-900/20 space-y-4 relative overflow-hidden border border-green-800">
          <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full"></div>
          
          <p class="text-green-100 text-sm font-medium leading-relaxed opacity-80 mb-4">
            Gérez vos tâches quotidiennes directement depuis le terrain.
          </p>

          <button class="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-3 active:scale-95">
             <Activity class="w-5 h-5" /> Scanner un Sujet
          </button>
          
          <button class="w-full py-4 bg-white text-green-900 hover:bg-green-50 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95">
             <Utensils class="w-5 h-5" /> Distribution
          </button>
        </div>
      </div>
    </div>

    <div v-if="alertsCount > 0">
      <button @click="showAlertToast">Afficher les alertes</button>
    </div>
  </div>
</template>

<script>
import { useToastStore } from '@/stores/toast';
import Toast from '@/components/Toast.vue';

export default {
  components: { Toast },
  setup() {
    const toastStore = useToastStore();

    const showAlertToast = () => {
      toastStore.showToast({
        message: 'Il y a des urgences à traiter.',
        type: 'warning',
      });
    };

    return {
      showAlertToast,
    };
  },
};
</script>

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
