<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/services/api.js';
import QrcodeVue from 'qrcode.vue'; 
import { Bird, QrCode, Plus, Search, Printer, X } from 'lucide-vue-next';
import AddSujetBatchModal from './AddSujetBatchModal.vue';
import SubjectTrackingModal from './SubjectTrackingModal.vue';

const props = defineProps(['campaignId']);
const sujets = ref([]);
const isModalOpen = ref(false);
const searchQuery = ref('');
const isTrackingModalOpen = ref(false);
const selectedSubjectId = ref(null);

// Chargement des données
const fetchSujets = async () => {
  try {
    const { data } = await api.get(`/campaigns/${props.campaignId}/sujets`);
    sujets.value = data;
  } catch (err) {
    console.error("Erreur chargement sujets", err);
  }
};

// Filtrage pour la recherche
const filteredSujets = computed(() => {
  return sujets.value.filter(s => 
    s.qr_code_token.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Déclenche l'impression
const printLabels = () => {
  window.print();
};

// Ouvrir la fiche de suivi d'un sujet
const openTrackingModal = (subjectId) => {
  selectedSubjectId.value = subjectId;
  isTrackingModalOpen.value = true;
};

onMounted(fetchSujets);
</script>

<template>
  <div class="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-[#fdfdfd]">
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 print:hidden">
      <div>
        <h2 class="text-lg sm:text-2xl font-bold text-[#065f46]">Inventaire Individuel</h2>
        <p class="text-green-600/60 text-xs sm:text-sm font-medium">Suivi par QR Code unique</p>
      </div>
      <div class="flex gap-2 sm:gap-3 w-full sm:w-auto">
        <button @click="printLabels" class="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm text-xs sm:text-sm">
          <Printer class="w-4 h-4" /> Imprimer étiquettes
        </button>
        <button @click="isModalOpen = true" class="flex-1 sm:flex-none bg-[#16a34a] hover:bg-[#15803d] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all text-xs sm:text-sm">
          <Plus class="w-4 h-4" /> Nouveau Lot
        </button>
      </div>
    </div>

    <div class="relative print:hidden">
      <Search class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
      <input v-model="searchQuery" type="text" placeholder="Rechercher un token ou scanner..." 
        class="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-lg sm:rounded-2xl border-none bg-white shadow-sm ring-1 ring-gray-100 focus:ring-2 focus:ring-green-500 transition-all text-xs sm:text-base">
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 print:hidden">
      <div v-for="sujet in filteredSujets" :key="sujet.id" 
        class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
        
        <div class="flex flex-col items-center text-center space-y-4">
          <div class="p-2 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
            <QrcodeVue :value="sujet.qr_code_token" :size="70" level="H" render-as="svg" />
          </div>
          
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">ID UNIQUE</p>
            <p class="font-bold text-slate-800 text-xs truncate w-32">{{ sujet.qr_code_token.split('-').pop() }}</p>
          </div>

          <div :class="sujet.statut === 'vivant' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" 
            class="px-3 py-1 rounded-full text-[10px] font-bold uppercase">
            {{ sujet.statut }}
          </div>
        </div>

        <div class="absolute inset-0 bg-green-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
           <button @click="openTrackingModal(sujet.id)" class="text-white font-bold text-sm flex items-center gap-2">
             <QrCode class="w-5 h-5" /> Voir Fiche
           </button>
        </div>
      </div>
    </div>

    <div class="hidden print:block">
      <div class="grid grid-cols-4 gap-4">
        <div v-for="sujet in sujets" :key="'print-'+sujet.id" class="border border-black p-4 text-center break-inside-avoid mb-4">
          <p class="text-[9px] font-bold mb-2">AGRIMANAGE - SUJET</p>
          <div class="flex justify-center mb-2">
            <QrcodeVue :value="sujet.qr_code_token" :size="100" level="H" />
          </div>
          <p class="text-[10px] font-mono font-bold">{{ sujet.qr_code_token }}</p>
          <p class="text-[8px] text-gray-600 uppercase">{{ sujet.type_precis }}</p>
        </div>
      </div>
    </div>

    <div v-if="sujets.length === 0" class="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
      <Bird class="w-16 h-16 text-gray-200 mx-auto mb-4" />
      <p class="text-gray-400 font-medium">Aucun sujet enregistré.</p>
    </div>

    <AddSujetBatchModal 
      :isOpen="isModalOpen" 
      :campaignId="campaignId"
      @close="isModalOpen = false"
      @refresh="fetchSujets"
    />

    <SubjectTrackingModal 
      :isOpen="isTrackingModalOpen"
      :subjectId="selectedSubjectId"
      :campaignId="campaignId"
      @close="isTrackingModalOpen = false"
    />
  </div>
</template>

<style>
@media print {
  body * { visibility: hidden; }
  .print\:block, .print\:block * { visibility: visible; }
  .print\:block {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    display: block !important;
  }
  @page { size: A4; margin: 1cm; }
}
</style>