import db from "../config/db.js";

// Récupérer tous les profils avec les infos de l'utilisateur (Jointure)
const getAllProfiles = async () => {
  const [rows] = await db.query(`
    SELECT p.*, u.email 
    FROM profiles p 
    JOIN users u ON p.user_id = u.id
  `);
  return rows;
};

// Créer ou compléter un profil
const createProfile = async (profileData) => {
  const { user_id, username, age, role, tel, bio, city } = profileData;
  const [result] = await db.query(
    "INSERT INTO profiles (user_id, username, age, role, tel, bio, city) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [user_id, username, age, role, tel, bio, city]
  );
  return result.affectedRows > 0 ? { id: result.insertId, ...profileData } : null;
};

// Mettre à jour un profil
const updateProfile = async (id, data) => {
  const { username, age, role, tel, bio, city } = data;
  const [result] = await db.query(
    "UPDATE profiles SET username=?, age=?, role=?, tel=?, bio=?, city=? WHERE user_id=?",
    [username, age, role, tel, bio, city, id]
  );
  return result.affectedRows > 0;
};

// Supprimer un profil
const deleteProfile = async (id) => {
  const [result] = await db.query("DELETE FROM profiles WHERE user_id = ?", [id]);
  return result.affectedRows > 0;
};

export { getAllProfiles, createProfile, updateProfile, deleteProfile };