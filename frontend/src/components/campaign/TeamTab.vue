<script setup>
import { ref, onMounted, computed } from 'vue';
import { UserPlus, Users, Phone, X, ShieldCheck, Hash } from 'lucide-vue-next';
import { useAgentStore } from '@/stores/agentStore';
import { useToastStore } from '@/stores/toast';

const props = defineProps({
  campaignId: { type: [String, Number], required: true },
  campaign: { type: Object, required: true } // Contient la quantité totale de la campagne
});

const agentStore = useAgentStore();
const toastStore = useToastStore();

const showModal = ref(false);
const selectedAgentId = ref(null);
const quotaToAssign = ref(0); // Nouveau : Nombre de sujets à assigner
const isAssigning = ref(false);

// Calculer le reste de sujets disponibles dans la campagne
const remainingSubjects = computed(() => {
  const assigned = agentStore.campaignAgents.reduce((sum, a) => sum + (Number(a.quota_initial) || 0), 0);
  return props.campaign.quantite_initiale - assigned;
});

const loadData = async () => {
  await Promise.all([
    agentStore.fetchCampaignAgents(props.campaignId),
    agentStore.fetchAllAgents()
  ]);
};

const handleAssign = async () => {
  if (!selectedAgentId.value || quotaToAssign.value <= 0) {
    toastStore.error("Veuillez sélectionner un agent et un quota valide");
    return;
  }

  if (quotaToAssign.value > remainingSubjects.value) {
    toastStore.error(`Quota trop élevé. Il ne reste que ${remainingSubjects.value} sujets.`);
    return;
  }

  isAssigning.value = true;
  try {
    await agentStore.assignAgent({
      campagne_id: props.campaignId,
      agent_id: selectedAgentId.value,
      quota: quotaToAssign.value // On envoie le quota au backend
    });
    
    toastStore.success(`Agent assigné avec ${quotaToAssign.value} sujets`);
    showModal.value = false;
    selectedAgentId.value = null;
    quotaToAssign.value = 0;
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
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-green-50/50 p-6 rounded-[2rem] border border-green-100 gap-4">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-white rounded-2xl shadow-sm border border-green-50">
          <Users class="w-8 h-8 text-[#16a34a]" />
        </div>
        <div>
          <h2 class="text-xl font-black text-[#065f46]">Gestion du Personnel</h2>
          <p class="text-xs text-green-600 font-bold uppercase tracking-wider">
            {{ agentStore.campaignAgents.length }} assigné(s) • {{ remainingSubjects }} sujets libres
          </p>
        </div>
      </div>
      
      <button 
        @click="showModal = true"
        class="w-full md:w-auto flex items-center justify-center gap-2 bg-[#16a34a] text-white px-6 py-3.5 rounded-2xl hover:bg-[#15803d] transition-all shadow-lg shadow-green-200/50 font-black text-xs uppercase tracking-widest"
      >
        <UserPlus class="w-5 h-5" />
        Assigner un lot
      </button>
    </div>

    <div v-if="agentStore.campaignAgents.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div 
        v-for="agent in agentStore.campaignAgents" 
        :key="agent.user_id"
        class="bg-white border border-gray-100 p-5 rounded-[2rem] flex items-center justify-between hover:border-green-200 transition-all group shadow-sm"
      >
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center text-[#16a34a] font-black border border-green-100 uppercase">
            {{ agent.nom ? agent.nom.charAt(0) : 'A' }}
          </div>
          <div>
            <h3 class="font-black text-gray-900">{{ agent.nom }}</h3>
            <div class="flex items-center gap-3 mt-1">
              <span class="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-black uppercase">
                <ShieldCheck class="w-3 h-3" /> Agent
              </span>
              <span class="flex items-center gap-1 text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md font-black uppercase">
                <Hash class="w-3 h-3" /> {{ agent.quota_initial || 0 }} sujets
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <a :href="`tel:${agent.tel}`" class="p-3 bg-gray-50 text-gray-400 hover:text-[#16a34a] hover:bg-green-50 rounded-xl transition-all">
            <Phone class="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-[#065f46]/40 backdrop-blur-md flex items-center justify-center z-[200] p-4">
      <div class="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-white">
        <div class="bg-gray-50 px-8 py-6 flex justify-between items-center border-b border-gray-100">
          <div>
            <h3 class="font-black text-[#065f46] uppercase tracking-tighter text-lg">Nouvelle Assignation</h3>
            <p class="text-[10px] font-bold text-gray-400 uppercase italic">Disponibles : {{ remainingSubjects }} sujets</p>
          </div>
          <button @click="showModal = false" class="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm transition-colors">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <div class="p-8 space-y-6">
          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Collaborateur</label>
            <select 
              v-model="selectedAgentId" 
              class="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#16a34a] rounded-2xl outline-none transition-all font-bold text-gray-700 appearance-none"
            >
              <option :value="null" disabled>Choisir un agent...</option>
              <option v-for="a in agentStore.allAgents" :key="a.user_id" :value="a.user_id">
                {{ a.nom }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Nombre de sujets confiés</label>
            <div class="relative">
              <input 
                v-model.number="quotaToAssign"
                type="number"
                :max="remainingSubjects"
                class="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#16a34a] rounded-2xl outline-none transition-all font-black text-xl text-[#16a34a]"
                placeholder="0"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 uppercase">Unités</span>
            </div>
          </div>

          <button 
            @click="handleAssign"
            :disabled="!selectedAgentId || quotaToAssign <= 0 || isAssigning"
            class="w-full py-5 bg-[#16a34a] text-white rounded-2xl font-black shadow-xl shadow-green-200 hover:bg-[#15803d] disabled:opacity-50 transition-all uppercase tracking-widest text-xs active:scale-95"
          >
            {{ isAssigning ? 'Traitement...' : 'Confier le lot' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>