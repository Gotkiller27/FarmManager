import express from 'express';
import { getAllAgents, assignAgentToCampaign, getAgentsByCampaign } from '../controllers/agentscampaign.controller.js';

const router = express.Router();

router.get('/', getAllAgents);
router.post('/assign', assignAgentToCampaign);
router.get('/campaign/:id', getAgentsByCampaign);

export default router;