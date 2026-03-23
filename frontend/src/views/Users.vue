<script setup>
import { onMounted, ref, computed } from "vue";
import { useUserStore } from "@/stores/userStore"; 
import { storeToRefs } from "pinia";

const userStore = useUserStore();
// On extrait les données réactives et les états (loading/error) du store
const { users, loading, error } = storeToRefs(userStore);

// Formulaire local
const newUser = ref({ firstName: "", lastName: "", email: "", role: "agent", password: "" });
const isEditing = ref(false);
const editingId = ref(null);

// Pagination locale
const currentPage = ref(1);
const itemsPerPage = 8;
const totalPages = computed(() => Math.ceil(users.value.length / itemsPerPage) || 1);
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return users.value.slice(start, start + itemsPerPage);
});

const setPage = (page) => { 
  if (page >= 1 && page <= totalPages.value) currentPage.value = page; 
};

// Charger les données de la base au montage
onMounted(() => {
  userStore.fetchUsers();
});

// Logique unique pour l'Ajout ou la Modification via Pinia
const handleAddOrUpdate = async () => {
  if (!newUser.value.email || !newUser.value.firstName) return alert("Champs requis !");

  if (isEditing.value) {
    const success = await userStore.updateUser(editingId.value, newUser.value);
    if (success) resetForm();
  } else {
    const success = await userStore.addUser(newUser.value);
    if (success) resetForm();
  }
};

const editUser = (user) => {
  newUser.value = { ...user, password: "" }; 
  editingId.value = user.id;
  isEditing.value = true;
};

const deleteUser = async (id) => {
  if (confirm("Voulez-vous vraiment supprimer ce membre d'AgriManage ?")) {
    await userStore.deleteUser(id);
  }
};

const resetForm = () => {
  newUser.value = { firstName: "", lastName: "", email: "", role: "agent", password: "" };
  isEditing.value = false;
  editingId.value = null;
};
</script>

