<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useGerantStore } from '@/stores/gerantsStore.js'
import { useAdminStore } from '@/stores/adminStore.js'
import { useAgentsStore } from '@/stores/agentsStore'


const authStore = useAuthStore()

const gerantStore = useGerantStore()
const agentStore = useAgentsStore()
const adminStore = useAdminStore()
const currentUser = computed( () => {
  const user = authStore.user
  console.log(user.role)

  //  await gerantStore.fetchGerants();
  
  // await adminStore.fetchAdmins()
  // await agentStore.fetchAgents()

  switch (user.role) {
    case 'gerant':
      return gerantStore.gerants.find(g => g.id === user.id)

    case 'admin':
      return adminStore.admins.find(a => a.id === user.id)

    case 'agent':
      return agentStore.agents.find(a => a.id === user.id)

    default:
      return null
  }
   console.log(currentUser.value);
})
const isModalOpen = ref(false)
// console.log(authStore.user);




// Initialisation intelligente : évite les textes "Âge non défini" dans les inputs

const user = ref({})
watch(currentUser, (newUser) => {
  if (newUser) {
    user.value = {
      first_name: newUser.first_name || '',
      last_name: newUser.last_name || '',
      email: newUser.email || '',
      role: newUser.role || '',
      age: newUser.age || null,
      city: newUser.city || '',
      tel: newUser.tel || '',
      bio: newUser.bio || '',
    }

    form.value = { ...user.value, password: '' }
  }
})


const form = ref({ ...user.value, password: '' })

const saveChanges = async () => {
  const data = {
    city: form.value.city,
    age: parseInt(form.value.age) || null,
    tel: form.value.tel,
    bio: form.value.bio,
  }

  try {
    if (currentUser.value.role === 'gerant') {
      // Le store gère maintenant l'ajout ou la mise à jour via le service corrigé
      await gerantStore.createGerant(currentUser.value.id, data)
    } else if (currentUser.value.role === 'admin') {
      await adminStore.createAdmin(currentUser.value.id, data)
    }else if(currentUser.value.role === "agent"){
      await agentStore.createAgent(currentUser.value.id,data)
    }

    // Mise à jour locale de l'affichage
    Object.assign(user.value, form.value)
    isModalOpen.value = false
    
    // Optionnel: rafraîchir l'utilisateur dans authStore si nécessaire
  } catch (error) {
    console.error("Erreur sauvegarde:", error)
  }
}

onMounted(async () => {
  await gerantStore.fetchGerants();
  
  await adminStore.fetchAdmins()
  await agentStore.fetchAgents()
  // console.log(agentStore.agents);
  // console.log(currentUser.value);
  // console.log(authStore.user)
  console.log(adminStore.admins)
})
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 p-4 md:p-6">
    <div
      v-if="user"
      class="max-w-7xl mx-auto bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden"
    >
      <div
        class="px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row items-center gap-8 bg-slate-50/50 border-b border-slate-100"
      >
        <div class="relative">
          <div
            class="h-28 w-28 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm"
          >
            <span class="text-4xl font-light text-emerald-500">
              {{ currentUser?.first_name[0] }}{{ currentUser?.last_name[0] }}
            </span>
          </div>
          <div
            class="absolute -bottom-1 -right-1 bg-emerald-500 p-1.5 rounded-lg shadow-sm border-2 border-white"
          >
            <CheckBadgeIcon class="h-4 w-4 text-white" />
          </div>
        </div>

        <div class="flex-1 text-center md:text-left">
          <div class="flex flex-col md:flex-row md:items-center gap-3 mb-1">
            <h2 class="text-3xl font-light text-slate-800 tracking-tight">
              {{ currentUser?.first_name }}
              <span class="font-semibold text-slate-900">{{ currentUser?.last_name }}</span>
            </h2>
            <span
              class="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-widest mx-auto md:mx-0"
            >
              {{ currentUser?.role }}
            </span>
          </div>
          <div
            class="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-slate-500 font-medium"
          >
            <span class="flex items-center gap-1.5"
              ><EnvelopeIcon class="h-4 w-4 text-slate-400" /> {{ currentUser?.email }}</span
            >
            <span class="flex items-center gap-1.5"
              ><MapPinIcon class="h-4 w-4 text-slate-400" />
              {{ currentUser?.city || 'Ville non définie' }}</span
            >
          </div>
        </div>

        <button
          @click="isModalOpen = true"
          class="transition-all duration-300 px-8 py-3 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100 active:scale-95"
        >
          Modifier mon profil
        </button>
      </div>

      <div class="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div class="lg:col-span-2 space-y-4">
          <h4
            class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"
          >
            <div class="h-1 w-1 rounded-full bg-emerald-500"></div>
            Biographie
          </h4>
          <div class="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 min-h-[150px]">
            <p v-if="currentUser?.bio" class="text-slate-900 leading-relaxed text-base font-light italic">
              « {{ currentUser?.bio }} »
            </p>
            <p v-else class="text-slate-400 text-sm italic">
              Aucune biographie rédigée pour le moment.
            </p>
          </div>
        </div>

        <div class="space-y-6">
          <h4
            class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"
          >
            <div class="h-1 w-1 rounded-full bg-emerald-500"></div>
            Informations clés
          </h4>
          <div class="divide-y divide-slate-100">
            <div class="py-3 flex justify-between items-center">
              <span class="text-sm text-slate-500">Âge</span>
              <span class="text-sm font-semibold text-slate-900">{{ currentUser?.age || '—' }} ans</span>
            </div>
            <div class="py-3 flex justify-between items-center">
              <span class="text-sm text-slate-500">Téléphone</span>
              <span class="text-sm font-semibold text-slate-900">{{ currentUser?.tel || '—' }}</span>
            </div>
            <div class="py-3 flex justify-between items-center">
              <span class="text-sm text-slate-500">Dernière connexion</span>
              <span class="text-sm font-semibold text-slate-900">Aujourd'hui</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      >
        <Transition name="slide-up">
          <div
            class="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div
              class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30"
            >
              <h3 class="text-lg font-bold text-slate-900">Mise à jour du compte</h3>
              <button
                @click="isModalOpen = false"
                class="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <XMarkIcon class="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div class="p-8 max-h-[75vh] overflow-y-auto space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1"
                    >Prénom</label
                  >
                  <input
                    v-model="form.first_name"
                    type="text"
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1"
                    >Nom</label
                  >
                  <input
                    v-model="form.last_name"
                    type="text"
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1"
                    >Email</label
                  >
                  <input
                    v-model="form.email"
                    type="email"
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1"
                    >Ville</label
                  >
                  <input
                    v-model="form.city"
                    type="text"
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1"
                    >Âge</label
                  >
                  <input
                    v-model="form.age"
                    type="number"
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1"
                    >Téléphone</label
                  >
                  <input
                    v-model="form.tel"
                    type="tel"
                    class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                  />
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1"
                  >Biographie</label
                >
                <textarea
                  v-model="form.bio"
                  rows="4"
                  class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div class="pt-6 border-t border-slate-100">
                <div class="space-y-1.5">
                  <label
                    class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider ml-1"
                    >Nouveau mot de passe</label
                  >
                  <input
                    v-model="form.password"
                    type="password"
                    placeholder="Laisser vide pour conserver l'actuel"
                    class="w-full px-4 py-3 bg-emerald-50/30 border border-emerald-100 rounded-xl text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div class="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                @click="isModalOpen = false"
                class="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600"
              >
                Annuler
              </button>
              <button
                @click="saveChanges"
                class="px-10 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  transform: translateY(30px);
  opacity: 0;
}
</style>
