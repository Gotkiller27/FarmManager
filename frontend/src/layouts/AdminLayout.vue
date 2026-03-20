<script setup>
import {
  LayoutDashboard,
  Folder,
  User,
  Users,
  Bird,
  LogOut,
  Sprout,
  ChevronDown,
  ChevronRight
} from "lucide-vue-next";
import { h, ref } from "vue";
import Navbar from "@/components/Navbar.vue";

// ÉTATS
const activeItem = ref("Tableau de bord");
const sidebarOpen = ref(false); // Pour le menu mobile
const openMenus = ref({ Départements: true }); // Les menus déroulants ouverts par défaut

// SVG custom (Bétail et Pisciculture)
const CowIcon = () =>
  h("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", class: "w-5 h-5" }, [
    h("path", { d: "M5 19v-6a7 7 0 0 1 14 0v6h-3v-6a4 4 0 0 0-8 0v6H5z" }),
    h("circle", { cx: "12", cy: "5", r: "2" })
  ]);

const FishIcon = () =>
  h("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", class: "w-5 h-5" }, [
    h("path", { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" }),
    h("circle", { cx: "12", cy: "12", r: "3" })
  ]);

// STRUCTURE DU MENU
const menu = [
  { name: "Tableau de bord", icon: LayoutDashboard },
  { 
    name: "Départements", 
    icon: Folder,
    children: [
      { name: "Volaille", icon: Bird },
      { name: "Bétail", icon: CowIcon },
      { name: "Pisciculture", icon: FishIcon },
    ]
  },
  { name: "Gérants", icon: User },
  { name: "Agents", icon: Users },
  { name: "Utilisateurs", icon: Users },
];

const toggleSubMenu = (name) => {
  openMenus.value[name] = !openMenus.value[name];
};
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    
    <div 
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
    ></div>

    <aside
      :class="[
        'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-100 flex flex-col justify-between py-6 transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static'
      ]"
    >
      <div>
        <div class="px-6 mb-8 flex items-center gap-2">
          <div class="text-green-600">
            <Sprout class="w-8 h-8 stroke-[2.5px]" />
          </div>
          <span class="text-[#065f46] font-bold text-2xl tracking-tight">FarmManager</span>
        </div>

        <nav class="px-4 overflow-y-auto">
          <ul class="space-y-1">
            <li v-for="item in menu" :key="item.name">
              
              <div v-if="item.children">
                <div
                  @click="toggleSubMenu(item.name)"
                  :class="[
                    'flex justify-between items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 font-medium group',
                    activeItem === item.name || openMenus[item.name] ? 'text-gray-900' : 'text-[#64748b] hover:bg-gray-50'
                  ]"
                >
                  <div class="flex gap-4 items-center">
                    <component :is="item.icon" class="w-5 h-5 text-[#94a3b8]" />
                    <span>{{ item.name }}</span>
                  </div>
                  <component :is="openMenus[item.name] ? ChevronDown : ChevronRight" class="w-4 h-4 text-gray-400" />
                </div>

                <ul v-show="openMenus[item.name]" class="mt-1 ml-4 border-l-2 border-gray-50 space-y-1">
                  <li v-for="child in item.children" :key="child.name">
                    <div
                      @click="activeItem = child.name; sidebarOpen = false"
                      :class="[
                        'flex items-center gap-3 ml-4 px-4 py-2 rounded-lg cursor-pointer transition-all text-[14px] font-medium',
                        activeItem === child.name ? 'bg-[#f0fdf4] text-[#16a34a]' : 'text-[#64748b] hover:bg-gray-50 hover:text-gray-900'
                      ]"
                    >
                      <component :is="child.icon" class="w-4 h-4" />
                      {{ child.name }}
                    </div>
                  </li>
                </ul>
              </div>

              <div v-else
                @click="activeItem = item.name; sidebarOpen = false"
                :class="[
                  'flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 font-medium group',
                  activeItem === item.name ? 'bg-[#f0fdf4] text-[#16a34a]' : 'text-[#64748b] hover:bg-gray-50 hover:text-gray-900'
                ]"
              >
                <component 
                  :is="item.icon" 
                  :class="['w-5 h-5', activeItem === item.name ? 'text-[#16a34a]' : 'text-[#94a3b8] group-hover:text-gray-600']" 
                />
                <span>{{ item.name }}</span>
              </div>

            </li>
          </ul>
        </nav>
      </div>

      <div class="px-4 mt-auto">
        <div class="border-t border-gray-100 pt-4">
          <div class="flex items-center gap-4 px-4 py-3 text-[#ef4444] cursor-pointer hover:bg-red-50 rounded-xl transition-all font-medium group">
            <LogOut class="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span class="text-[15px]">Déconnexion</span>
          </div>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <header class="bg-white border-b border-gray-100 h-[72px] flex items-center shadow-sm">
        <Navbar 
          :title="activeItem" 
          :toggleSidebar="() => sidebarOpen = !sidebarOpen" 
        />
      </header>

      <main class="flex-1 p-6 overflow-auto">
        <router-view />
      </main>
    </div>

  </div>
</template>

<style scoped>
/* Optionnel : Police plus propre */
span, div {
  font-family: 'Inter', sans-serif;
}
</style>



