import {Router} from "express"
import authRoutes from "./auth.routes.js"
import usersRoutes from "./users.routes.js";
import gerantsRoutes from "./gerants.routes.js"
import agentsRoutes from "./agents.routes.js";
import adminsRoutes from "./admins.routes.js"
import departmentRoutes from "./department.routes.js"
import agentCampaignRoutes from "./agentcampaign.routes.js"
import campaignRoutes from './campaign.routes.js';
const router = Router()

router.use("/auth", authRoutes)
router.use("/users", usersRoutes)
router.use("/agents",agentsRoutes )
router.use("/gerants", gerantsRoutes)
router.use("/departments", departmentRoutes)
router.use("/admins", adminsRoutes)
router.use('/agentCampaign', agentCampaignRoutes)
router.use('/campaigns', campaignRoutes);
export default  router