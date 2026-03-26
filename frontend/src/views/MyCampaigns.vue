<script setup>
import { onMounted, ref } from 'vue';
import { useCampaignStore } from '@/stores/campaignStore';
import { 
  ClipboardList, 
  ArrowRight, 
  Calendar, 
  Tag,
  ChevronRight,
  Search
} from 'lucide-vue-next';

const campaignStore = useCampaignStore();
const loading = ref(true);
const searchQuery = ref("");

const fetchCampaigns = async () => {
  loading.value = true;
  await campaignStore.fetchMyCampaigns(); // Assure-toi que cette action existe dans ton store
  loading.value = false;
};

onMounted(fetchCampaigns);

// Petit filtre de recherche local pour le confort de l'agent
const filteredCampaigns = () => {
  return campaignStore.myCampaigns.filter(c => 
    c.nom.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};

const getStatusColor = (statut) => {
  if (statut === 'en_cours') return 'bg-emerald-100 text-emerald-700';
  if (statut === 'termine') return 'bg-gray-100 text-gray-600';
  return 'bg-blue-100 text-blue-600';
};
</script>

<template>
  <div class="max-w-7xl mx-auto space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
      <div>
        <h1 class="text-2xl font-black text-[#065f46] flex items-center gap-3">
          <div class="p-2 bg-green-600 rounded-xl text-white">
            <ClipboardList class="w-6 h-6" />
          </div>
          Mes Missions
        </h1>
        <p class="text-gray-400 text-sm font-medium mt-1 ml-11">Liste des campagnes qui vous sont assignées</p>
      </div>

      <div class="relative group">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Rechercher une mission..." 
          class="pl-12 pr-6 py-3.5 bg-gray-50 border-2 border-transparent focus:border-green-100 focus:bg-white rounded-2xl outline-none w-full md:w-72 font-bold text-gray-700 transition-all"
        >
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="h-64 bg-gray-100 animate-pulse rounded-[2.5rem]"></div>
    </div>

    <div v-else-if="filteredCampaigns().length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="camp in filteredCampaigns()" 
        :key="camp.id"
        class="bg-white p-1 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
      >
        <div class="p-7">
          <div class="flex justify-between items-start mb-6">
            <div class="w-14 h-14 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center text-green-600 border border-green-100/50">
              <Tag class="w-7 h-7" />
            </div>
            <span :class="['px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider', getStatusColor(camp.statut)]">
              {{ camp.statut === 'en_cours' ? 'Active' : camp.statut }}
            </span>
          </div>

          <h3 class="text-xl font-black text-gray-900 mb-2 group-hover:text-green-700 transition-colors leading-tight">
            {{ camp.nom }}
          </h3>

          <div class="space-y-3 mb-8">
            <div class="flex items-center gap-3 text-gray-400 font-bold text-[13px]">
              <Calendar class="w-4 h-4 text-green-500" />
              Débutée le {{ new Date(camp.date_debut).toLocaleDateString('fr-FR') }}
            </div>
            <div class="flex items-center gap-3 text-gray-400 font-bold text-[13px]">
              <div class="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-[10px] text-green-700">#</div>
              {{ camp.nom_departement || 'Département' }}
            </div>
          </div>

          <router-link 
            :to="`/layout-principale/campaign/${camp.id}`"
            class="flex items-center justify-between w-full p-4 bg-gray-50 group-hover:bg-green-600 rounded-[1.5rem] transition-all duration-300"
          >
            <span class="text-sm font-black text-gray-600 group-hover:text-white uppercase tracking-widest ml-2">Suivre la mission</span>
            <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-green-600 shadow-sm transition-transform group-hover:translate-x-1">
              <ChevronRight class="w-6 h-6" />
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
      <div class="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <ClipboardList class="w-12 h-12 text-green-200" />
      </div>
      <h2 class="text-2xl font-black text-gray-900 mb-2">Aucune mission trouvée</h2>
      <p class="text-gray-400 max-w-xs mx-auto font-medium">
        Vous n'avez pas de campagnes assignées ou votre recherche ne donne aucun résultat.
      </p>
    </div>
  </div>
</template>