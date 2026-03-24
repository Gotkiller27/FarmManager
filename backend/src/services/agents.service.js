import db from "../config/db.js";

// Récupérer tous les agents avec leurs emails
const getAllAgents = async () => {
  const [rows] = await db.query(`
    SELECT a.*, u.email 
    FROM profiles_agents a 
    JOIN users u ON a.user_id = u.id
    WHERE u.role = 'agent'
  `);
  return rows;
};

// Créer un profil agent
const createAgentProfile = async (agentData) => {
  const { user_id, username, age, tel, bio, city, department } = agentData;
  const [result] = await db.query(
    "INSERT INTO profiles_agents (user_id, username, age, tel, bio, city, department) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [user_id, username, age, tel, bio, city, department]
  );
  return result.affectedRows > 0 ? { id: result.insertId, ...agentData } : null;
};

// Mettre à jour un agent
const updateAgent = async (id, data) => {
  const { username, age, tel, bio, city } = data;
  const [result] = await db.query(
    "UPDATE profiles_agents SET username=?, age=?, tel=?, bio=?, city=? WHERE user_id=?",
    [username, age, tel, bio, city, id]
  );
  return result.affectedRows > 0;
};

// Supprimer un agent
const deleteAgent = async (id) => {
  const [result] = await db.query("DELETE FROM profiles_agents WHERE user_id = ?", [id]);
  return result.affectedRows > 0;
};

export { getAllAgents, createAgentProfile, updateAgent, deleteAgent };