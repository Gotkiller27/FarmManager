import Router from "express"
import authRoutes from "./auth.routes.js"
import usersRoutes from "./users.routes.js";
import campaignRoutes from './campaign.routes.js';
const router = Router()

router.use("/auth", authRoutes)
router.use("/users", usersRoutes)
router.use('/campaigns', campaignRoutes);
export default  router