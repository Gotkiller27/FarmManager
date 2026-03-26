import * as gerantService from "../services/gerants.service.js";

export const getAll = async (req, res, next) => {
  try {
    const profiles = await gerantService.getAllProfiles();
    res.status(200).json(profiles);
  } catch (error) {
    next(error);
  }
};

export const addProfil = async (req, res, next) => {
  const id = req.params.id
  try {
    const newProfile = await gerantService.createProfile(id,req.body);
    res.status(201).json({ message: "Profil créé !", data: newProfile });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const isUpdated = await gerantService.updateProfile(req.params.id, req.body);
    if (!isUpdated) return res.status(404).json({ message: "Profil non trouvé" });
    res.status(200).json({ message: "Profil mis à jour ✅" });
  } catch (error) {
    next(error);
  }
};

export const deleteOne = async (req, res, next) => {
  try {
    const isDeleted = await gerantService.deleteProfile(req.params.id);
    if (!isDeleted) return res.status(404).json({ message: "Profil non trouvé" });
    res.status(200).json({ message: "Profil supprimé 🗑️" });
  } catch (error) {
    next(error);
  }
};