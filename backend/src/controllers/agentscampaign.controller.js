import db from '../config/db.js';

// 1. Lister tous les agents disponibles (pour le multi-select)
export const getAllAgents = async (req, res) => {
  try {
    const query = `
      SELECT a.*, CONCAT(u.first_name, ' ', u.last_name) AS nom, u.email 
      FROM agents a 
      JOIN users u ON a.user_id = u.id
    `;
    const [rows] = await db.execute(query);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Assigner un agent à une campagne
export const assignAgentToCampaign = async (req, res) => {
  const { campagne_id, agent_id } = req.body;

  try {
    // On vérifie si l'agent est déjà dans cette campagne pour éviter les doublons
    const [existing] = await db.execute(
      `SELECT * FROM campagne_agents WHERE campagne_id = ? AND agent_id = ?`,
      [campagne_id, agent_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Cet agent est déjà assigné à cette campagne." });
    }

    const query = `INSERT INTO campagne_agents (campagne_id, agent_id, date_assignation) VALUES (?, ?, NOW())`;
    await db.execute(query, [campagne_id, agent_id]);

    res.status(201).json({ message: "Agent assigné avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'assignation de l'agent", error: error.message });
  }
};

// 3. Récupérer les agents d'une campagne spécifique
export const getAgentsByCampaign = async (req, res) => {
  const { id } = req.params; // ID de la campagne
  try {
    const query = `
      SELECT ca.date_assignation, CONCAT(u.first_name, ' ', u.last_name) AS nom, a.*
      FROM campagne_agents ca
      JOIN agents a ON ca.agent_id = a.user_id
      JOIN users u ON a.user_id = u.id
      WHERE ca.campagne_id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};