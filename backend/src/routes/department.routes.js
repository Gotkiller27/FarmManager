import express from 'express';
import {assignGerantToDept,       
  getCurrentGerantByDept,   
  getAllGerants
} from '../controllers/departement.controller.js';

const router = express.Router();

router.get('/gerants', getAllGerants);
router.get('/:deptId/gerant', getCurrentGerantByDept);
router.post('/assign-gerant', assignGerantToDept); // Pour afficher le gérant actuel

export default router;