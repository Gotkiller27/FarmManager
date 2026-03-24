import {Router} from "express"
import authRoutes from "./auth.routes.js"
import usersRoutes from "./users.routes.js";
import gerantsRoutes from "./gerants.routes.js"
import agentsRoutes from "./agents.routes.js";

const router = Router()

router.use("/auth", authRoutes)
router.use("/users", usersRoutes)
router.use("/agents",agentsRoutes )
router.use("/gerants", gerantsRoutes)

export default  router