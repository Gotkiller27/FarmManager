<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const props = defineProps(['campaignId']);
const expenses = ref([]);

const fetchExpenses = async () => {
  // Ici on réutilise ta table depenses_campagne
  const { data } = await api.get(`/campaigns/${props.campaignId}/expenses`);
  expenses.value = data;
};

onMounted(fetchExpenses);
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="font-bold text-gray-700">Historique des dépenses</h3>
      <button class="text-sm bg-green-600 text-white px-3 py-2 rounded-lg">+ Ajouter</button>
    </div>
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-50 text-gray-400 uppercase text-[10px]">
          <tr>
            <th class="p-4">Libellé</th>
            <th class="p-4">Catégorie</th>
            <th class="p-4">Montant</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="exp in expenses" :key="exp.id">
            <td class="p-4">{{ exp.libelle }}</td>
            <td class="p-4 uppercase text-[10px] font-bold text-gray-400">{{ exp.categorie }}</td>
            <td class="p-4 font-bold text-red-500">{{ exp.montant.toLocaleString() }} FCFA</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>