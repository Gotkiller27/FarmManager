<script setup>
import { reactive } from 'vue';
import api from '@/services/api.js';
import { X } from 'lucide-vue-next';

const props = defineProps(['campaignId', 'isOpen']);
const emit = defineEmits(['close', 'refresh']);

const form = reactive({
  campagne_id: props.campaignId,
  type_aliment_id: 1, // On utilise l'ID numérique maintenant
  quantite_kg: null,
  prix_total: null
});

const handleSubmit = async () => {
  if (!form.quantite_kg || !form.prix_total) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  try {
    // Mise à jour de l'ID au cas où la prop aurait changé
    form.campagne_id = props.campaignId;
    
    // On envoie le formulaire
    await api.post('/campaigns/feeding', form);
    
    // Reset du formulaire pour la prochaine fois
    form.quantite_kg = null;
    form.prix_total = null;
    
    emit('refresh');
    emit('close');
  } catch (err) {
    console.error("Erreur détaillée :", err.response?.data);
    const sqlError = err.response?.data?.details || "";
    
    if (sqlError.includes("foreign key constraint fails")) {
      alert("Erreur : Le type d'aliment sélectionné n'existe pas dans la base de données. Vérifiez votre table 'types_aliments'.");
    } else {
      alert("Erreur serveur lors de l'enregistrement.");
    }
  }
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
    <div class="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative border border-gray-100">
      <button @click="emit('close')" class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
        <X class="w-6 h-6" />
      </button>

      <h3 class="text-2xl font-black text-[#065f46] mb-2">Nouvelle Distribution</h3>
      <p class="text-gray-400 text-sm mb-8">Enregistrez les détails de l'alimentation du jour.</p>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Type d'aliment</label>
          <select v-model="form.type_aliment_id" class="w-full p-4 rounded-2xl border-none bg-gray-50 ring-1 ring-gray-100 focus:ring-2 focus:ring-green-500 transition-all font-medium">
            <option :value="1">Aliment démarrage</option>
            <option :value="2">Aliment croissance</option>
            <option :value="3">Aliment finition</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Quantité (kg)</label>
            <input v-model="form.quantite_kg" type="number" step="0.01" required
              class="w-full p-4 rounded-2xl border-none bg-gray-50 ring-1 ring-gray-100 focus:ring-2 focus:ring-green-500 transition-all font-bold"
              placeholder="ex: 25">
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Coût (FCFA)</label>
            <input v-model="form.prix_total" type="number" required
              class="w-full p-4 rounded-2xl border-none bg-gray-50 ring-1 ring-gray-100 focus:ring-2 focus:ring-green-500 transition-all font-bold"
              placeholder="ex: 15000">
          </div>
        </div>

        <button type="submit" class="w-full bg-[#16a34a] text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-[#15803d] active:scale-95 transition-all mt-4">
          Confirmer l'enregistrement
        </button>
      </form>
    </div>
  </div>
</template>