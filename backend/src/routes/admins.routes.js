import Router from "express"
import * as adminsController from "../controllers/admins.controller.js"
const router = Router()
router.get("/", adminsController.getAll)
router.post("/:id", adminsController.createAdmin)
router.put("/:id", adminsController.updateAdmin)


export default router;