
<script setup>
import { computed } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import Navbar from '@/components/Navbar.vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const currentDept = computed(() => auth.user?.departement || 'Administration Générale');
</script>

<style scoped>
.app-wrapper { display: flex; min-height: 100vh; }
.content-container { flex: 1; display: flex; flex-direction: column; background: #f4f7f6; }
.view-port { padding: 20px; flex: 1; }
</style>


<template>
  <div class="app-wrapper">
    <Sidebar />
    <div class="content-container">
      <Navbar :title="currentDept" />
      <main class="view-port">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>

</style>