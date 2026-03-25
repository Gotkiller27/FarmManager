import Router from "express"
import * as usersControllers from "../controllers/users.controller.js";
const router = Router()

router.get("/getAll", usersControllers.getAll)
router.put("/:id", usersControllers.update)
router.put("/:id/password", usersControllers.changePassword)
router.delete("/:id", usersControllers.deleteOne)

export default router;