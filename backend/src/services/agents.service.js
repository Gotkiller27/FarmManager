import db from "../config/db.js";

// Récupérer tous les agents avec leurs emails
const getAllAgents = async () => {
  const [rows] = await db.query(`
    SELECT a.*, u.email, u.first_name, u.last_name,u.role 
    FROM agents a 
    JOIN users u ON a.user_id = u.id
    WHERE u.role = 'agent'
  `);
  return rows;
};

// Créer un profil agent
const createAgentProfile = async (user_id,agentData) => {
  const { age, tel, bio, city } = agentData;
  const [result] = await db.query(
    "INSERT INTO agents (user_id, age, tel, bio, city) VALUES (?, ?, ?, ?, ?)",
    [user_id, age, tel, bio, city]
  );
  return result.affectedRows > 0 ? { ...agentData } : null;
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