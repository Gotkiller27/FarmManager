import express from 'express';
import { requireAuth } from '../middlewares/requireAuth.js';
import { 
  getCampaignsByDept, 
  createCampaign, 
  getCampaignById, 
  getCampaignExpenses, 
  getFeedings, 
  addFeeding, 
  getFeedingStats, 
  getSujetsByCampaign, 
  getSujetById,
  seedSujets, 
  getFeedingChartData,
  getHealthStats,
  getHealthHistory,
  addHealthRecord,
  recordVente,
  getVentes,
  getFinancialSummary,
  getFinancialChartData ,
  getMyCampaigns,
  assignGerantToDept,       
  getCurrentGerantByDept,   
  getAllGerants
} from '../controllers/campaign.controller.js';

const router = express.Router();

// ==========================================
// 1. ROUTES POST (ACTIONS)
// ==========================================
// On les met en haut pour qu'elles soient prioritaires
router.post('/', createCampaign);
router.post('/feeding', addFeeding);
router.post('/health-records', addHealthRecord); // <-- Celle-ci doit être bien visible
router.post('/sujets/batch', seedSujets);
router.get('/my-campaigns', requireAuth, getMyCampaigns);
// ==========================================
// 2. ROUTES GET SPÉCIFIQUES (DÉPARTEMENT)
// ==========================================
router.post('/departments/assign-gerant', assignGerantToDept);
router.get('/department/:deptId', requireAuth, getCampaignsByDept);
router.get('/gerants', getAllGerants); // Pour remplir ton menu déroulant <select>
router.get('/departments/:deptId/gerant', getCurrentGerantByDept); // Pour afficher le gérant actuel
// ==========================================
// 3. ROUTES GET PAR CAMPAGNE (:id)
// ==========================================
// Ici :id est une variable, Express va tester ces routes dans l'ordre
router.get('/:id/health-stats', getHealthStats);
router.get('/:id/health-history', getHealthHistory);
router.get('/:id/feeding-stats', getFeedingStats);   
router.get('/:id/feeding-chart', getFeedingChartData); 
router.get('/:id/feedings', getFeedings);             
router.get('/:id/sujets', getSujetsByCampaign);
router.get('/:id/sujets/:subjectId', getSujetById);
router.get('/:id/expenses', getCampaignExpenses);



// Enregistrer une nouvelle vente (Individuelle ou Lot)
router.post('/:id/ventes', recordVente);

// Récupérer la liste des ventes d'une campagne
router.get('/:id/ventes', getVentes);

// Récupérer le bilan financier (Recettes vs Dépenses)
router.get('/:id/financial-summary', getFinancialSummary);
// TOUJOURS METTRE LA ROUTE LA PLUS GÉNÉRIQUE EN DERNIER
router.get('/:id', getCampaignById);

// Route pour les données du graphique financier
router.get('/:id/financial-chart', getFinancialChartData);


export default router;