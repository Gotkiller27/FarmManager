<script setup>
import { onMounted, ref, computed } from "vue";
import { useUserStore } from "@/stores/userStore"; 
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { users, loading } = storeToRefs(userStore);

// État pour la recherche
const searchQuery = ref("");

// 1. Filtrer uniquement les GÉRANTS + Recherche
const filteredGerants = computed(() => {
  if (!Array.isArray(users.value)) return [];
  
  return users.value.filter(user => {
    const isGerant = user.role === 'gerant';
    
    // Sécurisation des noms (compatibilité camelCase et snake_case)
    const firstName = user.firstName || user.first_name || "";
    const lastName = user.lastName || user.last_name || "";
    const email = user.email || "";

    const fullName = `${firstName} ${lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.value.toLowerCase()) || 
                          email.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    return isGerant && matchesSearch;
  });
});

// Pagination
const currentPage = ref(1);
const itemsPerPage = 8;
const totalPages = computed(() => Math.ceil(filteredGerants.value.length / itemsPerPage) || 1);

const paginatedGerants = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredGerants.value.slice(start, start + itemsPerPage);
});

const setPage = (page) => { 
  if (page >= 1 && page <= totalPages.value) currentPage.value = page; 
};

onMounted(() => {
  userStore.fetchUsers();
});

const deleteGerant = async (id) => {
  if (confirm("Supprimer ce gérant du système AgriManage ?")) {
    await userStore.deleteUser(id);
  }
};
</script>

<template>
  <div class="min-h-screen p-4 md:p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-emerald-50 text-slate-800">
    
    <div class="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-4xl font-black text-emerald-900 tracking-tight">Les Gérants</h1>
        <p class="text-slate-500 mt-2 text-lg">Responsables d'exploitation AgriManage.</p>
      </div>

      <div class="relative w-full md:w-96 group">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-500 transition-transform group-focus-within:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Rechercher un gérant..." 
          class="w-full bg-white rounded-2xl pl-12 pr-5 py-4 border-none outline-none shadow-[10px_10px_30px_#d1d9e6,-5px_-5px_30px_#ffffff] focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium placeholder:text-slate-300"
        />
      </div>
    </div>

    <div class="max-w-7xl mx-auto bg-white rounded-[2.5rem] p-8 shadow-[20px_20px_60px_#d1d9e6,-20px_-20px_60px_#ffffff] overflow-hidden">
      
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-xl font-bold text-slate-800">Administration</h2>
        <span class="bg-emerald-100 text-emerald-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
          {{ filteredGerants.length }} responsables
        </span>
      </div>

      <div class="overflow-hidden rounded-3xl"> 
        <table class="w-full border-separate border-spacing-y-3 table-fixed"> 
          <thead>
            <tr class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              <th class="px-6 text-left w-1/2">Gérant</th> 
              <th class="px-6 text-center w-1/4">Rôle</th>
              <th class="px-6 text-right w-1/4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="3" class="py-12 text-center text-emerald-600 font-bold animate-pulse">Chargement des responsables...</td>
            </tr>
            <tr v-else-if="filteredGerants.length === 0">
              <td colspan="3" class="py-12 text-center text-slate-400 italic">Aucun gérant trouvé pour cette recherche.</td>
            </tr>

            <tr v-for="user in paginatedGerants" :key="user.id" class="group transition-all duration-300">
              <td class="px-6 py-4 rounded-l-2xl bg-slate-50 group-hover:bg-emerald-50/50 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-lg uppercase">
                    {{ (user.firstName || user.first_name || "?")[0] }}{{ (user.lastName || user.last_name || "")[0] }}
                  </div>
                  <div class="truncate">
                    <span class="block font-black text-slate-700 truncate">{{ user.firstName || user.first_name }} {{ user.lastName || user.last_name }}</span>
                    <span class="block text-[11px] text-slate-400 font-medium truncate">{{ user.email }}</span>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 text-center bg-slate-50 group-hover:bg-emerald-50/50 transition-colors">
                <span class="inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase bg-white text-emerald-600 border border-emerald-100 shadow-sm">
                  Gérant
                </span>
              </td>

              <td class="px-6 py-4 rounded-r-2xl text-right bg-slate-50 group-hover:bg-emerald-50/50 transition-colors">
                <div class="flex justify-end gap-2">
                  <button @click="deleteGerant(user.id)" class="p-2 rounded-xl bg-white border border-slate-100 text-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 1" class="mt-8 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <p>Page {{ currentPage }} / {{ totalPages }}</p>
        <div class="flex gap-3">
          <button @click="setPage(currentPage - 1)" :disabled="currentPage === 1" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-md disabled:opacity-30 active:scale-90 transition-all text-lg font-bold">«</button>
          <button @click="setPage(currentPage + 1)" :disabled="currentPage === totalPages" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-md disabled:opacity-30 active:scale-90 transition-all text-lg font-bold">»</button>
        </div>
      </div>
    </div>
  </div>
</template>