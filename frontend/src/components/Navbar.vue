<script setup>
import { Bell } from "lucide-vue-next";
import { defineProps } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "Tableau de bord"
  }
});
</script>

<template>
  <header class="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8">
    
    <h1 class="text-[20px] font-bold text-[#1e293b]">
      {{ title }}
    </h1>

    <div class="flex items-center gap-6">
      <div class="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span class="text-[11px] font-bold text-green-700 tracking-wider">ONLINE</span>
      </div>

      <div class="relative p-2 hover:bg-gray-50 rounded-full cursor-pointer transition-colors group">
        <Bell class="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
        <span class="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
      </div>

      <div class="h-8 w-[1px] bg-gray-100 mx-1"></div>

      <div class="flex items-center gap-3 pl-2">
        <div class="text-right">
          <p class="text-sm font-bold text-gray-900 leading-none">Jean Dupont</p>
          <p class="text-[12px] text-gray-500 mt-1">Administrateur</p>
        </div>
        
        <div class="w-10 h-10 bg-[#dcfce7] text-[#15803d] flex items-center justify-center rounded-full font-bold text-sm border border-green-100 shadow-sm">
          JD
        </div>
      </div>
    </div>
  </header>
</template>