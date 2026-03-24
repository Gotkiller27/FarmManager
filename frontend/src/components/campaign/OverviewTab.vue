<script setup>
const props = defineProps(['campaign']);
</script>

<template>
  <div class="space-y-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div class="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
          <span class="text-green-600 font-bold">FCFA</span>
        </div>
        <h4 class="text-gray-400 text-xs font-bold uppercase tracking-widest">Budget Prévu</h4>
        <p class="text-2xl font-black text-slate-800">{{ campaign?.budget?.toLocaleString() }}</p>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div class="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4 text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 class="text-gray-400 text-xs font-bold uppercase tracking-widest">Dépenses Réelles</h4>
        <p class="text-2xl font-black text-red-600">{{ campaign?.total_depenses?.toLocaleString() || 0 }}</p>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h4 class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Statut</h4>
        <div class="flex items-center gap-2">
           <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
           <p class="text-lg font-bold text-slate-700 uppercase">{{ campaign?.statut }}</p>
        </div>
        <p class="text-xs text-gray-400 mt-2">Début : {{ new Date(campaign?.date_debut).toLocaleDateString() }}</p>
      </div>
    </div>

    <div class="bg-[#11261a] p-8 rounded-[2rem] text-white">
      <h3 class="text-xl font-bold mb-2">Analyse de la rentabilité</h3>
      <p class="text-green-300 text-sm">Le budget consommé représente actuellement {{ Math.round((campaign?.total_depenses / campaign?.budget) * 100) || 0 }}% de l'enveloppe totale.</p>
    </div>
  </div>
</template>