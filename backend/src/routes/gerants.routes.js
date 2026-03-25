import { Router } from "express";
import * as gerantsControllers from "../controllers/gerants.controller.js";

const router = Router();

router.get("/getAllGerants", gerantsControllers.getAll);
router.post("/:id", gerantsControllers.addProfil);
router.put("/:id", gerantsControllers.update);
router.delete("/:id", gerantsControllers.deleteOne);

export default router;