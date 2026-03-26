import db from "../config/db.js"; // À adapter selon ta config DB

// Récupérer tous les profils avec les infos de l'utilisateur
const getAllProfiles = async () => {
  const [rows] = await db.query( `
    SELECT u.id, u.first_name, u.last_name, u.email, u.role,
           p.age, p.tel, p.bio, p.city
    FROM users u
   LEFT JOIN admins p  ON p.user_id = u.id
  `);
  return rows;
};

// Créer un nouvel administrateur
const createAdmins = async (user_id, profileData) => {
  const { age, tel, city, bio } = profileData;
  
  // Utilisation de ON DUPLICATE KEY UPDATE pour éviter l'erreur de clé primaire
  const query = `
    INSERT INTO admins (user_id, age, tel, city, bio) 
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      age = VALUES(age), 
      tel = VALUES(tel), 
      city = VALUES(city), 
      bio = VALUES(bio)
  `;

  try {
    const [result] = await db.query(query, [user_id, age, tel, city, bio]);
    return { success: true, affectedRows: result.affectedRows };
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


export { createAdmins, updateAdmins, getAllProfiles };