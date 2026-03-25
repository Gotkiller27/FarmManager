<script setup>
import { ref, onMounted } from 'vue';
import { UserPlus, Users, Phone, Mail, X, Trash2, ShieldCheck } from 'lucide-vue-next';
import { useAgentStore } from '@/stores/agentStore';
import { useToastStore } from '@/stores/toast';

const props = defineProps({
  campaignId: { type: [String, Number], required: true },
  campaign: { type: Object, required: true }
});

const agentStore = useAgentStore();
const toastStore = useToastStore();

const showModal = ref(false);
const selectedAgentId = ref(null);
const isAssigning = ref(false);

// Charger les données au montage
const loadData = async () => {
  await Promise.all([
    agentStore.fetchCampaignAgents(props.campaignId),
    agentStore.fetchAllAgents()
  ]);
};

// Ajouter un agent à la campagne
const handleAssign = async () => {
  if (!selectedAgentId.value) return;
  
  isAssigning.value = true;
  try {
    await agentStore.assignAgent({
      campagne_id: props.campaignId,
      agent_id: selectedAgentId.value
    });
    
    toastStore.success("Agent ajouté avec succès");
    showModal.value = false;
    selectedAgentId.value = null;
    await agentStore.fetchCampaignAgents(props.campaignId);
  } catch (err) {
    toastStore.error(err.response?.data?.message || "Erreur d'assignation");
  } finally {
    isAssigning.value = false;
  }
};

onMounted(loadData);
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center bg-green-50/50 p-4 rounded-2xl border border-green-100">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-white rounded-xl shadow-sm">
          <Users class="w-6 h-6 text-[#16a34a]" />
        </div>
        <div>
          <h2 class="text-lg font-bold text-[#065f46]">Personnel assigné</h2>
          <p class="text-xs text-green-600 font-medium">{{ agentStore.campaignAgents.length }} agent(s) sur cette campagne</p>
        </div>
      </div>
      
      <button 
        @click="showModal = true"
        class="flex items-center gap-2 bg-[#16a34a] text-white px-4 py-2.5 rounded-xl hover:bg-[#15803d] transition-all shadow-md font-bold text-sm"
      >
        <UserPlus class="w-4 h-4" />
        Ajouter un agent
      </button>
    </div>

    <div v-if="agentStore.campaignAgents.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div 
        v-for="agent in agentStore.campaignAgents" 
        :key="agent.user_id"
        class="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between hover:shadow-md transition-all group"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-[#16a34a] rounded-full flex items-center justify-center text-white font-black shadow-inner">
            {{ agent.nom ? agent.nom.charAt(0).toUpperCase() : 'A' }}
          </div>
          <div>
            <h3 class="font-bold text-gray-900">{{ agent.nom }}</h3>
            <div class="flex items-center gap-2 text-[11px] text-gray-400 font-bold uppercase">
              <ShieldCheck class="w-3 h-3 text-blue-500" />
              Agent de Terrain
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <a :href="`tel:${agent.tel}`" class="p-2 bg-gray-50 text-gray-400 hover:text-[#16a34a] hover:bg-green-50 rounded-lg transition-colors">
            <Phone class="w-4 h-4" />
          </a>
          </div>
      </div>
    </div>

    <div v-else class="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
      <div class="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
        <Users class="w-8 h-8 text-gray-200" />
      </div>
      <p class="text-gray-400 font-bold text-sm">Aucun agent n'est encore assigné à cette campagne.</p>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-[#065f46]/20 backdrop-blur-md flex items-center justify-center z-[200] p-4">
      <div class="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl border border-white">
        <div class="bg-[#f0fdf4] px-6 py-5 flex justify-between items-center border-b border-green-50">
          <h3 class="font-black text-[#065f46] uppercase tracking-tight">Ajouter un agent</h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-red-500 transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <div class="p-6 space-y-5">
          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Sélectionner l'agent</label>
            <select 
              v-model="selectedAgentId" 
              class="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#16a34a] rounded-2xl outline-none transition-all font-bold text-gray-700 appearance-none"
            >
              <option :value="null" disabled>Choisir un collaborateur...</option>
              <option v-for="a in agentStore.allAgents" :key="a.user_id" :value="a.user_id">
                {{ a.nom }} ({{ a.city || 'Ville inconnue' }})
              </option>
            </select>
          </div>

          <button 
            @click="handleAssign"
            :disabled="!selectedAgentId || isAssigning"
            class="w-full py-4 bg-[#16a34a] text-white rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-[#15803d] disabled:opacity-50 transition-all uppercase tracking-wider text-xs"
          >
            {{ isAssigning ? 'Assignation en cours...' : 'Confirmer l\'ajout' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>