import * as userService from "../services/users.service.js"


const getAll =async (req,res,next)=>{
    const users = await userService.getAllUsers()
    if(!users){
        const err = new Error("Users not found in file controllers")
        err.statusCode = 404
        throw err
    }

    return res
    .status(200)
    .json({message: "success ✅✅", users})


}

 const deleteOne = async (req, res, next) => {
  try {
    const { id } = req.params; // Récupère l'ID depuis /api/users/:id
    const response = await userService.deleteUser(id);
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

 const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await userService.updateUser(id, updateData);
    
    res.status(200).json({
      message: "Utilisateur mis à jour avec succès",
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const result = await userService.changePassword(id, { oldPassword, newPassword });
    
    res.status(200).json({
      message: "Mot de passe mis à jour avec succès",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export {
    getAll,
    deleteOne,
    update,
    changePassword
}
