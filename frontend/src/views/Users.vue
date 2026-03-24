<script setup>
import { onMounted, ref, computed } from "vue";
import { useUserStore } from "@/stores/userStore"; 
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { users, loading } = storeToRefs(userStore);

// États pour la Modal et le Formulaire
const showModal = ref(false);
const newUser = ref({ first_name: "", last_name: "", email: "", role: "agent", password: "" });
const isEditing = ref(false);
const editingId = ref(null);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10; // On peut en afficher plus maintenant
const totalPages = computed(() => Math.ceil(users.value.length / itemsPerPage) || 1);
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return users.value.slice(start, start + itemsPerPage);
});

const setPage = (page) => { 
  if (page >= 1 && page <= totalPages.value) currentPage.value = page; 
};

onMounted(() => {
  userStore.fetchUsers();
});

// Ouvrir la modal pour ajout
const openAddModal = () => {
  resetForm();
  showModal.value = true;
};

// Ouvrir la modal pour édition
const editUser = (user) => {
  newUser.value = { ...user, password: "" }; 
  editingId.value = user.id;
  isEditing.value = true;
  showModal.value = true;
};

const handleAddOrUpdate = async () => {
  if (!newUser.value.email || !newUser.value.first_name) return alert("Champs requis !");

  if (isEditing.value) {
    const success = await userStore.updateUser(editingId.value, newUser.value);
    if (success) closeModal();
  } else {
    const success = await userStore.addUser(newUser.value);
    if (success) closeModal();
  }
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  newUser.value = { first_name: "", last_name: "", email: "", role: "agent", password: "" };
  isEditing.value = false;
  editingId.value = null;
};

const deleteUser = async (id) => {
  if (confirm("Voulez-vous vraiment supprimer ce membre d'AgriManage ?")) {
    await userStore.deleteUser(id);
  }
};
</script>

<template>
  <div class="min-h-screen p-4 md:p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-emerald-50 text-slate-800">
    
    <div class="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-4xl font-black text-emerald-900 tracking-tight">Membres AgriManage</h1>
        <p class="text-slate-500 mt-2 text-lg">Gérez les accès et les rôles de votre équipe.</p>
      </div>
      
      <button @click="openAddModal" class="btn-premium flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white bg-gradient-to-br from-emerald-500 to-teal-700 shadow-xl hover:-translate-y-1 transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
        </svg>
        NOUVEAU MEMBRE
      </button>
    </div>

    <div class="max-w-7xl mx-auto bg-white rounded-[2.5rem] p-8 shadow-[20px_20px_60px_#d1d9e6,-20px_-20px_60px_#ffffff]">
      <div class="overflow-hidden rounded-3xl"> 
        <table class="w-full border-separate border-spacing-y-3"> 
          <thead>
            <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              <th class="px-6 text-left">Utilisateur</th> 
              <th class="px-6 text-center">Rôle</th>
              <th class="px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedUsers" :key="user.id" class="group transition-all duration-300">
              <td class="px-6 py-4 rounded-l-2xl bg-slate-50 group-hover:bg-emerald-50/50 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-lg uppercase">
                    {{ (user.first_name || "?")[0] }}{{ (user.last_name || "")[0] }}
                  </div>
                  <div>
                    <span class="block font-black text-slate-700 truncate">{{ user.first_name }} {{ user.last_name }}</span>
                    <span class="block text-[11px] text-slate-400 font-medium italic">{{ user.email }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-center bg-slate-50 group-hover:bg-emerald-50/50 transition-colors">
                <span :class="{
                  'bg-white text-purple-600 border-purple-100': user.role === 'admin',
                  'bg-white text-amber-600 border-amber-100': user.role === 'gerant',
                  'bg-white text-blue-600 border-blue-100': user.role === 'agent'
                }" class="inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border shadow-sm">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 rounded-r-2xl text-right bg-slate-50 group-hover:bg-emerald-50/50 transition-colors">
                <div class="flex justify-end gap-2">
                  <button @click="editUser(user)" class="p-2 rounded-xl bg-white border border-slate-100 text-emerald-600 hover:bg-emerald-50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button @click="deleteUser(user.id)" class="p-2 rounded-xl bg-white border border-slate-100 text-rose-300 hover:text-rose-500 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div @click="closeModal" class="absolute inset-0 bg-emerald-900/20 backdrop-blur-md"></div>
        
        <div class="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-modal-in">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-black text-slate-800 flex items-center gap-3">
              <span class="w-2.5 h-8 bg-emerald-500 rounded-full"></span>
              {{ isEditing ? "Modifier Membre" : "Nouveau Membre" }}
            </h2>
            <button @click="closeModal" class="text-slate-400 hover:text-rose-500 transition-colors font-bold">FERMER</button>
          </div>

          <div class="space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Nom</label>
                <input v-model="newUser.last_name" type="text" class="input-neo w-full rounded-2xl px-5 py-3 bg-slate-50" />
              </div>
              <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Prénom</label>
                <input v-model="newUser.first_name" type="text" class="input-neo w-full rounded-2xl px-5 py-3 bg-slate-50" />
              </div>
            </div>

            <div>
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Email Professionnel</label>
              <input v-model="newUser.email" type="email" class="input-neo w-full rounded-2xl px-5 py-3 bg-slate-50" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Mot de Passe</label>
                <input v-model="newUser.password" type="password" placeholder="••••••••" class="input-neo w-full rounded-2xl px-5 py-3 bg-slate-50" />
              </div>
              <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Rôle</label>
                <select v-model="newUser.role" class="input-neo w-full rounded-2xl px-5 py-3 bg-slate-50 appearance-none cursor-pointer">
                  <option value="admin">Admin</option>
                  <option value="gerant">Gérant</option>
                  <option value="agent">Agent</option>
                </select>
              </div>
            </div>

            <div class="pt-6">
              <button @click="handleAddOrUpdate" class="btn-premium w-full py-4 rounded-2xl font-black text-white bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg active:scale-95 transition-all">
                {{ isEditing ? 'METTRE À JOUR' : 'CONFIRMER L\'AJOUT' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.input-neo {
  border: none;
  outline: none;
  transition: all 0.3s ease;
}
.input-neo:focus {
  box-shadow: inset 1px 1px 2px #b8b9be, inset -1px -1px 3px #ffffff;
  ring: 2px;
  ring-color: rgba(16, 185, 129, 0.2);
}

.animate-modal-in {
  animation: modalScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.btn-premium {
  position: relative;
  overflow: hidden;
}
.btn-premium::after {
  content: '';
  position: absolute;
  top: -50%; left: -50%; width: 200%; height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: rotate(45deg);
  transition: 0.5s;
}
.btn-premium:hover::after { left: 100%; }
</style>