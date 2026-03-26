<script setup>
// Imports de styles
import './assets/responsive.css'
import Toast from '@/components/Toast.vue'
</script>

<template>
  <div>
    <transition name="view-fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const isDarkMode = ref(false);

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
      if (isDarkMode.value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', isDarkMode.value);
    };

    onMounted(() => {
      const savedMode = localStorage.getItem('darkMode') === 'true';
      isDarkMode.value = savedMode;
      if (savedMode) {
        document.documentElement.classList.add('dark');
      }
    });

    return {
      isDarkMode,
      toggleDarkMode,
    };
  },
};
</script>

<style>
/* Mode sombre */
.dark {
  background-color: #121212;
  color: #ffffff;
}

/* Mode clair */
:root {
  background-color: #ffffff;
  color: #000000;
}

/* Animation des vues */
.view-fade-enter-active, .view-fade-leave-active {
  transition: opacity 0.5s ease;
}
.view-fade-enter, .view-fade-leave-to {
  opacity: 0;
}
</style>
