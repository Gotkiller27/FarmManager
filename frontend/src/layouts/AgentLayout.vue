<script setup>
import Navbar from "@/components/Navbar.vue"; // import du header
import { ref } from "vue";
import { LayoutDashboard, Folder, LogOut, Sprout } from "lucide-vue-next";

const activeItem = ref("Tableau de bord");

const menu = [
  { name: "Tableau de bord", icon: LayoutDashboard, route: "#" },
  { name: "Mes campagnes", icon: Folder, route: "#" },
];
</script>

<template>
  <div class="flex h-screen bg-gray-50">

    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-100 flex flex-col justify-between py-6">
      <div class="px-6 mb-8 flex items-center gap-2">
        <div class="text-green-600">
          <Sprout class="w-8 h-8 stroke-[2.5px]" />
        </div>
        <span class="text-[#065f46] font-bold text-2xl tracking-tight">AgriManage</span>
      </div>

      <nav class="px-4 flex-1">
        <ul class="space-y-1">
          <li v-for="item in menu" :key="item.name">
            <div
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

      <div class="px-4 mt-auto">
        <div class="border-t border-gray-100 pt-4">
          <div class="flex items-center gap-4 px-4 py-3 text-[#ef4444] cursor-pointer hover:bg-red-50 rounded-xl transition-all font-medium group">
            <LogOut class="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span class="text-[15px]">Déconnexion</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Contenu principal -->
    <div class="flex-1 flex flex-col">
      <!-- Navbar importée -->
      <Navbar />

      <!-- Zone de contenu -->
      <main class="flex-1 p-6 overflow-auto">
        <router-view />
      </main>
    </div>

  </div>
</template>