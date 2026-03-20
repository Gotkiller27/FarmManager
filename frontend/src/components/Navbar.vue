<script setup>
import { Bell, Menu, User } from "lucide-vue-next";
import { defineProps } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  title: {
    type: String,
    default: "Tableau de bord"
  },
  toggleSidebar: {
    type: Function,
    required: true
  }
});

// Redirection profil
const goToProfile = () => {
  router.push("/profile"); 
};
</script>

<template>
  <header class="w-full h-full bg-white flex items-center justify-between px-4 lg:px-8 border-b border-gray-100">
  
    <div class="flex items-center gap-4">
      
      <button 
        class="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600"
        @click="toggleSidebar"
      >
        <Menu class="w-6 h-6" />
      </button>

      <h1 class="text-[20px] font-bold text-[#1e293b] tracking-tight">
        {{ title }}
      </h1>
    </div>

    <div class="flex items-center gap-4 lg:gap-6">

      <div class="relative p-2 hover:bg-gray-50 rounded-full cursor-pointer transition-all group">
        <Bell class="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </div>

      <div class="h-8 w-[1px] bg-gray-100 hidden sm:block"></div>

      <!-- 🔥 PROFILE RESPONSIVE -->
<div 
  @click="goToProfile"
  class="cursor-pointer group"
>

  <!-- 📱 MOBILE -->
  <div class="flex flex-col items-center sm:hidden">
    <div class="w-9 h-9 bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center rounded-full group-hover:bg-[#dcfce7] transition border border-green-50">
      <User class="w-5 h-5 stroke-[2.5px]" />
    </div>

    <span class="text-[11px] text-gray-500 mt-1 group-hover:text-[#16a34a]">
      Jean
    </span>
  </div>

  <!-- 💻 TABLET & DESKTOP -->
  <div class="hidden sm:flex items-center gap-3">
    
    <!-- ICON -->
    <div class="w-10 h-10 bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center rounded-full group-hover:bg-[#dcfce7] transition border border-green-50">
      <User class="w-5 h-5 stroke-[2.5px]" />
    </div>

    <!-- TEXTE -->
    <div class="text-left leading-tight">
      <p class="text-sm font-semibold text-gray-900 group-hover:text-[#16a34a] transition">
        Jean Dupont
      </p>
      <p class="text-[12px] text-gray-500">
        Administrateur
      </p>
    </div>

  </div>
</div>

    </div>
  </header>
</template>

<style scoped>
h1, span {
  font-family: 'Inter', sans-serif;
}
</style>