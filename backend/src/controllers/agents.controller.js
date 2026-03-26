import * as agentService from "../services/agents.service.js";

export const getAll = async (req, res, next) => {
  try {
    const agents = await agentService.getAllAgents();
    res.status(200).json(agents);
  } catch (error) {
    next(error);
  }
};

export const addAgent = async (req, res, next) => {
  const id = req.params.id; // ID de l'utilisateur pour lequel on crée le profil agent
  try {
    const newAgent = await agentService.createAgentProfile(id, req.body);
    res.status(201).json({ message: "Profil Agent créé !", data: newAgent });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const success = await agentService.updateAgent(req.params.id, req.body);
    if (!success) return res.status(404).json({ message: "Agent non trouvé" });
    res.status(200).json({ message: "Profil Agent mis à jour ✅" });
  } catch (error) {
    next(error);
  }
};

export const deleteOne = async (req, res, next) => {
  try {
    const success = await agentService.deleteAgent(req.params.id);
    if (!success) return res.status(404).json({ message: "Agent non trouvé" });
    res.status(200).json({ message: "Agent supprimé 🗑️" });
  } catch (error) {
    next(error);
  }
};

