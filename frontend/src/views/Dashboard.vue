<script setup>
import { ref, onMounted, computed } from 'vue';
import { 
  UsersIcon, 
  MapIcon, 
  BeakerIcon, 
  ChartBarIcon,
  PlusIcon
} from '@heroicons/vue/24/outline';
import { useUserStore } from '@/stores/userStore';
import { useCampaignStore } from '@/stores/campaignStore';

const userStore = useUserStore();
const campaignStore = useCampaignStore();

const totalGerants = computed(() => userStore.countByRole('gerant'));
const totalDepartments = computed(() => campaignStore.departments.length);
const totalCampaigns = computed(() => campaignStore.campaigns.length);
const performanceRate = ref('94%'); // Placeholder, replace with dynamic calculation if needed

const stats = computed(() => [
  { name: 'Total Gérants', value: totalGerants.value, icon: UsersIcon, change: '+2 ce mois', status: 'positive' },
  { name: 'Départements', value: totalDepartments.value, icon: MapIcon, change: 'Stable', status: 'neutral' },
  { name: 'Campagnes', value: totalCampaigns.value, icon: BeakerIcon, change: '+5 cette semaine', status: 'positive' },
  { name: 'Performance', value: performanceRate.value, icon: ChartBarIcon, change: '+1.5%', status: 'positive' },
]);

const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  await Promise.all([userStore.fetchUsers(), campaignStore.fetchDepartmentCampaigns()]);
  loading.value = false;
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    <header class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900">
          Dashboard <span class="text-emerald-600">AgroTrack</span>
        </h1>
        <p class="text-slate-500 text-sm">Vue d'ensemble par département de production.</p>
      </div>
      <button class="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-emerald-200">
        <PlusIcon class="h-5 w-5" />
        Nouvelle Campagne
      </button>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div v-for="stat in stats" :key="stat.name" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-slate-500 text-xs font-bold uppercase tracking-wider">{{ stat.name }}</p>
            <h3 class="text-3xl font-black text-slate-900 mt-1">{{ stat.value }}</h3>
          </div>
          <div class="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <component :is="stat.icon" class="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>