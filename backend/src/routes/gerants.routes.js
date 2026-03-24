import { Router } from "express";
import * as gerantsControllers from "../controllers/gerants.controller.js";

const router = Router();

router.get("/getAllagent", gerantsControllers.getAll);
router.post("/addProfil", gerantsControllers.addProfil);
router.put("/:id", gerantsControllers.update);
router.delete("/:id", gerantsControllers.deleteOne);

export default router;