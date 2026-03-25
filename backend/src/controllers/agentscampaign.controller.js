import db from '../config/db.js';

// 1. Lister tous les utilisateurs qui ont le rôle 'agent'
export const getAllAgents = async (req, res) => {
  try {
    // On cherche dans 'users' tous ceux qui sont marqués comme agents
    const query = `
      SELECT 
        id AS user_id, 
        CONCAT(first_name, ' ', last_name) AS nom, 
        email,
        role
      FROM users 
      WHERE role = 'agent'
    `;
    const [rows] = await db.execute(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur getAllAgents:", error);
    res.status(500).json({ error: error.message });
  }
};

// 2. Récupérer les agents d'une campagne spécifique
export const getAgentsByCampaign = async (req, res) => {
  const { id } = req.params; // ID de la campagne
  try {
    const query = `
      SELECT 
        ca.date_assignation, 
        ca.role_dans_campagne,
        CONCAT(u.first_name, ' ', u.last_name) AS nom, 
        u.id AS user_id,
        u.email
      FROM campagne_agents ca
      JOIN users u ON ca.agent_id = u.id
      WHERE ca.campagne_id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur getAgentsByCampaign:", error);
    res.status(500).json({ error: error.message });
  }
};

// 3. Assigner un agent à une campagne
export const assignAgentToCampaign = async (req, res) => {
  const { campagne_id, agent_id, role_dans_campagne } = req.body;

  try {
    // Vérification des doublons
    const [existing] = await db.execute(
      `SELECT * FROM campagne_agents WHERE campagne_id = ? AND agent_id = ?`,
      [campagne_id, agent_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Cet agent est déjà assigné." });
    }

    const query = `
      INSERT INTO campagne_agents (campagne_id, agent_id, date_assignation, role_dans_campagne) 
      VALUES (?, ?, NOW(), ?)
    `;
    await db.execute(query, [campagne_id, agent_id, role_dans_campagne || 'Agent de terrain']);

    res.status(201).json({ message: "Agent assigné avec succès." });
  } catch (error) {
    console.error("Erreur assignation:", error);
    res.status(500).json({ message: "Erreur lors de l'assignation", error: error.message });
  }
};