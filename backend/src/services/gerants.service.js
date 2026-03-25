import db from "../config/db.js";

// Récupérer tous les profils avec les infos de l'utilisateur (Jointure)
const getAllProfiles = async () => {
  const [rows] = await db.query(`
    SELECT 
    u.id,
    u.first_name, 
    u.last_name, 
    u.email, 
    u.role,
    p.age, 
    p.tel, 
    p.bio, 
    p.city
    FROM gerants p 
    JOIN users u ON p.user_id = u.id
  `);
  return rows;
};

// Créer ou compléter un profil
const createProfile = async (id, profileData) => {
  const {age, tel, bio, city } = profileData;
  const [result] = await db.query(
    "INSERT INTO gerants (  age, role, tel, bio, city) VALUES (?, ?, ?, ?, ?)",
    [ age, tel, bio, city]
  );
  return result.affectedRows > 0 ? {...profileData } : null;
};

// Mettre à jour un profil
const updateProfile = async (id, data) => {
  const {age, role, tel, bio, city } = data;
  const [result] = await db.query(
    "UPDATE gerants SET age=?, role=?, tel=?, bio=?, city=? , user_id=?",
    [age, role, tel, bio, city, id]
  );
  return result.affectedRows > 0;
};

// Supprimer un profil
const deleteProfile = async (id) => {
  const [result] = await db.query("DELETE FROM gerants WHERE user_id = ?", [id]);
  return result.affectedRows > 0;
};

export { getAllProfiles, createProfile, updateProfile, deleteProfile };