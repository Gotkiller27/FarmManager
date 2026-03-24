<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/userStore';
import EditProfileModal from '@/Components/EditProfileModale.vue';
import { 
  UserIcon, EnvelopeIcon, MapPinIcon, PhoneIcon, 
  BriefcaseIcon, CheckBadgeIcon, ExclamationCircleIcon 
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const userStore = useUserStore();

const user = computed(() => authStore.user);
const isModalOpen = ref(false);

// Calcul de complétude du profil
const isProfileIncomplete = computed(() => {
  if (!user.value) return true;
  return !user.value.bio || !user.value.tel || !user.value.city || !user.value.age;
});

// Sauvegarde des modifications
const onSaveProfile = async (updatedData) => {
  const success = await userStore.updateUser(user.value.id, updatedData);
  if (success) {
    // Mise à jour locale du store Auth pour refléter les changements immédiatement
    authStore.user = { ...authStore.user, ...updatedData };
    isModalOpen.value = false;
  }
};
</script>

<template>
  <div v-if="user" class="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden mt-10">
    
    <div class="px-10 py-12 flex flex-col md:flex-row items-center gap-10 bg-slate-50/50 border-b border-slate-100">
      <div class="relative">
        <div class="h-32 w-32 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
          <UserIcon class="h-14 w-14 text-slate-300" />
        </div>
        <div v-if="user.role === 'admin'" class="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
          <CheckBadgeIcon class="h-6 w-6 text-emerald-500" />
        </div>
      </div>

      <div class="flex-1 text-center md:text-left">
        <div class="flex flex-col md:flex-row md:items-center gap-3 mb-2">
          <h2 class="text-3xl font-light text-slate-800 tracking-tight">
            {{ user.first_name }} <span class="font-semibold text-slate-900">{{ user.last_name }}</span>
          </h2>
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 w-fit mx-auto md:mx-0 uppercase">
            {{ user.role }}
          </span>
        </div>
        <div class="flex flex-col md:flex-row gap-4 text-sm text-slate-500 font-medium">
          <span class="flex items-center gap-1.5"><EnvelopeIcon class="h-4 w-4" /> {{ user.email }}</span>
          <span class="flex items-center gap-1.5"><BriefcaseIcon class="h-4 w-4" /> {{ user.age || '—' }} ans</span>
        </div>
      </div>

      <button 
        @click="isModalOpen = true"
        class="transition-all duration-300 px-8 py-3 rounded-lg text-sm font-semibold tracking-wide border"
        :class="isProfileIncomplete 
          ? 'bg-white border-amber-200 text-amber-600 hover:bg-amber-50' 
          : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'"
      >
        {{ isProfileIncomplete ? 'Compléter le profil' : 'Éditer le profil' }}
      </button>
    </div>

    <div class="p-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div class="space-y-6">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Bio & Parcours</h4>
          <p v-if="user.bio" class="text-slate-600 leading-relaxed text-sm font-light italic">« {{ user.bio }} »</p>
          <div v-else class="flex items-center gap-3 text-slate-400 py-2 border-l-2 border-slate-100 pl-4">
            <ExclamationCircleIcon class="h-5 w-5" />
            <span class="text-sm italic">Aucune biographie rédigée.</span>
          </div>
        </div>

        <div class="space-y-6">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Coordonnées</h4>
          <div class="space-y-4">
            <div class="flex items-center justify-between text-sm py-2 border-b border-slate-50">
              <span class="text-slate-500 flex items-center gap-2"><MapPinIcon class="h-4 w-4" /> Ville</span>
              <span class="text-slate-900 font-medium">{{ user.city || 'Non renseignée' }}</span>
            </div>
            <div class="flex items-center justify-between text-sm py-2 border-b border-slate-50">
              <span class="text-slate-500 flex items-center gap-2"><PhoneIcon class="h-4 w-4" /> Contact</span>
              <span class="text-slate-900 font-medium">{{ user.tel || '—' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EditProfileModal 
      :isOpen="isModalOpen" 
      :user="user" 
      @close="isModalOpen = false" 
      @save="onSaveProfile"
    />
  </div>
</template>