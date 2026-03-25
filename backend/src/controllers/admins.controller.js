import * as adminService from "../services/admins.service.js";

//Complèter un profil administrateur
const createAdmin = async (req, res, next) => {
  try {
    const adminData = req.body;
    const id = req.params.id

    const response = await adminService.createAdmins(id,adminData);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// Mettre à jour un administrateur existant
const updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const response = await adminService.updateAdmins(id, updateData);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};


export { createAdmin, updateAdmin };