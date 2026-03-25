<script setup>
import { onMounted, watch } from 'vue'
import { useCampaignStore } from '@/stores/campaignStore' // Ajuste le chemin si besoin
import { storeToRefs } from 'pinia'

const props = defineProps(['isOpen', 'subjectId', 'campaignId'])
const emit = defineEmits(['close'])

// Initialisation du store
const campaignStore = useCampaignStore()

// Extraction des données réactives du store
const { 
  sujet, 
  healthHistory, 
  feedings, 
  ventes, 
  loading, 
  error 
} = storeToRefs(campaignStore)

// Fonctions utilitaires
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getLastActivityDate = () => {
  const allDates = [
    ...(healthHistory.value || []).map(r => r.date_acte),
    ...(feedings.value || []).map(r => r.date_alimentation),
    ...(ventes.value || []).map(r => r.date_vente)
  ].filter(date => date)

  if (allDates.length === 0) return 'Aucune'

  const latestDate = allDates.sort((a, b) => new Date(b) - new Date(a))[0]
  return formatDate(latestDate)
}

// Chargement des données via le store
const fetchSubjectData = async () => {
  if (!props.subjectId || !props.campaignId) return

  // On lance les appels en parallèle via le store
  await Promise.all([
    campaignStore.fetchSujetById(props.campaignId, props.subjectId),
    campaignStore.fetchHealthHistory(props.campaignId, props.subjectId),
    campaignStore.fetchFeedings(props.campaignId),
    campaignStore.fetchVentes(props.campaignId, props.subjectId)
  ])
}

// Watcher pour recharger quand le modal s'ouvre
watch(() => props.isOpen, (newValue) => {
  if (newValue && props.subjectId) {
    fetchSubjectData()
  }
})

