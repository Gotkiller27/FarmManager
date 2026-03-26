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


export const getAgentsByCampaign = async (req, res) => {
  const { id } = req.params; // ID de la campagne
  try {
    const query = `
      SELECT 
        ca.date_assignation, 
        ca.quota_initial, 
        ca.sujets_actuels,
        CONCAT(u.first_name, ' ', u.last_name) AS nom, 
        u.id AS user_id,
        u.email,
        a.tel,       -- On récupère le tel depuis la table 'agents'
        a.city       -- On peut aussi récupérer la ville si besoin
      FROM campagne_agents ca
      JOIN users u ON ca.agent_id = u.id
      JOIN agents a ON u.id = a.user_id  -- Jointure vers la table agents
      WHERE ca.campagne_id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erreur getAgentsByCampaign:", error);
    res.status(500).json({ error: error.message });
  }
};

export const assignAgentToCampaign = async (req, res) => {
  const { campagne_id, agent_id, quota } = req.body;

  try {
    // 1. VÉRIFIER SI L'AGENT EST DÉJÀ ASSIGNÉ À CETTE CAMPAGNE
    const [checkRows] = await db.execute(
      `SELECT * FROM campagne_agents WHERE campagne_id = ? AND agent_id = ?`,
      [campagne_id, agent_id]
    );

    if (checkRows.length > 0) {
      return res.status(400).json({ 
        message: "Cet agent est déjà assigné à cette campagne. Modifiez son quota existant si nécessaire." 
      });
    }

    // 2. COMPTER LE NOMBRE TOTAL DE SUJETS RÉELS (Table sujets)
    const [sujetsRows] = await db.execute(
      `SELECT COUNT(*) as total_sujets FROM sujets WHERE campagne_id = ?`, 
      [campagne_id]
    );
    const capaciteTotale = sujetsRows[0].total_sujets;

    // 3. CALCULER LE RESTE DISPONIBLE
    const [sumRows] = await db.execute(
      `SELECT IFNULL(SUM(quota_initial), 0) as total_assigne FROM campagne_agents WHERE campagne_id = ?`, 
      [campagne_id]
    );
    const resteDisponible = capaciteTotale - Number(sumRows[0].total_assigne);

    if (Number(quota) > resteDisponible) {
      return res.status(400).json({ 
        message: `Quota trop élevé. Il ne reste que ${resteDisponible} sujets libres.` 
      });
    }

    // 4. INSERTION FINALE
    const query = `
      INSERT INTO campagne_agents 
      (campagne_id, agent_id, quota_initial, sujets_actuels, role_dans_campagne, date_assignation) 
      VALUES (?, ?, ?, ?, 'Agent', NOW())
    `;
    
    await db.execute(query, [campagne_id, agent_id, quota, quota]);

    res.json({ success: true, message: "Agent assigné avec succès !" });

  } catch (error) {
    console.error("ERREUR SQL:", error);
    res.status(500).json({ error: "Erreur serveur lors de l'assignation", details: error.message });
  }
};