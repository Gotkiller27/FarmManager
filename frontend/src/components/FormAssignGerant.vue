<script setup>
import { ref, onMounted } from 'vue';
import { XMarkIcon, UserPlusIcon, CheckIcon, MapIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close', 'confirm']);

// États du formulaire
const selectedGerantId = ref('');
const selectedDeptId = ref('');
const isSubmitting = ref(false);

// Listes pour les sélections (À charger via ton API Node.js)
const gerantsDisponibles = ref([
  { id: 101, name: 'Jean Dupont' },
  { id: 102, name: 'Awa Diop' },
  { id: 103, name: 'Michel Koffi' },
  { id: 104, name: 'Fatou Sow' },
]);

const departementsDisponibles = ref([
  { id: 1, nom: 'Volaille' },
  { id: 2, nom: 'Bétail' },
  { id: 3, nom: 'Pisciculture' },
]);

const handleConfirm = async () => {
  if (!selectedGerantId.value || !selectedDeptId.value) return;
  
  isSubmitting.value = true;
  
  // Simulation de l'appel API vers ta table gerant_departement
  setTimeout(() => {
    emit('confirm', {
      departement_id: selectedDeptId.value,
      gerant_id: selectedGerantId.value
    });
    isSubmitting.value = false;
    closeModal();
  }, 800);
};

const closeModal = () => {
  selectedGerantId.value = '';
  selectedDeptId.value = '';
  emit('close');
};
</script>

<template>
  <Transition name="fade">
    <div v-if="false" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      
      <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
        
        <div class="p-6 border-b border-slate-50 flex justify-between items-center bg-emerald-50/30">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-100">
              <UserPlusIcon class="h-6 w-6" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900">Nouvelle Assignation</h3>
              <p class="text-xs text-emerald-600 font-medium uppercase tracking-wider">AgroTrack Staffing</p>
            </div>
          </div>
          <button @click="closeModal" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <div class="p-8 space-y-6">
          
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <MapIcon class="h-4 w-4 text-emerald-600" />
              Département de production
            </label>
            <div class="relative">
              <select 
                v-model="selectedDeptId"
                class="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block p-3 appearance-none outline-none transition-all"
              >
                <option value="" disabled>Choisir le secteur...</option>
                <option v-for="dept in departementsDisponibles" :key="dept.id" :value="dept.id">
                  {{ dept.nom }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <UserPlusIcon class="h-4 w-4 text-emerald-600" />
              Gérant responsable
            </label>
            <div class="relative">
              <select 
                v-model="selectedGerantId"
                class="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block p-3 appearance-none outline-none transition-all"
              >
                <option value="" disabled>Sélectionner un membre...</option>
                <option v-for="gerant in gerantsDisponibles" :key="gerant.id" :value="gerant.id">
                  {{ gerant.name }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
            </div>
          </div>

        </div>

        <div class="p-6 bg-slate-50 flex gap-3">
          <button 
            @click="closeModal"
            class="flex-1 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Annuler
          </button>
          <button 
            @click="handleConfirm"
            :disabled="!selectedGerantId || !selectedDeptId || isSubmitting"
            :class="(!selectedGerantId || !selectedDeptId || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700 shadow-lg shadow-emerald-200 active:scale-95'"
            class="flex-1 px-4 py-3 text-sm font-bold text-white bg-emerald-600 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            <CheckIcon v-else class="h-5 w-5" />
            {{ isSubmitting ? 'Enregistrement...' : 'Confirmer' }}
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>