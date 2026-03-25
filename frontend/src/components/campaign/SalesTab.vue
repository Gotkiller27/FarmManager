<script setup>
import { ref, onMounted, reactive, onUnmounted } from 'vue';
import { useCampaignStore } from '@/stores/campaignStore';
import { storeToRefs } from 'pinia';
import { Html5QrcodeScanner } from "html5-qrcode"; // Importation du scanner
import { 
  ShoppingCart, TrendingUp, DollarSign, 
  Scan, Plus, Clock, X, Loader2, Camera 
} from 'lucide-vue-next';
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore();
const campaignStore = useCampaignStore();
const { ventes, salesSummary } = storeToRefs(campaignStore);

const props = defineProps(['campaignId']);
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const showCamera = ref(false); // Pour afficher/masquer la zone caméra
let html5QrcodeScanner = null;

const form = reactive({
  type_vente: 'individuel',
  qr_token: '',
  quantite: 1, 
  prix_unitaire: '', 
  client_nom: ''
});

// FONCTION POUR DÉMARRER LE SCANNER
const startScanner = () => {
  showCamera.value = true;
  setTimeout(() => {
    html5QrcodeScanner = new Html5QrcodeScanner(
      "reader", 
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    html5QrcodeScanner.render((decodedText) => {
      form.qr_token = decodedText;
      stopScanner(); // Arrête après scan réussi
    }, () => {});
  }, 100);
};

// FONCTION POUR ARRÊTER LE SCANNER
const stopScanner = () => {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear().catch(err => console.error(err));
    html5QrcodeScanner = null;
  }
  showCamera.value = false;
};

const fetchSalesData = async () => {
  if (!props.campaignId) return;
  try {
    await Promise.all([
      campaignStore.fetchVentes(props.campaignId),
      campaignStore.fetchSalesSummary(props.campaignId)
    ]);
  } catch (err) {
    console.error("Erreur récup data:", err);
  }
};

