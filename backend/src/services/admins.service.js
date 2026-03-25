import db from "../config/db.js"; // À adapter selon ta config DB

// Créer un nouvel administrateur
const createAdmins = async (user_id,adminData) => {
  try {
    const { age, tel, city, bio} = adminData;


    const [result] = await db.query(
      "INSERT INTO admins (user_id,age, tel, city, bio) VALUES (?, ?, ?, ?,?)",
      [user_id,age, tel, city, bio]
    );

    return { message: "Administrateur créé avec succès" };
  } catch (error) {
    throw error;
  }
};

// Mettre à jour un administrateur existant
const updateAdmins = async (adminId, updateData) => {
  try {
    const {age, tel, city, bio } = updateData;

    const [result] = await db.query(
      "UPDATE admins SET age = ?, tel = ?, city = ?, bio = ? WHERE user_id = ?" ,
      [age, tel, city, bio, adminId]
    );
    
    if (result.affectedRows === 0) {
      const err = new Error("Administrateur non trouvé ou aucune modification effectuée.");
      err.statusCode = 404;
      throw err;
    }

    return { message: "Administrateur mis à jour avec succès" };
  } catch (error) {
    throw error;
  }
};


export { createAdmins, updateAdmins };