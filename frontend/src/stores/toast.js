import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [],
  }),
  actions: {
    showToast({ message, type = 'info', duration = 3000 }) {
      const id = Date.now()
      this.toasts.push({ id, message, type })

      setTimeout(() => {
        this.removeToast(id)
      }, duration)
    },
    removeToast(id) {
      this.toasts = this.toasts.filter(toast => toast.id !== id)
    },
  },
})
