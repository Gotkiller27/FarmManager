import Router from "express"
import * as authController from "../controllers/auth.controller.js"
const router = Router()

router.post("/admin", authController.login)
router.put("/users/:id", authController.updateProfile)

export default router;