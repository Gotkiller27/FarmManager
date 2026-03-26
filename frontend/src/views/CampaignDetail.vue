<script setup>
import { ref, onMounted, markRaw, computed } from 'vue'; // Ajout de computed
import { useRoute } from 'vue-router';
import { useCampaignStore } from '@/stores/campaignStore.js';
import { useAuthStore } from '@/stores/auth.js'; // Import de ton store d'auth
import { 
  LayoutDashboard, Utensils, DollarSign, ChevronLeft, 
  Bird, HeartPulse, ShoppingCart, Users 
} from 'lucide-vue-next';

// Import des sous-composants
import OverviewTab from '@/components/campaign/OverviewTab.vue';
import FeedingTab from '@/components/campaign/FeedingTab.vue';
import FinanceTab from '@/components/campaign/FinanceTab.vue';
import SujetsTab from '@/components/campaign/SujetsTab.vue';
import HealthTab from '@/components/campaign/HealthTab.vue';
import SalesTab from '@/components/campaign/SalesTab.vue';
import TeamTab from '@/components/campaign/TeamTab.vue'; 

const route = useRoute();
const campaignId = route.params.id;
const campaignStore = useCampaignStore();
const authStore = useAuthStore(); // Instance du store auth

const activeTabId = ref('overview');

// 1. Définition de tous les onglets avec une restriction optionnelle
const allTabs = [
  { id: 'overview', name: 'Dashboard', icon: LayoutDashboard, component: markRaw(OverviewTab) },
  { id: 'sujets', name: 'Sujets (QR)', icon: Bird, component: markRaw(SujetsTab) },
  { id: 'health', name: 'Santé', icon: HeartPulse, component: markRaw(HealthTab) },
  { id: 'feeding', name: 'Alimentation', icon: Utensils, component: markRaw(FeedingTab) },
  { 
    id: 'finance', 
    name: 'Finances', 
    icon: DollarSign, 
    component: markRaw(FinanceTab), 
    restricted: true // Seuls les admins/gérants voient ça
  },
  { id: 'sales', name: 'Ventes', icon: ShoppingCart, component: markRaw(SalesTab) },
  { 
    id: 'team', 
    name: 'Équipe', 
    icon: Users, 
    component: markRaw(TeamTab), 
    restricted: true // Seuls les admins/gérants voient ça
  }, 
];

// 2. Filtrage des onglets selon le rôle
const filteredTabs = computed(() => {
  const role = authStore.user?.role; // On récupère le rôle de l'utilisateur
  
  if (role === 'agent') {
    // Si c'est un agent, on retire les onglets restreints
    return allTabs.filter(tab => !tab.restricted);
  }
  
  // Sinon (admin/gérant), on affiche tout
  return allTabs;
});

const currentComponent = ref(allTabs[0].component);

const changeTab = (tab) => {
  activeTabId.value = tab.id;
  currentComponent.value = tab.component;
};

onMounted(async () => {
  try {
    await campaignStore.fetchCampaignById(campaignId);
  } catch (err) {
    console.error("Erreur chargement campagne", err);
  }
});
</script>

<template>
  <div class="h-full flex flex-col" v-if="campaignStore.currentCampaign">
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
      <button @click="$router.back()" class="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
        <ChevronLeft class="w-5 h-5 text-gray-600" />
      </button>
      <div>
        <h1 class="text-xl font-black text-[#065f46]">{{ campaignStore.currentCampaign.nom }}</h1>
        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ID Campagne: #{{ campaignId }}</p>
      </div>
    </div>

    <div class="flex-1 flex flex-col md:flex-row bg-white rounded-lg sm:rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
      <aside class="w-full md:w-64 bg-gray-50/50 border-b md:border-b-0 md:border-r border-gray-100 p-3 sm:p-4">
        <nav class="space-y-1">
          <button 
            v-for="tab in filteredTabs" :key="tab.id"
            @click="changeTab(tab)"
            :class="[
              'w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-2xl text-xs sm:text-sm font-bold transition-all',
              activeTabId === tab.id 
                ? 'bg-[#16a34a] text-white shadow-lg shadow-green-100 scale-[1.02]' 
                : 'text-gray-400 hover:bg-white hover:text-green-600'
            ]"
          >
            <component :is="tab.icon" class="w-5 h-5" />
            {{ tab.name }}
          </button>
        </nav>
      </aside>

      <main class="flex-1 p-3 sm:p-4 md:p-8 overflow-y-auto bg-white">
        <transition name="fade" mode="out-in">
          <component 
            :is="currentComponent" 
            :campaignId="campaignId" 
            :campaign="campaignStore.currentCampaign" 
            @refresh-campaign="onMounted" 
          />
        </transition>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Tes styles restent identiques */
.fade-enter-active, .fade-leave-active { 
  transition: all 0.25s ease-out; 
}
.fade-enter-from { 
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to { 
  opacity: 0;
  transform: translateY(-10px);
}

main::-webkit-scrollbar {
  width: 6px;
}
main::-webkit-scrollbar-thumb {
  background: #f1f1f1;
  border-radius: 10px;
}
</style>