import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import { updateProfile, changePassword } from '../services/api'

export const useProfilStore = defineStore('profil', () => {
  const authStore = useAuthStore()
  const profile = ref(null)

  const loadProfile = async () => {
    if (!authStore.user?.id) return null
    // Initial load from auth user (basic info)
    profile.value = { ...authStore.user }
  }

  const updateProfileData = async (data) => {
    if (!authStore.user?.id) throw new Error('Utilisateur non connecté')
    const response = await updateProfile(authStore.user.id, data)
    // Backend returns updated full user
    profile.value = response.user
    authStore.user = response.user
    localStorage.setItem('user', JSON.stringify(response.user))
    return response
  }

  const updateUserPassword = async (data) => {
    if (!authStore.user?.id) throw new Error('Utilisateur non connecté')
    const response = await changePassword(authStore.user.id, data)
    return response
  }

  return {
    profile,
    loadProfile,
    updateProfileData,
    updateUserPassword
  }
})

