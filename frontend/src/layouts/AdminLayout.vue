<script setup>
import {
  LayoutDashboard,
  Folder,
  User,
  Users,
  Bird,
  LogOut,
  Sprout
} from "lucide-vue-next";
import { h, ref } from "vue";
import Navbar from "@/components/Navbar.vue";

// SVG custom pour Bétail (vache)
const CowIcon = () =>
  h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      class: "w-5 h-5"
    },
    [
      h("path", { d: "M5 19v-6a7 7 0 0 1 14 0v6h-3v-6a4 4 0 0 0-8 0v6H5z" }),
      h("circle", { cx: "12", cy: "5", r: "2" })
    ]
  );

// SVG custom pour Pisciculture (poisson)
const FishIcon = () =>
  h(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 64 64",
      fill: "currentColor",
      class: "w-5 h-5"
    },
    [
      // Corps du poisson
      h("path", { d: "M32 12c-11 0-20 6-20 14s9 14 20 14 20-6 20-14-9-14-20-14z" }),
      // Queue
      h("path", { d: "M52 26l10-4v16l-10-4z" }),
      // Oeil
      h("circle", { cx: "24", cy: "24", r: "2", fill: "black" })
    ]
  );

// Gestion du menu actif et dropdowns
const activeItem = ref("Tableau de bord");
const openMenus = ref({ Départements: false });

// Menu Admin
const menu = [
  { name: "Tableau de bord", icon: LayoutDashboard, route: "#" },
  { 
    name: "Départements", 
    icon: Folder,
    children: [
      { name: "Volaille", icon: Bird, route: "#" },
      { name: "Bétail", icon: CowIcon, route: "#" },
      { name: "Pisciculture", icon: FishIcon, route: "#" },
    ]
  },
  { name: "Gérants", icon: User, route: "#" },
  { name: "Agents", icon: Users, route: "#" },
  { name: "Utilisateurs", icon: Users, route: "#" },
];
</script>

<template>
  <div class="flex">
    <!-- SIDEBAR -->
    <aside class="w-64 h-screen bg-white border-r border-gray-100 flex flex-col justify-between py-6">
      <!-- Logo -->
      <div>
        <div class="px-6 mb-8 flex items-center gap-2">
          <div class="text-green-600">
            <Sprout class="w-8 h-8 stroke-[2.5px]" />
          </div>
          <span class="text-[#065f46] font-bold text-2xl tracking-tight">AgriManage</span>
        </div>

        <!-- Menu -->
        <nav class="px-4">
          <ul class="space-y-1">
            <li v-for="item in menu" :key="item.name">
              <!-- Dropdown avec enfants -->
              <div v-if="item.children" class="space-y-1">
                <div
                  @click="openMenus[item.name] = !openMenus[item.name]"
                  :class="[
                    'flex items-center justify-between gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 font-medium group',
                    activeItem === item.name || item.children.some(c => c.name === activeItem)
                      ? 'bg-[#f0fdf4] text-[#16a34a]'
                      : 'text-[#64748b] hover:bg-gray-50 hover:text-gray-900'
                  ]"
                >
                  <div class="flex items-center gap-4">
                    <component :is="item.icon" class="w-5 h-5 text-[#94a3b8] group-hover:text-gray-600" />
                    <span>{{ item.name }}</span>
                  </div>
                  <span>{{ openMenus[item.name] ? "▾" : "▸" }}</span>
                </div>

                <ul v-show="openMenus[item.name]" class="ml-6 mt-1 space-y-1">
                  <li v-for="child in item.children" :key="child.name">
                    <div
                      @click="activeItem = child.name"
                      :class="[
                        'flex items-center gap-4 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 font-medium',
                        activeItem === child.name
                          ? 'bg-[#f0fdf4] text-[#16a34a]'
                          : 'text-[#64748b] hover:bg-gray-50 hover:text-gray-900'
                      ]"
                    >
                      <component :is="child.icon" class="w-5 h-5" />
                      <span>{{ child.name }}</span>
                    </div>
                  </li>
                </ul>
              </div>

              <!-- Item normal -->
              <div v-else
                @click="activeItem = item.name"
                :class="[
                  'flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 font-medium group',
                  activeItem === item.name ? 'bg-[#f0fdf4] text-[#16a34a]' : 'text-[#64748b] hover:bg-gray-50 hover:text-gray-900'
                ]"
              >
                <component 
                  :is="item.icon" 
                  :class="['w-5 h-5 transition-colors', activeItem === item.name ? 'text-[#16a34a]' : 'text-[#94a3b8] group-hover:text-gray-600']" 
                />
                <span>{{ item.name }}</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Déconnexion -->
      <div class="px-4 mt-auto">
        <div class="border-t border-gray-100 pt-4">
          <div class="flex items-center gap-4 px-4 py-3 text-[#ef4444] cursor-pointer hover:bg-red-50 rounded-xl transition-all font-medium group">
            <LogOut class="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span class="text-[15px]">Déconnexion</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- CONTENU -->
    <div class="flex-1 flex flex-col">
      <!-- NAVBAR -->
      <Navbar :title="activeItem" />

      <!-- PAGE -->
      <main class="p-6 bg-gray-100 min-h-screen">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
span { font-family: 'Inter', sans-serif; }
</style>