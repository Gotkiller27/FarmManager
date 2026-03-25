<script setup>
import { reactive, ref } from 'vue';
import { useCampaignStore } from '@/stores/campaignStore';
import { X, Loader2, Bird, Hash, Calendar, MapPin } from 'lucide-vue-next';
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore();
const campaignStore = useCampaignStore();

const props = defineProps(['campaignId', 'isOpen']);
const emit = defineEmits(['close', 'refresh']);

const loading = ref(false);

const form = reactive({
  campagne_id: props.campaignId,
  type_precis: 'Ross 308 (Chair)',
  quantite: 50, // Quantité à générer en masse
  date_arrivee: new Date().toISOString().split('T')[0],
  provenance: ''
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    form.campagne_id = props.campaignId;
    
    // On utilise le store
    await campaignStore.addSujetBatch(form);
    
    toastStore.success("Lot de sujets généré avec succès.");
    
    // Rechargement des sujets depuis le store
    await campaignStore.fetchSujets(props.campaignId);
    
    emit('refresh');
    emit('close');
  } catch (err) {
    console.error("Erreur génération lot", err);
    toastStore.error("Impossible de générer le lot de sujets.");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
    <div class="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative border border-gray-100">
      
      <button @click="emit('close')" class="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
        <X class="w-6 h-6" />
      </button>

      <div class="mb-8">
        <h3 class="text-2xl font-black text-[#065f46] flex items-center gap-2">
          <Bird class="text-green-500" /> Peuplement du Lot
        </h3>
        <p class="text-gray-400 text-sm">Générez des identifiants uniques pour chaque sujet.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
            <Bird class="w-3 h-3" /> Souche / Type
          </label>
          <input v-model="form.type_precis" type="text" required
            class="w-full p-4 rounded-2xl border-none bg-gray-50 ring-1 ring-gray-100 focus:ring-2 focus:ring-green-500 transition-all"
            placeholder="ex: Cobb 500">
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
              <Hash class="w-3 h-3" /> Nombre de têtes
            </label>
            <input v-model="form.quantite" type="number" min="1" max="1000" required
              class="w-full p-4 rounded-2xl border-none bg-gray-50 ring-1 ring-gray-100 focus:ring-2 focus:ring-green-500 transition-all font-bold text-lg"
              placeholder="ex: 100">
          </div>
          <div>
            <label class="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
              <Calendar class="w-3 h-3" /> Arrivée
            </label>
            <input v-model="form.date_arrivee" type="date" required
              class="w-full p-4 rounded-2xl border-none bg-gray-50 ring-1 ring-gray-100 focus:ring-2 focus:ring-green-500 transition-all">
          </div>
        </div>

        <div>
          <label class="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
            <MapPin class="w-3 h-3" /> Couvoir / Provenance
          </label>
          <input v-model="form.provenance" type="text"
            class="w-full p-4 rounded-2xl border-none bg-gray-50 ring-1 ring-gray-100 focus:ring-2 focus:ring-green-500 transition-all"
            placeholder="ex: Couvoir National">
        </div>

        <button type="submit" :disabled="loading"
          class="w-full bg-[#16a34a] text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-[#15803d] active:scale-95 transition-all mt-4 flex items-center justify-center gap-2">
          <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
          <span v-else>Générer les identifiants</span>
        </button>
      </form>
    </div>
  </div>
</template>