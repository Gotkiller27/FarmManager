<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-2 sm:p-4">
    <div class="bg-white rounded-2xl sm:rounded-[2.5rem] w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col">

      <!-- Header -->
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
                <span v-else-if="subject">Sujet #{{ subject?.qr_code_token?.split('-').pop() }}</span>
                <span v-else>Sujet non trouvé</span>
              </p>
            </div>
          </div>
          <button @click="emit('close')" class="text-white/80 hover:text-white transition-colors flex-shrink-0 text-xl sm:text-2xl">
            ×
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">

        <!-- Loading state -->
        <div v-if="loading" class="text-center py-8 sm:py-12">
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-3 sm:mb-4"></div>
          <p class="text-gray-500 text-sm sm:text-base">Chargement des données du sujet...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="!subject" class="text-center py-8 sm:py-12">
          <div class="text-red-500 mb-3 sm:mb-4 text-2xl sm:text-3xl">❌</div>
          <p class="text-gray-500 mb-2 sm:mb-4 text-sm sm:text-base">Impossible de charger les données du sujet.</p>
          <p v-if="errorMessage" class="text-xs sm:text-sm text-red-600 mb-3 sm:mb-4 break-words">{{ errorMessage }}</p>
          <button @click="emit('close')" class="px-4 sm:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base">
            Fermer
          </button>
        </div>

        <!-- Subject data -->
        <div v-else class="space-y-4 sm:space-y-6">
          <!-- Informations générales et Statistiques -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
            <!-- Infos générales -->
            <div class="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-6">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <span class="text-base sm:text-xl">ℹ️</span>
                <span class="truncate">Informations Générales</span>
              </h3>
              <div class="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div class="flex justify-between items-start gap-2">
                  <span class="text-gray-600 flex-shrink-0">Token QR:</span>
                  <span class="font-mono font-bold text-gray-900 truncate text-right max-w-xs">{{ subject?.qr_code_token }}</span>
                </div>
                <div class="flex justify-between items-start gap-2">
                  <span class="text-gray-600 flex-shrink-0">Type:</span>
                  <span class="font-semibold text-gray-900 text-right">{{ subject?.type_precis }}</span>
                </div>
                <div class="flex justify-between items-start gap-2">
                  <span class="text-gray-600 flex-shrink-0">Date:</span>
                  <span class="font-semibold text-gray-900 text-right">{{ formatDate(subject?.date_arrivee) }}</span>
                </div>
                <div class="flex justify-between items-start gap-2">
                  <span class="text-gray-600 flex-shrink-0">Provenance:</span>
                  <span class="font-semibold text-gray-900 text-right">{{ subject?.provenance || 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-start gap-2">
                  <span class="text-gray-600 flex-shrink-0">Statut:</span>
                  <span :class="subject?.statut === 'vivant' ? 'text-green-600' : 'text-red-600'"
                        class="font-bold px-2 sm:px-3 py-1 rounded-full text-xs uppercase flex-shrink-0">
                    {{ subject?.statut }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Statistiques -->
            <div class="bg-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-6">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <span class="text-base sm:text-xl">📊</span>
                <span class="truncate">Statistiques</span>
              </h3>
              <div class="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Santé:</span>
                  <span class="font-bold text-blue-600">{{ healthRecords.length }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Alimentations:</span>
                  <span class="font-bold text-blue-600">{{ feedingRecords.length }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Ventes:</span>
                  <span class="font-bold text-blue-600">{{ salesRecords.length }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Dernière activité:</span>
                  <span class="font-semibold text-gray-900">{{ getLastActivityDate() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline des activités -->
          <div class="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-6">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-6 flex items-center gap-2">
              <span class="text-base sm:text-xl">🕒</span>
              <span>Historique</span>
            </h3>

            <div class="space-y-3 sm:space-y-4">
              <!-- Interventions santé -->
              <div v-if="healthRecords.length > 0" class="border-l-4 border-red-200 pl-3 sm:pl-4">
                <h4 class="font-bold text-red-600 mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm">
                  <span>❤️</span>
                  <span>Santé ({{ healthRecords.length }})</span>
                </h4>
                <div class="space-y-2">
                  <div v-for="record in healthRecords.slice(0, 5)" :key="record.id"
                       class="bg-red-50 rounded-lg p-2 sm:p-3 text-xs sm:text-sm">
                    <div class="flex justify-between items-start gap-2">
                      <div class="min-w-0 flex-1">
                        <p class="font-semibold text-gray-900 truncate">{{ record.nom_produit }}</p>
                        <p class="text-gray-600 truncate">{{ record.type_acte }}</p>
                        <p class="text-gray-500 text-xs">{{ formatDate(record.date_acte) }}</p>
                      </div>
                      <span class="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
                        {{ record.type_acte }}
                      </span>
                    </div>
                    <p v-if="record.notes" class="text-gray-700 mt-1 line-clamp-2">{{ record.notes }}</p>
                  </div>
                </div>
              </div>

              <!-- Alimentations -->
              <div v-if="feedingRecords.length > 0" class="border-l-4 border-green-200 pl-3 sm:pl-4">
                <h4 class="font-bold text-green-600 mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm">
                  <span>🍽️</span>
                  <span>Alimentations ({{ feedingRecords.length }})</span>
                </h4>
                <div class="space-y-2">
                  <div v-for="record in feedingRecords.slice(0, 5)" :key="record.id"
                       class="bg-green-50 rounded-lg p-2 sm:p-3 text-xs sm:text-sm">
                    <div class="flex justify-between items-start gap-2">
                      <div class="min-w-0 flex-1">
                        <p class="font-semibold text-gray-900 truncate">{{ record.nom_aliment || 'Aliment' }}</p>
                        <p class="text-gray-600">{{ record.quantite_kg }} kg</p>
                        <p class="text-gray-500 text-xs">{{ formatDate(record.date_distribution) }}</p>
                      </div>
                      <span class="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
                        {{ record.quantite_kg }}kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ventes -->
              <div v-if="salesRecords.length > 0" class="border-l-4 border-blue-200 pl-3 sm:pl-4">
                <h4 class="font-bold text-blue-600 mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm">
                  <span>🛒</span>
                  <span>Ventes ({{ salesRecords.length }})</span>
                </h4>
                <div class="space-y-2">
                  <div v-for="record in salesRecords.slice(0, 3)" :key="record.id"
                       class="bg-blue-50 rounded-lg p-2 sm:p-3 text-xs sm:text-sm">
                    <div class="flex justify-between items-start gap-2">
                      <div class="min-w-0 flex-1">
                        <p class="font-semibold text-gray-900 truncate">{{ record.client_nom }}</p>
                        <p class="text-gray-600">{{ record.prix_unitaire }}€/kg</p>
                        <p class="text-gray-500 text-xs">{{ formatDate(record.date_vente) }}</p>
                      </div>
                      <span class="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        VENTE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Aucun historique -->
              <div v-if="healthRecords.length === 0 && feedingRecords.length === 0 && salesRecords.length === 0"
                   class="text-center py-6 sm:py-8 text-gray-500">
                <span class="text-3xl sm:text-4xl">📋</span>
                <p class="text-sm sm:text-base">Aucune activité pour ce sujet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api.js'

const props = defineProps(['isOpen', 'subjectId', 'campaignId'])
const emit = defineEmits(['close'])

const subject = ref(null)
const healthRecords = ref([])
const feedingRecords = ref([])
const salesRecords = ref([])
const loading = ref(false)
const errorMessage = ref('')

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
    ...healthRecords.value.map(r => r.date_acte),
    ...feedingRecords.value.map(r => r.date_alimentation),
    ...salesRecords.value.map(r => r.date_vente)
  ].filter(date => date)

  if (allDates.length === 0) return 'Aucune'

  const latestDate = allDates.sort((a, b) => new Date(b) - new Date(a))[0]
  return formatDate(latestDate)
}

// Chargement des données du sujet
const fetchSubjectData = async () => {
  if (!props.subjectId || !props.campaignId) {
    console.error('❌ Props manquantes:', { subjectId: props.subjectId, campaignId: props.campaignId })
    subject.value = null
    return
  }

  loading.value = true
  errorMessage.value = ''
  console.log('🔄 Chargement des données pour sujet:', props.subjectId, 'campagne:', props.campaignId)
  
  if (!props.subjectId || !props.campaignId) {
    errorMessage.value = `Props manquantes: subjectId=${props.subjectId} campaignId=${props.campaignId}`
    console.error(errorMessage.value)
    subject.value = null
    loading.value = false
    return
  }

  try {
    // Charger les informations du sujet
    console.log('📡 Appel API sujet:', `/campaigns/${props.campaignId}/sujets/${props.subjectId}`)
    let subjectResponse

    try {
      subjectResponse = await api.get(`/campaigns/${props.campaignId}/sujets/${props.subjectId}`)
      subject.value = subjectResponse.data
    } catch (innerError) {
      const status = innerError.response?.status
      if (status === 404) {
        console.warn('Sujet non trouvé via endpoint getSujetById, tentative de fallback par liste complète')
        const listResponse = await api.get(`/campaigns/${props.campaignId}/sujets`)
        const candidate = listResponse.data.find(item => `${item.id}` === `${props.subjectId}` || item.qr_code_token === props.subjectId)
        if (candidate) {
          subject.value = candidate
        } else {
          throw innerError
        }
      } else {
        throw innerError
      }
    }
    console.log('✅ Données sujet reçues:', subject.value)

    // Charger l'historique santé
    console.log('📡 Appel API santé:', `/campaigns/${props.campaignId}/health-history?subjectId=${props.subjectId}`)
    const healthResponse = await api.get(`/campaigns/${props.campaignId}/health-history?subjectId=${props.subjectId}`)
    healthRecords.value = healthResponse.data
    console.log('✅ Données santé reçues:', healthRecords.value.length, 'enregistrements')

    // Charger l'historique alimentation
    // Note: Feedings est au niveau campagne, pas au niveau sujet
    // Chaque sujet reçoit les mêmes alimentations de la campagne
    console.log('📡 Appel API alimentation:', `/campaigns/${props.campaignId}/feedings`)
    const feedingResponse = await api.get(`/campaigns/${props.campaignId}/feedings`)
    feedingRecords.value = feedingResponse.data
    console.log('✅ Données alimentation reçues:', feedingRecords.value.length, 'enregistrements')

    // Charger l'historique ventes
    console.log('📡 Appel API ventes:', `/campaigns/${props.campaignId}/ventes?subjectId=${props.subjectId}`)
    const salesResponse = await api.get(`/campaigns/${props.campaignId}/ventes?subjectId=${props.subjectId}`)
    salesRecords.value = salesResponse.data
    console.log('✅ Données ventes reçues:', salesRecords.value.length, 'enregistrements')

  } catch (error) {
    errorMessage.value = error.response?.data?.message || error.message || 'Erreur inconnue'
    console.error('❌ Erreur lors du chargement des données du sujet:', error)
    console.error('Détails de l\'erreur:', {
      message: errorMessage.value,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url
    })
    subject.value = null
  } finally {
    loading.value = false
  }
}

// Watcher pour recharger quand le modal s'ouvre
watch(() => props.isOpen, (newValue) => {
  console.log('👁️ Watcher isOpen:', newValue, 'subjectId:', props.subjectId, 'campaignId:', props.campaignId)
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
