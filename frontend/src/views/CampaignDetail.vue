<script setup>
import { ref, onMounted, markRaw } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api.js';
import { LayoutDashboard, Utensils, DollarSign, ChevronLeft, Bird, HeartPulse , ShoppingCart} from 'lucide-vue-next';

// Import des sous-composants
import OverviewTab from '@/components/campaign/OverviewTab.vue';
import FeedingTab from '@/components/campaign/FeedingTab.vue';
import FinanceTab from '@/components/campaign/FinanceTab.vue';
import SujetsTab from '@/components/campaign/SujetsTab.vue';
import HealthTab from '@/components/campaign/HealthTab.vue'; // <-- Nouvel import
import SalesTab from '@/components/campaign/SalesTab.vue'; // <-- Nouvel import

const route = useRoute();
const campaignId = route.params.id;
const campaign = ref(null);

// Gestion des onglets
const activeTabId = ref('overview');
const tabs = [
  { id: 'overview', name: 'Dashboard', icon: LayoutDashboard, component: markRaw(OverviewTab) },
  { id: 'sujets', name: 'Sujets (QR)', icon: Bird, component: markRaw(SujetsTab) },
  { id: 'health', name: 'Santé', icon: HeartPulse, component: markRaw(HealthTab) }, // <-- Ajout de l'onglet Santé
  { id: 'feeding', name: 'Alimentation', icon: Utensils, component: markRaw(FeedingTab) },
  { id: 'finance', name: 'Finances', icon: DollarSign, component: markRaw(FinanceTab) },
  { id: 'sales', name: 'Ventes', icon: ShoppingCart, component: markRaw(SalesTab) }, // <-- Ajout de l'onglet Ventes
];

const currentComponent = ref(tabs[0].component);

const changeTab = (tab) => {
  activeTabId.value = tab.id;
  currentComponent.value = tab.component;
};

onMounted(async () => {
  try {
    const response = await api.get(`/campaigns/${campaignId}`);
    campaign.value = response.data;
  } catch (err) {
    console.error("Erreur chargement campagne", err);
  }
});
</script>

<template>
  <div class="h-full flex flex-col" v-if="campaign">
    <div class="flex items-center gap-4 mb-6">
      <button @click="$router.back()" class="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
        <ChevronLeft class="w-5 h-5 text-gray-600" />
      </button>
      <div>
        <h1 class="text-xl font-black text-[#065f46]">{{ campaign.nom }}</h1>
        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ID Campagne: #{{ campaignId }}</p>
      </div>
    </div>

    <div class="flex-1 flex bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
      <aside class="w-64 bg-gray-50/50 border-r border-gray-100 p-4">
        <nav class="space-y-2">
          <button 
            v-for="tab in tabs" :key="tab.id"
            @click="changeTab(tab)"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all',
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

      <main class="flex-1 p-8 overflow-y-auto bg-white">
        <transition name="fade" mode="out-in">
          <component 
            :is="currentComponent" 
            :campaignId="campaignId" 
            :campaign="campaign" 
            @refresh-campaign="onMounted" 
          />
        </transition>
      </main>
    </div>
  </div>
</template>

<style scoped>
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

/* Scrollbar personnalisée pour le contenu */
main::-webkit-scrollbar {
  width: 6px;
}
main::-webkit-scrollbar-thumb {
  background: #f1f1f1;
  border-radius: 10px;
}
</style>