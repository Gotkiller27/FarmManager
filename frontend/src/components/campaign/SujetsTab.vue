<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api.js';
import { Bird, QrCode, Plus, Search, Filter, ShieldCheck } from 'lucide-vue-next';
import AddSujetBatchModal from './AddSujetBatchModal.vue'; // On va le créer

const props = defineProps(['campaignId']);
const sujets = ref([]);
const isModalOpen = ref(false);
const searchQuery = ref('');

const fetchSujets = async () => {
  try {
    const { data } = await api.get(`/campaigns/${props.campaignId}/sujets`);
    sujets.value = data;
  } catch (err) {
    console.error("Erreur chargement sujets", err);
  }
};

onMounted(fetchSujets);
</script>

<template>
  <div class="p-6 space-y-6 bg-[#fdfdfd]">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-[#065f46]">Inventaire Individuel</h2>
        <p class="text-green-600/60 text-sm font-medium">Chaque animal possède son propre QR Code unique</p>
      </div>
      <button @click="isModalOpen = true" class="bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all">
        <Plus class="w-5 h-5" /> Enregistrer un Nouveau Lot
      </button>
    </div>

    <div class="flex gap-4">
      <div class="relative flex-1">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input v-model="searchQuery" type="text" placeholder="Scanner ou rechercher un ID (ex: AGRI-10...)" 
          class="w-full pl-12 pr-4 py-4 rounded-2xl border-none bg-white shadow-sm ring-1 ring-gray-100 focus:ring-2 focus:ring-green-500 transition-all">
      </div>
      <button class="p-4 bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 text-gray-500 hover:text-green-600"><Filter /></button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div v-for="sujet in sujets" :key="sujet.id" 
        class="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
        
        <div class="flex flex-col items-center text-center space-y-3">
          <div class="bg-gray-50 p-4 rounded-2xl group-hover:bg-green-50 transition-colors">
            <Bird class="w-8 h-8 text-gray-400 group-hover:text-green-600" />
          </div>
          
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">ID UNIQUE</p>
            <p class="font-bold text-slate-800 text-sm">{{ sujet.qr_code_token.split('-').pop() }}</p>
          </div>

          <div :class="sujet.statut === 'vivant' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" 
            class="px-3 py-1 rounded-full text-[10px] font-bold uppercase">
            {{ sujet.statut }}
          </div>
        </div>

        <div class="absolute inset-0 bg-green-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
           <button class="text-white font-bold text-sm flex items-center gap-2">
             <QrCode class="w-5 h-5" /> Fiche
           </button>
        </div>
      </div>
    </div>

    <div v-if="sujets.length === 0" class="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
      <Bird class="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <p class="text-gray-400 font-medium">Aucun sujet enregistré pour cette campagne.</p>
    </div>

    <AddSujetBatchModal 
      :isOpen="isModalOpen" 
      :campaignId="campaignId"
      @close="isModalOpen = false"
      @refresh="fetchSujets"
    />
  </div>
</template>