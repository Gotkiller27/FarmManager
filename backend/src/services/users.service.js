import db from "../config/db.js";
import bcrypt from "bcrypt";

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
    const updates = [];
    const values = [];
    
    if (updateData.first_name !== undefined) {
      updates.push('first_name = ?');
      values.push(updateData.first_name);
    }
    if (updateData.last_name !== undefined) {
      updates.push('last_name = ?');
      values.push(updateData.last_name);
    }
    if (updateData.email !== undefined) {
      updates.push('email = ?');
      values.push(updateData.email);
    }
    if (updateData.role !== undefined) {
      updates.push('role = ?');
      values.push(updateData.role);
    }
    if (updateData.age !== undefined) {
      updates.push('age = ?');
      values.push(updateData.age);
    }
    if (updateData.tel !== undefined) {
      updates.push('tel = ?');
      values.push(updateData.tel);
    }
    if (updateData.city !== undefined) {
      updates.push('city = ?');
      values.push(updateData.city);
    }
    if (updateData.bio !== undefined) {
      updates.push('bio = ?');
      values.push(updateData.bio);
    }

    if (updates.length === 0) {
      const err = new Error("Aucune modification fournie.");
      err.statusCode = 400;
      throw err;
    }

    values.push(userId);
    const sql = `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`;
    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      const err = new Error("Utilisateur non trouvé ou aucune modification effectuée.");
      err.statusCode = 404;
      throw err;
    }

    // Fetch updated user
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const changePassword = async (userId, passwordData) => {
  try {
    const { oldPassword, newPassword } = passwordData;

    if (!oldPassword || !newPassword) {
      const err = new Error("oldPassword et newPassword requis.");
      err.statusCode = 400;
      throw err;
    }

    // Fetch user
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    const user = rows[0];
    if (!user) {
      const err = new Error("Utilisateur non trouvé.");
      err.statusCode = 404;
      throw err;
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      const err = new Error("Mot de passe actuel incorrect.");
      err.statusCode = 401;
      throw err;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update
    const [result] = await db.query(
      "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
      [hashedPassword, userId]
    );

    if (result.affectedRows === 0) {
      const err = new Error("Erreur lors de la mise à jour du mot de passe.");
      err.statusCode = 500;
      throw err;
    }

    return { message: "Mot de passe mis à jour avec succès" };
  } catch (error) {
    throw error;
  }
};

export {
    getAllUsers,
    deleteUser,
    updateUser,
    changePassword
}
