import db from "../config/db.js";

// Récupérer tous les agents avec leurs emails
const getAllAgents = async () => {
  const [rows] = await db.query(`
    SELECT  u.id, u.first_name, u.last_name, u.email, u.role,
           p.age, p.tel, p.bio, p.city
    FROM  users u
    LEFT JOIN agents p ON p.user_id = u.id
    WHERE u.role = 'agent'
  `);
  return rows;
};

// Créer un profil agent
const createAgentProfile = async (user_id, profileData) => {
  const { age, tel, city, bio } = profileData;
  
  // Utilisation de ON DUPLICATE KEY UPDATE pour éviter l'erreur de clé primaire
  const query = `
    INSERT INTO agents (user_id, age, tel, city, bio) 
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

// Mettre à jour un agent
const updateAgent = async (id, data) => {
  const { age, tel, bio, city } = data;
  const [result] = await db.query(
    "UPDATE agents SET  age=?, tel=?, bio=?, city=? , user_id=?",
    [age, tel, bio, city, id]
  );
  return result.affectedRows > 0;
};

// Supprimer un agent
const deleteAgent = async (id) => {
  const [result] = await db.query("DELETE FROM agents WHERE user_id = ?", [id]);
  return result.affectedRows > 0;
};

export { getAllAgents, createAgentProfile, updateAgent, deleteAgent };