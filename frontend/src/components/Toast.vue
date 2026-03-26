<template>
  <teleport to="body">
    <transition-group name="toast" tag="div" class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
        @click="removeToast(toast.id)"
      >
        <div class="toast-icon">
          <component :is="getIcon(toast.type)" />
        </div>
        <div class="toast-content">
          <h4 v-if="toast.title" class="toast-title">{{ toast.title }}</h4>
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <button class="toast-close" @click.stop="removeToast(toast.id)">
          <X />
        </button>
      </div>
    </transition-group>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from '@/stores/toast'
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-vue-next'

const toastStore = useToastStore()

const toasts = computed(() => toastStore.toasts)

const getIcon = (type) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle
  }
  return icons[type] || Info
}
            
const removeToast = (id) => {
  toastStore.removeToast(id)
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  animation: slideIn 0.3s ease-out;
}

.toast-success {
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.95), rgba(56, 161, 105, 0.95));
  border-color: rgba(72, 187, 120, 0.3);
  color: white;
}

.toast-error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95));
  border-color: rgba(239, 68, 68, 0.3);
  color: white;
}

.toast-info {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(37, 99, 235, 0.95));
  border-color: rgba(59, 130, 246, 0.3);
  color: white;
}

.toast-warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(217, 119, 6, 0.95));
  border-color: rgba(245, 158, 11, 0.3);
  color: white;
}

.toast:hover {
  transform: translateX(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.toast-message {
  font-size: 13px;
  margin: 0;
  line-height: 1.4;
  opacity: 0.95;
}

.toast-close {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: currentColor;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Animations */
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .toast {
    padding: 14px;
  }
  
  .toast-title {
    font-size: 13px;
  }
  
  .toast-message {
    font-size: 12px;
  }
}
</style>
