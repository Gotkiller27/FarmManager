import { Router } from "express";
import * as agentsControllers from "../controllers/agents.controller.js";

const router = Router();


router.get("/", agentsControllers.getAll);
router.post("/:id", agentsControllers.addAgent);
router.put("/:id", agentsControllers.update);
router.delete("/:id", agentsControllers.deleteOne);

export default router;