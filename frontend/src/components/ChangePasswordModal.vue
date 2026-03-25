<script setup>
import { ref, watch } from 'vue';
import { XMarkIcon, CheckIcon } from '@heroicons/vue/24/outline';
import { useToast } from '@/stores/toast';

const props = defineProps({ isOpen: Boolean });
const emit = defineEmits(['close', 'save']);

const toast = useToast();
const form = ref({ oldPassword: '', newPassword: '', confirmPassword: '' });

watch(() => props.isOpen, () => {
  if (!props.isOpen) {
    form.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
  }
});

const handleSave = () => {
  if (form.value.newPassword !== form.value.confirmPassword) {
    toast.error('Les nouveaux mots de passe ne correspondent pas');
    return;
  }
  if (form.value.newPassword.length < 6) {
    toast.error('Le mot de passe doit faire au moins 6 caractères');
    return;
  }
  emit('save', form.value);
};
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <Transition name="slide-up">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
            <h3 class="text-xl font-semibold text-slate-900">Changer le mot de passe</h3>
            <button @click="$emit('close')" class="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <XMarkIcon class="h-5 w-5 text-slate-400" />
            </button>
          </div>

          <div class="p-8 space-y-5">
            <div class="space-y-1.5">
              <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Mot de passe actuel</label>
              <input v-model="form.oldPassword" type="password" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all" />
            </div>
            <div class="space-y-1.5">
              <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nouveau mot de passe</label>
              <input v-model="form.newPassword" type="password" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all" />
            </div>
            <div class="space-y-1.5">
              <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Confirmer nouveau mot de passe</label>
              <input v-model="form.confirmPassword" type="password" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-all" />
            </div>
          </div>

          <div class="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <button @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-slate-500">Annuler</button>
            <button @click="handleSave" class="px-8 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all">
              <CheckIcon class="h-4 w-4" /> Changer
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from { transform: translateY(20px); opacity: 0; }
</style>
