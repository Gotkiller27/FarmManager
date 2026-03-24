import db from "../config/db.js"

const getAllUsers = async ()=>{
  
        const [rows] = await db.query("SELECT * FROM users")

        if(!rows){
            const err = new Error("Aucun utilisateur trouvé")
            err.statusCode = 404
            throw err
        }

        return rows
} 

const deleteUser = async (userId) => {
  try {
    // On exécute la commande DELETE avec l'ID en paramètre
    const [result] = await db.query(
      "DELETE FROM users WHERE id = ?",
      [userId]
    );

    // result.affectedRows indique combien de lignes ont été supprimées
    if (result.affectedRows === 0) {
      const err = new Error("Utilisateur non trouvé ou déjà supprimé.");
      err.statusCode = 404;
      throw err;
    }

    return { message: "Utilisateur supprimé avec succès" };
  } catch (error) {
    throw error; // On laisse le contrôleur gérer l'erreur
  }
};

const updateUser = async (userId, updateData) => {
  try {
    const { first_name, last_name, email, role } = updateData;

    // 1. On exécute l'UPDATE
    const [result] = await db.query(
      "UPDATE users SET first_name = ?, last_name = ?, email = ?, role = ? WHERE id = ?",
      [first_name, last_name, email, role, userId]
    );

    // 2. On vérifie si une ligne a été modifiée
    if (result.affectedRows === 0) {
      const err = new Error("Utilisateur non trouvé ou aucune modification effectuée.");
      err.statusCode = 404;
      throw err;
    }

    return { id: userId, ...updateData };
  } catch (error) {
    throw error;
  }
};

export {
    getAllUsers,
    deleteUser,
    updateUser
}