// Recharger au montage si déjà ouvert
onMounted(() => {
  if (props.isOpen && props.subjectId) {
    fetchSubjectData()
  }
})
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-2 sm:p-4">
    <div class="bg-white rounded-2xl sm:rounded-[2.5rem] w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col">

      <div class="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 sm:p-6 flex-shrink-0">
        <div class="flex items-center justify-between gap-3 sm:gap-4">
          <div class="flex items-center gap-2 sm:gap-4 min-w-0">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <span class="text-xl sm:text-2xl">🐔</span>
            </div>
            <div class="min-w-0">
              <h2 class="text-lg sm:text-2xl font-bold leading-tight">Fiche de Suivi</h2>
              <p class="text-green-100 text-xs sm:text-sm truncate">
                <span v-if="loading">Chargement...</span>
                <span v-else-if="sujet">Sujet #{{ sujet?.qr_code_token?.split('-').pop() }}</span>
                <span v-else>Sujet non trouvé</span>
              </p>
            </div>
          </div>
          <button @click="emit('close')" class="text-white/80 hover:text-white transition-colors flex-shrink-0 text-xl sm:text-2xl font-bold">
            ×
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">

        <div v-if="loading" class="text-center py-8 sm:py-12">
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-3 sm:mb-4"></div>
          <p class="text-gray-500 text-sm sm:text-base font-medium">Récupération du dossier...</p>
        </div>

        <div v-else-if="error || !sujet" class="text-center py-8 sm:py-12">
          <div class="text-red-500 mb-3 sm:mb-4 text-2xl sm:text-3xl">❌</div>
          <p class="text-gray-500 mb-2 sm:mb-4 text-sm sm:text-base">Impossible de charger les données.</p>
          <p v-if="error" class="text-xs sm:text-sm text-red-600 mb-3 sm:mb-4 px-6">{{ error }}</p>
          <button @click="emit('close')" class="px-4 sm:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base font-bold">
            Fermer
          </button>
        </div>

        <div v-else class="space-y-4 sm:space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
            <div class="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-gray-100">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <span class="text-base sm:text-xl">ℹ️</span>
                <span class="truncate">Informations Générales</span>
              </h3>
              <div class="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div class="flex justify-between items-start gap-2">
                  <span class="text-gray-600 flex-shrink-0 font-medium">Token QR:</span>
                  <span class="font-mono font-bold text-gray-900 truncate text-right max-w-[180px] sm:max-w-xs">{{ sujet?.qr_code_token }}</span>
                </div>
                <div class="flex justify-between items-start gap-2">
                  <span class="text-gray-600 flex-shrink-0 font-medium">Type:</span>
                  <span class="font-semibold text-gray-900 text-right">{{ sujet?.type_precis }}</span>
                </div>
                <div class="flex justify-between items-start gap-2">
                  <span class="text-gray-600 flex-shrink-0 font-medium">Date d'arrivée:</span>
                  <span class="font-semibold text-gray-900 text-right">{{ formatDate(sujet?.date_arrivee) }}</span>
                </div>
                <div class="flex justify-between items-start gap-2">
                  <span class="text-gray-600 flex-shrink-0 font-medium">Provenance:</span>
                  <span class="font-semibold text-gray-900 text-right">{{ sujet?.provenance || 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-center gap-2">
                  <span class="text-gray-600 flex-shrink-0 font-medium">Statut:</span>
                  <span :class="sujet?.statut === 'vivant' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                        class="font-bold px-3 py-1 rounded-full text-[10px] uppercase flex-shrink-0">
                    {{ sujet?.statut }}
                  </span>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-blue-100">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <span class="text-base sm:text-xl">📊</span>
                <span class="truncate">Résumé d'Activité</span>
              </h3>
              <div class="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 font-medium">Soins de Santé:</span>
                  <span class="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-lg">{{ healthHistory.length }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 font-medium">Distributions:</span>
                  <span class="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-lg">{{ feedings.length }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 font-medium">Historique Ventes:</span>
                  <span class="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-lg">{{ ventes.length }}</span>
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-blue-200/50">
                  <span class="text-gray-600 font-medium">Dernier passage:</span>
                  <span class="font-semibold text-gray-900">{{ getLastActivityDate() }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-sm">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-6 flex items-center gap-2">
              <span class="text-base sm:text-xl">🕒</span>
              <span>Journal des Événements</span>
            </h3>

            <div class="space-y-6">
              <div v-if="healthHistory.length > 0" class="border-l-4 border-red-400 pl-3 sm:pl-4">
                <h4 class="font-bold text-red-600 mb-3 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider">
                  <span>❤️</span> Santé
                </h4>
                <div class="space-y-2">
                  <div v-for="record in healthHistory.slice(0, 5)" :key="record.id"
                       class="bg-red-50 rounded-xl p-3 text-xs sm:text-sm border border-red-100">
                    <div class="flex justify-between items-start gap-2">
                      <div class="min-w-0 flex-1">
                        <p class="font-bold text-slate-800 truncate">{{ record.nom_produit }}</p>
                        <p class="text-slate-500 text-[11px]">{{ formatDate(record.date_acte) }}</p>
                      </div>
                      <span class="text-[10px] bg-red-200 text-red-800 px-2 py-0.5 rounded-md font-bold uppercase">
                        {{ record.type_acte }}
                      </span>
                    </div>
                    <p v-if="record.notes" class="text-slate-600 mt-2 italic text-[11px]">{{ record.notes }}</p>
                  </div>
                </div>
              </div>

              <div v-if="feedings.length > 0" class="border-l-4 border-emerald-400 pl-3 sm:pl-4">
                <h4 class="font-bold text-emerald-600 mb-3 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider">
                  <span>🍽️</span> Alimentations
                </h4>
                <div class="space-y-2">
                  <div v-for="record in feedings.slice(0, 5)" :key="record.id"
                       class="bg-emerald-50 rounded-xl p-3 text-xs sm:text-sm border border-emerald-100">
                    <div class="flex justify-between items-center gap-2">
                      <div class="min-w-0 flex-1">
                        <p class="font-bold text-slate-800 truncate">{{ record.nom_aliment || 'Alimentation standard' }}</p>
                        <p class="text-slate-500 text-[11px]">{{ formatDate(record.date_distribution) }}</p>
                      </div>
                      <div class="text-right">
                        <span class="font-black text-emerald-700">{{ record.quantite_kg }} kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="ventes.length > 0" class="border-l-4 border-blue-400 pl-3 sm:pl-4">
                <h4 class="font-bold text-blue-600 mb-3 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider">
                  <span>🛒</span> Ventes
                </h4>
                <div class="space-y-2">
                  <div v-for="record in ventes.slice(0, 3)" :key="record.id"
                       class="bg-blue-50 rounded-xl p-3 text-xs sm:text-sm border border-blue-100">
                    <div class="flex justify-between items-start gap-2">
                      <div class="min-w-0 flex-1">
                        <p class="font-bold text-slate-800 truncate">{{ record.client_nom }}</p>
                        <p class="text-slate-500 text-[11px]">{{ formatDate(record.date_vente) }}</p>
                      </div>
                      <div class="text-right">
                        <p class="font-black text-blue-700">{{ record.prix_unitaire }} €</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="healthHistory.length === 0 && feedings.length === 0 && ventes.length === 0"
                   class="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <span class="text-4xl block mb-2">📋</span>
                <p class="text-sm text-gray-400 font-medium">Aucun historique enregistré pour ce sujet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth scrolling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Animation de secousse du modal sur mobile */
@media (max-width: 640px) {
  div[class*="fixed"] {
    animation: none !important;
  }
}
</style>