<template>
  <div class="min-h-screen p-4 md:p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-emerald-50 text-slate-800">
    
    <div class="max-w-7xl mx-auto mb-10">
      <h1 class="text-4xl font-black text-emerald-900 tracking-tight">Gestion des Utilisateurs</h1>
      <p class="text-slate-500 mt-2 text-lg">Administrez les accès de votre plateforme avec élégance.</p>
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <div class="lg:col-span-4 bg-white rounded-[2.5rem] p-8 shadow-[20px_20px_60px_#d1d9e6,-20px_-20px_60px_#ffffff] lg:sticky lg:top-8">
        <h2 class="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
          <span class="w-2.5 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full"></span>
          {{ isEditing ? "Modifier" : "Nouveau" }}
        </h2>

        <div class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Nom</label>
              <input v-model="newUser.lastName" type="text" class="w-full rounded-2xl px-5 py-3 bg-slate-50 border-none outline-none shadow-[inset_2px_2px_5px_#b8b9be,inset_-3px_-3px_7px_#ffffff] focus:ring-2 focus:ring-emerald-500/50 transition-all" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Prénom</label>
              <input v-model="newUser.firstName" type="text" class="w-full rounded-2xl px-5 py-3 bg-slate-50 border-none outline-none shadow-[inset_2px_2px_5px_#b8b9be,inset_-3px_-3px_7px_#ffffff] focus:ring-2 focus:ring-emerald-500/50 transition-all" />
            </div>
          </div>

          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Email</label>
            <input v-model="newUser.email" type="email" class="w-full rounded-2xl px-5 py-3 bg-slate-50 border-none outline-none shadow-[inset_2px_2px_5_#b8b9be,inset_-3px_-3px_7px_#ffffff] focus:ring-2 focus:ring-emerald-500/50 transition-all" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Pass</label>
              <input v-model="newUser.password" type="password" class="w-full rounded-2xl px-5 py-3 bg-slate-50 border-none outline-none shadow-[inset_2px_2px_5_#b8b9be,inset_-3px_-3px_7px_#ffffff] focus:ring-2 focus:ring-emerald-500/50 transition-all" />
            </div>
            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Rôle</label>
              <select v-model="newUser.role" class="w-full rounded-2xl px-5 py-3 bg-slate-50 border-none outline-none shadow-[inset_2px_2px_5_#b8b9be,inset_-3px_-3px_7px_#ffffff] focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer">
                <option value="admin">Admin</option>
                <option value="gerant">Gérant</option>
                <option value="agent">Agent</option>
              </select>
            </div>
          </div>

          <div class="pt-6">
            <button 
              @click="handleAddOrUpdate" 
              :disabled="loading"
              class="btn-premium w-full py-4 rounded-2xl font-black text-white bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 shadow-[0_15px_30px_-10px_rgba(16,185,129,0.5)] hover:shadow-emerald-500/40 hover:-translate-y-1 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
            >
              {{ loading ? 'SYNCHRONISATION...' : (isEditing ? 'SAUVEGARDER' : 'AJOUTER AU PARC') }}
            </button>
            
            <button 
              v-if="isEditing" 
              @click="resetForm" 
              class="w-full mt-4 text-slate-400 text-[10px] font-black uppercase tracking-tighter hover:text-rose-500 transition-colors"
            >
              Annuler l'édition
            </button>
          </div>
        </div>
      </div>

      <div class="lg:col-span-8 bg-white rounded-[2.5rem] p-8 shadow-[20px_20px_60px_#d1d9e6,-20px_-20px_60px_#ffffff] overflow-hidden">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-bold text-slate-800">Liste des membres</h2>
          <span class="bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
            {{ users.length }} inscrits
          </span>
        </div>

        <div class="overflow-hidden rounded-3xl"> 
          <table class="w-full border-separate border-spacing-y-3 table-fixed"> 
            <thead>
              <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                <th class="px-6 text-left w-1/2">Utilisateur</th> 
                <th class="px-6 text-center w-1/4">Rôle</th>
                <th class="px-6 text-right w-1/4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading && users.length === 0">
                <td colspan="3" class="py-12 text-center text-emerald-600 font-bold animate-pulse uppercase tracking-widest text-xs">
                  Récupération des données...
                </td>
              </tr>

              <tr 
                v-for="user in paginatedUsers" 
                :key="user.id" 
                class="group transition-all duration-500 relative overflow-hidden"
                :class="editingId === user.id ? 'scale-[1.01] z-10' : ''"
              >
                <td 
                  class="px-6 py-4 rounded-l-2xl transition-all duration-500 relative overflow-hidden"
                  :class="editingId === user.id ? 'bg-emerald-50' : 'bg-slate-50 group-hover:bg-emerald-50/30'"
                >
                  <div v-if="editingId === user.id" class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                  <div class="relative z-10 truncate"> 
                    <span class="block font-black text-slate-700 truncate">{{ user.firstName }} {{ user.lastName }}</span>
                    <span class="block text-[11px] text-slate-400 font-medium italic truncate">{{ user.email }}</span>
                  </div>
                </td>

                <td 
                  class="px-6 py-4 text-center transition-all duration-500"
                  :class="editingId === user.id ? 'bg-emerald-50' : 'bg-slate-50 group-hover:bg-emerald-50/30'"
                >
                  <span :class="{
                    'bg-white text-purple-600 border-purple-100': user.role === 'admin',
                    'bg-white text-amber-600 border-amber-100': user.role === 'gerant',
                    'bg-white text-blue-600 border-blue-100': user.role === 'agent'
                  }" class="inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border shadow-sm">
                    {{ user.role }}
                  </span>
                </td>

                <td 
                  class="px-6 py-4 rounded-r-2xl text-right transition-all duration-500"
                  :class="editingId === user.id ? 'bg-emerald-50' : 'bg-slate-50 group-hover:bg-emerald-50/30'"
                >
                  <div class="flex justify-end gap-2 relative z-10">
                    <button @click="editUser(user)" 
                      class="p-2 rounded-xl transition-all duration-300"
                      :class="editingId === user.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white border border-slate-100 text-emerald-600 hover:bg-emerald-50'"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button @click="deleteUser(user.id)" class="p-2 rounded-xl bg-white border border-slate-100 text-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-8 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <p>Page {{ currentPage }} / {{ totalPages }}</p>
          <div class="flex gap-3">
            <button @click="setPage(currentPage - 1)" :disabled="currentPage === 1" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] disabled:opacity-30 active:scale-90 transition-all text-lg font-bold">«</button>
            <button @click="setPage(currentPage + 1)" :disabled="currentPage === totalPages" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] disabled:opacity-30 active:scale-90 transition-all text-lg font-bold">»</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.btn-premium {
  position: relative;
  overflow: hidden;
}
.btn-premium::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: rotate(45deg);
  transition: 0.5s;
}
.btn-premium:hover::after {
  left: 100%;
}
</style>