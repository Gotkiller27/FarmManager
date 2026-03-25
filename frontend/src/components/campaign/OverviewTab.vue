<script setup>
const props = defineProps(['campaign']);
</script>

<template>
  <div class="space-y-6 sm:space-y-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      
      <div class="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-lg sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
          <span class="text-xs sm:text-sm font-bold text-green-600">FCFA</span>
        </div>
        <h4 class="text-gray-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mb-2">Budget Prévu</h4>
        <p class="text-lg sm:text-2xl font-black text-slate-800">
          {{ campaign?.budget?.toLocaleString() }}
        </p>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-lg sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h4 class="text-gray-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mb-2">Dépenses Réelles</h4>
        <p class="text-lg sm:text-2xl font-black text-red-600">
          {{ campaign?.total_depenses?.toLocaleString() || 0 }}
        </p>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
        <h4 class="text-gray-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mb-2">Statut</h4>
        <div class="flex items-center gap-2">
           <span class="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></span>
           <p class="text-sm sm:text-lg font-bold text-slate-700 uppercase">{{ campaign?.statut }}</p>
        </div>
        <p class="text-[10px] sm:text-xs text-gray-400 mt-2">
          Début : {{ campaign?.date_debut ? new Date(campaign.date_debut).toLocaleDateString() : '...' }}
        </p>
      </div>
    </div>

    <div class="bg-[#11261a] p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] text-white">
      <h3 class="text-lg sm:text-xl font-bold mb-2">Analyse de la rentabilité</h3>
      <p class="text-green-300 text-xs sm:text-sm">
        Le budget consommé représente actuellement 
        <span class="font-bold text-white">
          {{ campaign?.budget > 0 ? Math.round((campaign?.total_depenses / campaign?.budget) * 100) : 0 }}%
        </span> 
        de l'enveloppe totale.
      </p>
    </div>
  </div>
</template>