<script setup>
import {
  LayoutDashboard,
  Folder,
  User,
  Users,
  Bird,
  LogOut,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Contact
} from "lucide-vue-next";
import { h, ref, computed } from "vue";
import Navbar from "@/components/Navbar.vue";
import { useAuthStore } from "@/stores/auth.js"; 
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useToastStore } from '@/stores/toast'

const authStore = useAuthStore();
const toastStore = useToastStore();
const { user } = storeToRefs(authStore);
const router = useRouter();

// SVG custom (Gardés intacts)
const CowIcon = () => h("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", class: "w-5 h-5 min-w-[20px]" }, [h("path", { d: "M5 19v-6a7 7 0 0 1 14 0v6h-3v-6a4 4 0 0 0-8 0v6H5z" }), h("circle", { cx: "12", cy: "5", r: "2" })]);
const FishIcon = () => h("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", class: "w-5 h-5 min-w-[20px]" }, [h("path", { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" }), h("circle", { cx: "12", cy: "12", r: "3" })]);
const FarmIcon = () => h("svg", { viewBox: "0 0 64 64", fill: "currentColor", class: "w-8 h-8 min-w-[32px]" }, [h("path", { d: "M32 4 L4 24 L4 60 H28 V40 H36 V60 H60 V24 Z" })]);

// 1. CONFIGURATION DES ITEMS PAR RÔLE (Utilise tes composants d'icônes)
const sidebarItems = {
  admin: [
    { name: "Tableau de bord", icon: LayoutDashboard, path: "/layout-principale/dashboard" },
    { 
      name: "Départements", 
      icon: Folder, 
      children: [
        { name: "Volaille", icon: Bird, path: "/layout-principale/departments/volaille" },
        { name: "Bétail", icon: CowIcon, path: "/layout-principale/departments/betail" },
        { name: "Pisciculture", icon: FishIcon, path: "/layout-principale/departments/pisciculture" },
      ]
    },
    { name: "Gérants", icon:Contact, path: "/layout-principale/managers" },
    { name: "Agents", icon: Users, path: "/layout-principale/agents" },
    { name: "Utilisateurs", icon: User, path: "/layout-principale/users" },
  ],
  gerant: [
    { name: "Tableau de bord", icon: LayoutDashboard, path: "/layout-principale" },
    { 
      name: "Départements", 
      icon: Folder, 
      children: [
        { name: "Volaille", icon: Bird, path: "/layout-principale/departments/volaille" },
        { name: "Bétail", icon: CowIcon, path: "/layout-principale/departments/betail" },
        { name: "Pisciculture", icon: FishIcon, path: "/layout-principale/departments/pisciculture" },
      ]
    },
    { name: "Agents", icon: Users, path: "/layout-principale/agents" },
  ],
  agent: [
    { name: "Tableau de bord", icon: LayoutDashboard, path: "/layout-principale" },
    { name: "Mes campagnes", icon: ClipboardList, path: "/layout-principale/my-campaigns" },
  ]
};

// 2. CALCUL DU MENU SELON LE RÔLE (Sécurisé avec une valeur par défaut)
const menu = computed(() => {
  const role = user.value?.role?.toLowerCase();
  return sidebarItems[role] || sidebarItems['agent']; 
});

// ÉTATS
const activeItem = ref("Tableau de bord");
const sidebarOpen = ref(false); 
const openMenus = ref({ Départements: true }); 
const isCollapsed = ref(false);
const showLogoutModal = ref(false);

// LOGIQUE DE DÉCONNEXION
const handleLogout = () => {
  showLogoutModal.value = true;
};

const confirmLogout = () => {
  authStore.logout();
  showLogoutModal.value = false;
  toastStore.success("Vous avez été déconnecté avec succès.");
  router.push("/login");
};

const cancelLogout = () => {
  showLogoutModal.value = false;
};

// LOGIQUE DE NAVIGATION
const selectMenu = (name, type) => {
  activeItem.value = name;
  sidebarOpen.value = false;
  if (type === 'dept') isCollapsed.value = true;
  else isCollapsed.value = false;
};

const toggleSubMenu = (name) => {
  openMenus.value[name] = !openMenus.value[name];
  if (isCollapsed.value) isCollapsed.value = false;
};
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    
    <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"></div>

    <aside
      :class="[
        'fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-100 flex flex-col justify-between py-6 transition-all duration-300 ease-in-out group/sidebar overflow-hidden',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:static',
        isCollapsed ? 'w-20 lg:hover:w-64' : 'w-64'
      ]"
    >
      <div class="flex flex-col h-full w-64">
        
        <div class="px-6 mb-8 flex items-center gap-3 h-8 flex-shrink-0">
          <div class="text-green-600 flex-shrink-0">
            <FarmIcon class="stroke-[2.5px]" />
          </div>
          <span :class="['text-[#065f46] font-bold text-2xl tracking-tight transition-opacity duration-300 whitespace-nowrap', isCollapsed ? 'opacity-0 group-hover/sidebar:opacity-100' : 'opacity-100']">
            FarmManager
          </span>
        </div>

        <nav class="px-4 flex-1 nav-container">
          <ul class="space-y-1">
            <li v-for="item in menu" :key="item.name">
              
              <div v-if="item.children">
                <div
                  @click="toggleSubMenu(item.name)"
                  :class="['flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 font-medium group whitespace-nowrap', activeItem === item.name || openMenus[item.name] ? 'text-gray-900' : 'text-[#64748b] hover:bg-gray-50']"
                >
                  <component :is="item.icon" class="w-5 h-5 min-w-[20px] flex-shrink-0 text-[#94a3b8]" />
                  <div :class="['flex justify-between items-center w-full ml-4 transition-opacity duration-300', isCollapsed ? 'opacity-0 group-hover/sidebar:opacity-100' : 'opacity-100']">
                    <span>{{ item.name }}</span>
                    <component :is="openMenus[item.name] ? ChevronDown : ChevronRight" class="w-4 h-4 flex-shrink-0 text-gray-400" />
                  </div>
                </div>

                <ul v-show="openMenus[item.name] || isCollapsed" 
                    :class="['mt-1 ml-4 border-l-2 border-gray-50 space-y-1 overflow-hidden transition-all', isCollapsed ? 'max-h-0 group-hover/sidebar:max-h-96' : 'max-h-96']">
                  <li v-for="child in item.children" :key="child.name">
                    <router-link
                      :to="child.path"
                      @click="selectMenu(child.name, 'dept')"
                      :class="['flex items-center gap-3 ml-4 px-4 py-2 rounded-lg cursor-pointer transition-all text-[14px] font-medium whitespace-nowrap', activeItem === child.name ? 'bg-[#f0fdf4] text-[#16a34a]' : 'text-[#64748b] hover:bg-gray-50 hover:text-gray-900']"
                    >
                      <component :is="child.icon" class="w-4 h-4 min-w-[16px] flex-shrink-0" />
                      <span :class="['transition-opacity duration-300', isCollapsed ? 'opacity-0 group-hover/sidebar:opacity-100' : 'opacity-100']">
                        {{ child.name }}
                      </span>
                    </router-link>
                  </li>
                </ul>
              </div>

              <router-link v-else
                :to="item.path"
                @click="selectMenu(item.name, 'general')"
                :class="['flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 font-medium group whitespace-nowrap', activeItem === item.name ? 'bg-[#f0fdf4] text-[#16a34a]' : 'text-[#64748b] hover:bg-gray-50 hover:text-gray-900']"
              >
                <component :is="item.icon" :class="['w-5 h-5 min-w-[20px] flex-shrink-0', activeItem === item.name ? 'text-[#16a34a]' : 'text-[#94a3b8] group-hover:text-gray-600']" />
                <span :class="['ml-4 transition-opacity duration-300', isCollapsed ? 'opacity-0 group-hover/sidebar:opacity-100' : 'opacity-100']">
                  {{ item.name }}
                </span>
              </router-link>

            </li>
          </ul>
        </nav>

        <div class="px-4 mt-auto flex-shrink-0">
          <div class="border-t border-gray-100 pt-4">
            <div @click="handleLogout" class="flex items-center px-4 py-3 text-[#ef4444] cursor-pointer hover:bg-red-50 rounded-xl transition-all font-medium group whitespace-nowrap">
              <LogOut class="w-5 h-5 min-w-[20px] flex-shrink-0 transition-transform group-hover:-translate-x-1" />
              <span :class="['ml-4 text-[15px] transition-opacity duration-300', isCollapsed ? 'opacity-0 group-hover/sidebar:opacity-100' : 'opacity-100']">
                Déconnexion
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <header class="bg-white border-b border-gray-100 h-[72px] flex items-center shadow-sm">
        <Navbar :title="activeItem" :toggleSidebar="() => sidebarOpen = !sidebarOpen" :currentUser="user" />
      </header>
      <main class="flex-1 p-6 overflow-auto">
        <router-view />
      </main>
    </div>

    <!-- Modal de confirmation de déconnexion -->
    <div v-if="showLogoutModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div class="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl border border-gray-100">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut class="w-8 h-8 text-red-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Confirmer la déconnexion</h3>
          <p class="text-gray-600 mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
          
          <div class="flex gap-3">
            <button 
              @click="cancelLogout" 
              class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button 
              @click="confirmLogout" 
              class="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>