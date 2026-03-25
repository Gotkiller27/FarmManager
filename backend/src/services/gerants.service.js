import db from "../config/db.js";

// Récupérer tous les profils avec les infos de l'utilisateur
const getAllProfiles = async () => {
  const [rows] = await db.query(`
    SELECT u.id, u.first_name, u.last_name, u.email, u.role,
           p.age, p.tel, p.bio, p.city
    FROM gerants p 
    JOIN users u ON p.user_id = u.id
  `);
  return rows;
};

// Créer ou Mettre à jour (UPSERT)
const createProfile = async (user_id, profileData) => {
  const { age, tel, city, bio } = profileData;
  
  // Utilisation de ON DUPLICATE KEY UPDATE pour éviter l'erreur de clé primaire
  const query = `
    INSERT INTO gerants (user_id, age, tel, city, bio) 
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

const updateProfile = async (id, data) => {
  const { age, tel, bio, city } = data;
  const [result] = await db.query(
    "UPDATE gerants SET age=?, tel=?, bio=?, city=? WHERE user_id=?",
    [age, tel, bio, city, id]
  );
  return result.affectedRows > 0;
};

const deleteProfile = async (id) => {
  const [result] = await db.query("DELETE FROM gerants WHERE user_id = ?", [id]);
  return result.affectedRows > 0;
};

export { getAllProfiles, createProfile, updateProfile, deleteProfile };