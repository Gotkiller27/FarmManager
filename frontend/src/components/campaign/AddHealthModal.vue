<script setup>
import { reactive, ref } from 'vue';
import { useCampaignStore } from '@/stores/campaignStore';
import { HeartPulse, X, Scan, Users } from 'lucide-vue-next';
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore();
const campaignStore = useCampaignStore();

const props = defineProps(['isOpen', 'campaignId']);
const emit = defineEmits(['close', 'refresh']);

const targetType = ref('lot'); // 'lot' ou 'individuel'

const form = reactive({
  sujet_id: null,
  qr_token: '', // Pour saisir ou scanner le token
  type_acte: 'vaccin',
  nom_produit: '',
  date_acte: new Date().toISOString().split('T')[0],
  notes: ''
});

const submit = async () => {
  try {
    const payload = { ...form, campaignId: props.campaignId, targetType: targetType.value };
    await campaignStore.addHealthRecord(payload);
    toastStore.success("Intervention santé enregistrée avec succès.");
    
    // Rechargement des données depuis le store
    await campaignStore.fetchHealthHistory(props.campaignId);
    await campaignStore.fetchHealthStats(props.campaignId);
    
    emit('refresh');
    emit('close');
  } catch (err) { 
    toastStore.error("Erreur lors de l'enregistrement");
  }
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
    <div class="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl relative">
      <button @click="emit('close')" class="absolute top-6 right-6 text-gray-400"><X /></button>

      <h3 class="text-2xl font-black text-[#065f46] mb-6 flex items-center gap-2">
        <HeartPulse class="text-red-500" /> Intervention Santé
      </h3>

      <div class="flex gap-4 mb-6">
        <button @click="targetType = 'lot'" :class="targetType === 'lot' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'" class="flex-1 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
          <Users class="w-4 h-4" /> Tout le lot
        </button>
        <button @click="targetType = 'individuel'" :class="targetType === 'individuel' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'" class="flex-1 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
          <Scan class="w-4 h-4" /> Sujet spécifique
        </button>
      </div>

      <form @submit.prevent="submit" class="space-y-4">
        <div v-if="targetType === 'individuel'">
          <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Scanner ou Saisir le Token</label>
          <input v-model="form.qr_token" type="text" required class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-green-500" placeholder="ex: AGRI-10-A7B2-1">
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Type d'acte</label>
            <select v-model="form.type_acte" class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100">
              <option value="vaccin">Vaccin</option>
              <option value="traitement">Traitement</option>
              <option value="deces">Décès ☠️</option>
              <option value="observation">Observation</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Produit / Maladie</label>
            <input v-model="form.nom_produit" type="text" class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100" placeholder="ex: Gumboro">
          </div>
        </div>

        <button type="submit" class="w-full bg-[#065f46] text-white py-4 rounded-2xl font-black shadow-lg mt-4">
          Enregistrer l'intervention
        </button>
      </form>
    </div>
  </div>
</template>