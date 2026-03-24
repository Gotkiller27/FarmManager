<script setup>
// Importer les styles globaux
import './assets/css/main.css'
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
/* Reset et styles globaux */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #2d3748;
  background-color: #f7fafc;
}

#app {
  min-height: 100vh;
}

/* Scrollbar stylisée */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #48bb78, #38a169);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #38a169, #2d7d46);
}

/* Animations globales */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

/* Selection text color */
::selection {
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
}

/* Focus styles pour accessibilité */
button:focus,
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid #48bb78;
  outline-offset: 2px;
}
</style>
