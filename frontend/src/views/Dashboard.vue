<script setup>
import { ref, onMounted, computed } from 'vue';
import { 
  UsersIcon, 
  MapIcon, 
  BeakerIcon, 
  ChartBarIcon,
  PlusIcon,
  UserCircleIcon,
  IdentificationIcon
} from '@heroicons/vue/24/outline';
import { useUserStore } from '@/stores/userStore';


const userStore = useUserStore()

const totalGerants = computed(()=>{
  return userStore.countByRole("gerant")
})




const stats = ref([
  { name: 'Total Gérants', value: `${totalGerants.value}`, icon: UsersIcon, change: '+2 ce mois', status: 'positive' },
  { name: 'Départements', value: '4', icon: MapIcon, change: 'Stable', status: 'neutral' },
  { name: 'Campagnes', value: '28', icon: BeakerIcon, change: '+5 cette semaine', status: 'positive' },
  { name: 'Performance', value: '94%', icon: ChartBarIcon, change: '+1.5%', status: 'positive' },
]);

// On intègre l'objet "gerant" directement dans chaque département
const departements = ref([
  { 
    id: 1, 
    nom: 'Volaille', 
    description: 'Suivi des bandes de poulets de chair et pondeuses.', 
    campagnes_actives: 3,
    gerant: { name: 'Jean Dupont', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', online: true }
  },
  { 
    id: 2, 
    nom: 'Bétail', 
    description: 'Gestion du cheptel bovin et suivi santé.', 
    campagnes_actives: 1,
    gerant: { name: 'Michel Koffi', avatar: 'https://randomuser.me/api/portraits/men/46.jpg', online: false }
  },
  { 
    id: 3, 
    nom: 'Pisciculture', 
    description: 'Élevage de Tilapias en bassins hors-sol.', 
    campagnes_actives: 2,
    gerant: { name: 'Awa Diop', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', online: true }
  }
]);

const loading = ref(true);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 800);
  userStore.fetchUsers()
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8">
    
    <header class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900">
          Dashboard <span class="text-emerald-600">AgroTrack</span>
        </h1>
        <p class="text-slate-500 text-sm">Vue d'ensemble par département de production.</p>
      </div>
      <button class="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-emerald-200">
        <PlusIcon class="h-5 w-5" />
        Nouvelle Campagne
      </button>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div v-for="stat in stats" :key="stat.name" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-slate-500 text-xs font-bold uppercase tracking-wider">{{ stat.name }}</p>
            <h3 class="text-3xl font-black text-slate-900 mt-1">{{ stat.value }}</h3>
          </div>
          <div class="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <component :is="stat.icon" class="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>

    <section>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-slate-900">Suivi des Départements</h2>
        <span class="text-sm text-slate-500">{{ departements.length }} secteurs actifs</span>
      </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div v-for="dept in departements" :key="dept.id" class="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
          
          <div class="p-6 flex-1">
            <div class="flex justify-between items-start mb-4">
              <span class="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
                ID: 0{{ dept.id }}
              </span>
              <span class="text-xs font-bold text-slate-400 flex items-center gap-1">
                <BeakerIcon class="h-4 w-4" />
                {{ dept.campagnes_actives }} Campagnes
              </span>
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 mb-2">{{ dept.nom }}</h3>
            <p class="text-slate-500 text-sm leading-relaxed">
              {{ dept.description }}
            </p>
          </div>

          <div class="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="relative">
                <img :src="dept.gerant.avatar" class="h-10 w-10 rounded-full border-2 border-white shadow-sm" alt="Gérant">
                <span v-if="dept.gerant.online" class="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Gérant assigné</p>
                <p class="text-sm font-bold text-slate-800">{{ dept.gerant.name }}</p>
              </div>
            </div>
            <button class="p-2 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-colors">
              <IdentificationIcon class="h-5 w-5" />
            </button>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>