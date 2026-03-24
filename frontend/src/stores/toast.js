import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let toastId = 0

  const addToast = (message, options = {}) => {
    const id = ++toastId
    const toast = {
      id,
      message,
      type: options.type || 'info',
      title: options.title || '',
      duration: options.duration !== undefined ? options.duration : 5000,
      persistent: options.persistent || false
    }

    toasts.value.push(toast)

    if (!toast.persistent && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration)
    }

    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    toasts.value = []
  }

  // Méthodes pratiques
  const success = (message, options = {}) => {
    return addToast(message, { ...options, type: 'success' })
  }

  const error = (message, options = {}) => {
    return addToast(message, { ...options, type: 'error', duration: 7000 })
  }

  const info = (message, options = {}) => {
    return addToast(message, { ...options, type: 'info' })
  }

  const warning = (message, options = {}) => {
    return addToast(message, { ...options, type: 'warning', duration: 6000 })
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    info,
    warning
  }
})