const submitVente = async () => {
  isSubmitting.value = true;
  try {
    const finalData = { ...form };
    if (form.type_vente === 'individuel') {
      finalData.quantite = 1;
    }

    await campaignStore.addVente(props.campaignId, finalData);
    toastStore.success("Vente enregistrée avec succès.");
    isModalOpen.value = false;
    stopScanner(); // Sécurité : on éteint la caméra si ouverte
    
    Object.assign(form, {
      type_vente: 'individuel',
      qr_token: '',
      quantite: 1,
      prix_unitaire: '',
      client_nom: ''
    });
    
    await fetchSalesData();
  } catch (err) {
    toastStore.error("Erreur lors de l'enregistrement");
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(fetchSalesData);
onUnmounted(stopScanner); // Important pour couper la caméra si on quitte la page
</script>

<template>
  <div class="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6 bg-[#fdfdfd]">
    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
      <div>
        <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-[#065f46]">Gestion des Ventes</h2>
        <p class="text-green-600/60 text-xs sm:text-sm md:text-base font-medium">Suivi des sorties (Poussins/Sujets)</p>
      </div>
      <button @click="isModalOpen = true" class="w-full md:w-auto bg-[#065f46] text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3 rounded-lg md:rounded-2xl font-bold flex justify-center items-center gap-2 shadow-lg active:scale-95 transition-all text-xs sm:text-sm md:text-base">
        <Plus class="w-4 h-4 sm:w-5 sm:h-5" /> Enregistrer une Sortie
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <div class="bg-white p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm text-slate-800">
        <div class="flex items-center gap-4 mb-2">
          <div class="bg-green-100 p-3 rounded-xl text-green-600"><DollarSign class="w-4 h-4" /></div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recettes</p>
        </div>
        <p class="text-2xl md:text-3xl font-black">{{ Math.round(salesSummary?.recettes || 0).toLocaleString() }} FCFA</p>
      </div>

      <div class="bg-white p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm text-slate-800">
        <div class="flex items-center gap-4 mb-2">
          <div class="bg-red-100 p-3 rounded-xl text-red-600"><TrendingUp class="w-4 h-4" /></div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Charges</p>
        </div>
        <p class="text-2xl md:text-3xl font-black">{{ Math.round(salesSummary?.charges || 0).toLocaleString() }} FCFA</p>
      </div>

      <div :class="(salesSummary?.benefice || 0) >= 0 ? 'bg-[#10b981]' : 'bg-red-500'" class="p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] text-white shadow-xl transition-all">
        <div class="flex items-center gap-4 mb-2">
          <div class="bg-white/20 p-3 rounded-xl"><ShoppingCart class="w-4 h-4" /></div>
          <p class="text-[10px] font-bold text-white/70 uppercase tracking-widest">Bénéfice</p>
        </div>
        <p class="text-2xl md:text-3xl font-black">{{ Math.round(salesSummary?.benefice || 0).toLocaleString() }} FCFA</p>
      </div>
    </div>

    <div class="bg-white rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden text-slate-800">
      <div class="p-4 sm:p-5 md:p-6 border-b border-gray-50 flex items-center gap-2">
        <Clock class="w-4 h-4 sm:w-5 sm:h-5 text-[#065f46]" />
        <h3 class="text-sm sm:text-base md:text-lg font-bold text-slate-800">Historique des Ventes</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left min-w-[420px] sm:min-w-[560px] md:min-w-full">
          <thead>
            <tr class="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400">
              <th class="p-6">Client / Date</th>
              <th class="p-6">Sujet</th>
              <th class="p-6">Quantité / P.U</th>
              <th class="p-6">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="sale in ventes" :key="sale.id" class="hover:bg-green-50/30 transition-colors">
              <td class="p-6 text-sm">
                <p class="font-bold">{{ sale.client_nom || 'Client' }}</p>
                <p class="text-gray-400 text-xs">{{ new Date(sale.date_vente).toLocaleDateString() }}</p>
              </td>
              <td class="p-6">
                <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">
                  {{ sale.qr_code_token ? sale.qr_code_token.split('-').pop() : 'LOT' }}
                </span>
              </td>
              <td class="p-6 text-sm">
                <p class="font-medium">{{ sale.quantite || 0 }} sujets</p>
                <p class="text-gray-400 text-xs">{{ Math.round(sale.prix_unitaire).toLocaleString() }} FCFA/u</p>
              </td>
              <td class="p-6 font-black text-[#065f46] whitespace-nowrap">
                {{ Math.round(sale.prix_total).toLocaleString() }} FCFA
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex items-end md:items-center justify-center p-3 md:p-6 text-slate-800">
      <div class="bg-white rounded-t-[2rem] md:rounded-[2.5rem] w-full max-w-md sm:max-w-lg p-5 sm:p-6 md:p-8 shadow-2xl relative animate-in slide-in-from-bottom duration-300">
        <button @click="isModalOpen = false; stopScanner()" class="absolute top-4 right-4 sm:top-5 sm:right-5 text-gray-400 hover:text-red-500"><X /></button>
        <h3 class="text-lg sm:text-xl md:text-2xl font-black text-[#065f46] mb-4 sm:mb-5">Enregistrer une Vente</h3>
        
        <form @submit.prevent="submitVente" class="space-y-5">
          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Type de vente</label>
            <select v-model="form.type_vente" class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 font-bold outline-none">
              <option value="individuel">Individuel (Scanner QR)</option>
              <option value="lot">Vente en Lot</option>
            </select>
          </div>

          <div v-if="form.type_vente === 'individuel'">
            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Token QR Code</label>
            
            <div v-if="showCamera" class="mb-3 overflow-hidden rounded-2xl border-2 border-dashed border-green-200 bg-gray-50 p-2">
              <div id="reader" class="w-full overflow-hidden"></div>
              <button type="button" @click="stopScanner" class="w-full py-2 text-xs font-bold text-red-500 uppercase">Annuler le scan</button>
            </div>

            <div class="relative">
              <input v-model="form.qr_token" type="text" placeholder="Scannez ou entrez le token" class="w-full p-4 pr-14 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 outline-none">
              <button type="button" @click="startScanner" class="absolute right-2 top-2 p-2 bg-[#065f46] text-white rounded-xl hover:scale-105 transition-all">
                <Camera class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="grid gap-4" :class="form.type_vente === 'lot' ? 'grid-cols-2' : 'grid-cols-1'">
            <div v-if="form.type_vente === 'lot'">
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Quantité</label>
              <input v-model.number="form.quantite" type="number" min="1" required class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 outline-none">
            </div>
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">
                {{ form.type_vente === 'lot' ? 'Prix/Sujet (FCFA)' : 'Prix de Vente (FCFA)' }}
              </label>
              <input v-model.number="form.prix_unitaire" type="number" required class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 outline-none">
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Client</label>
            <input v-model="form.client_nom" type="text" placeholder="Nom de l'acheteur" class="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 outline-none">
          </div>

          <button type="submit" :disabled="isSubmitting" class="w-full bg-[#065f46] text-white py-4 rounded-2xl font-black shadow-lg flex justify-center items-center gap-2 transition-all">
            <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
            <span v-else>Confirmer la Vente</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>