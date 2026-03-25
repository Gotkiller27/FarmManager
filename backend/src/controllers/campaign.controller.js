import db from '../config/db.js';

export const getCampaignsByDept = async (req, res) => {
  const { deptId } = req.params;
  
  try {
    const query = `
      SELECT c.*, 
      (SELECT SUM(montant) FROM depenses_campagne WHERE campagne_id = c.id) as total_depenses,
      (SELECT COUNT(*) FROM campagne_agents WHERE campagne_id = c.id) as nb_agents
      FROM campagnes c 
      WHERE c.departement_id = ?
      ORDER BY c.date_debut DESC
    `;
    
    const [rows] = await db.execute(query, [deptId]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const createCampaign = async (req, res) => {
  const { nom, date_debut, date_fin_prevue, budget, gerant_id, departement_id } = req.body;

  try {
    const query = `
      INSERT INTO campagnes (nom, date_debut, date_fin_prevue, statut, budget, gerant_id, departement_id)
      VALUES (?, ?, ?, 'en_cours', ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      nom, 
      date_debut, 
      date_fin_prevue, 
      budget, 
      gerant_id, 
      departement_id
    ]);

    res.status(201).json({ 
      message: "Campagne créée avec succès !", 
      id: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création", error: error.message });
  }
};
export const getCampaignById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT c.*, 
      (SELECT SUM(montant) FROM depenses_campagne WHERE campagne_id = c.id) as total_depenses
      FROM campagnes c 
      WHERE c.id = ?
    `;
    const [rows] = await db.execute(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Campagne non trouvée" });
    }
    
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const getCampaignExpenses = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM depenses_campagne WHERE campagne_id = ? ORDER BY date_depense DESC',
      [id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dans ton backend (campaign.controller.js)
export const getFeedingStats = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        IFNULL(SUM(quantite_kg), 0) as total_kg,
        IFNULL(SUM(prix_total), 0) as total_cout,
        IFNULL(SUM(prix_total) / NULLIF(SUM(quantite_kg), 0), 0) as cout_moyen_kg
      FROM feedings 
      WHERE campagne_id = ?
    `;
    const [stats] = await db.execute(query, [id]);
    res.json(stats[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur stats SQL", error: err.message });
  }
};

// Dans campaign.controller.js
export const getFeedingChartData = async (req, res) => {
  const { id } = req.params; // ID de la campagne
  
  try {
    const query = `
      SELECT 
        DATE_FORMAT(date_distribution, '%d %b') as label, 
        SUM(quantite_kg) as total_day_kg
      FROM feedings
      WHERE campagne_id = ? 
      AND date_distribution > DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY date_distribution
      ORDER BY date_distribution ASC
    `;
    
    const [rows] = await db.execute(query, [id]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Erreur graphique", error: error.message });
  }
};
export const addFeeding = async (req, res) => {
  const { campagne_id, type_aliment_id, quantite_kg, prix_total } = req.body;

  try {
    const query = `
      INSERT INTO feedings 
      (campagne_id, type_aliment_id, quantite_kg, prix_total, date_distribution, heure_distribution)
      VALUES (?, ?, ?, ?, CURDATE(), CURTIME())
    `;

    await db.execute(query, [
      campagne_id, 
      type_aliment_id, 
      quantite_kg, 
      prix_total
    ]);

    res.status(201).json({ message: "Distribution enregistrée !" });
  } catch (error) {
    console.error(error.sqlMessage);
    res.status(500).json({ message: "Erreur SQL", details: error.sqlMessage });
  }
};
// Fonction pour récupérer l'historique complet des distributions
// Fonction pour récupérer l'historique complet des distributions
export const getFeedings = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        f.*, 
        t.nom as nom_aliment 
      FROM feedings f
      LEFT JOIN types_aliments t ON f.type_aliment_id = t.id
      WHERE f.campagne_id = ? 
      ORDER BY f.date_distribution DESC, f.heure_distribution DESC
    `;
    
    const [rows] = await db.execute(query, [id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
  }
};

export const seedSujets = async (req, res) => {
  const { campagne_id, type_precis, quantite, date_arrivee, provenance } = req.body;

  try {
    const values = [];
    for (let i = 0; i < quantite; i++) {
      // Génération d'un token unique pour le QR code
      const uniqueSuffix = Math.random().toString(36).substr(2, 6).toUpperCase();
      const qr_token = `AGRI-${campagne_id}-${uniqueSuffix}-${i+1}`;
      
      values.push([campagne_id, type_precis, date_arrivee, provenance, qr_token, 'vivant']);
    }

    // Requête d'insertion multiple (très rapide)
    const query = `
      INSERT INTO sujets 
      (campagne_id, type_precis, date_arrivee, provenance, qr_code_token, statut) 
      VALUES ?
    `;

    await db.query(query, [values]);

    res.status(201).json({ message: `${quantite} sujets générés.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la génération", error: error.message });
  }
};

export const getSujetsByCampaign = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM sujets WHERE campagne_id = ? ORDER BY id DESC',
      [id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addHealthRecord = async (req, res) => {
  const { campaignId, targetType, qr_token, type_acte, nom_produit, date_acte, notes } = req.body;

  try {
    if (targetType === 'individuel') {
      const [sujets] = await db.query('SELECT id FROM sujets WHERE qr_code_token = ?', [qr_token]);
      if (sujets.length === 0) return res.status(404).json({ message: "Sujet non trouvé" });
      const sujetId = sujets[0].id;

      await db.query(
        `INSERT INTO sante_sujets (sujet_id, type_acte, nom_produit, date_acte, notes) VALUES (?, ?, ?, ?, ?)`,
        [sujetId, type_acte, nom_produit, date_acte, notes]
      );

      // --- MISE À JOUR DU STATUT INDIVIDUEL ---
      let nouveauStatut = 'vivant';
      if (type_acte === 'deces') nouveauStatut = 'mort';
      else if (type_acte === 'traitement') nouveauStatut = 'malade';
      else if (type_acte === 'observation') nouveauStatut = 'observation';

      await db.query("UPDATE sujets SET statut = ? WHERE id = ?", [nouveauStatut, sujetId]);

    } else {
      // --- CAS DU LOT ---
      const [vivants] = await db.query("SELECT id FROM sujets WHERE campagne_id = ? AND statut != 'mort'", [campaignId]);
      if (vivants.length === 0) return res.status(400).json({ message: "Aucun sujet vivant" });

      const values = vivants.map(s => [s.id, type_acte, nom_produit, date_acte, notes]);
      await db.query(`INSERT INTO sante_sujets (sujet_id, type_acte, nom_produit, date_acte, notes) VALUES ?`, [values]);

      // --- MISE À JOUR DU STATUT POUR TOUT LE LOT ---
      let statutLot = 'vivant';
      if (type_acte === 'traitement') statutLot = 'malade';
      else if (type_acte === 'observation') statutLot = 'observation';

      if (type_acte !== 'vaccin' && type_acte !== 'deces') {
         await db.query("UPDATE sujets SET statut = ? WHERE campagne_id = ? AND statut != 'mort'", [statutLot, campaignId]);
      }
    }

    res.status(201).json({ message: "Enregistrement réussi !" });
  } catch (error) {
    console.error("Erreur Sante:", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const getHealthStats = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT statut, COUNT(*) as count FROM sujets WHERE campagne_id = ? GROUP BY statut`, 
      [id]
    );

    // 1. On initialise TOUT à zéro
    const counts = { vivant: 0, mort: 0, malade: 0, observation: 0 };

    // 2. On remplit avec les résultats de la base
    rows.forEach(row => {
      counts[row.statut] = row.count;
    });

    // 3. LA SOLUTION : On fusionne pour que ton graphique actuel comprenne
    // Ton code Vue fait : [stats.vivant, stats.malade, stats.mort]
    const dataForVue = {
      vivant: counts.vivant + counts.observation, // Fusionne les 2 dans la barre VERTE
      malade: counts.malade,                      // Reste dans la barre ORANGE
      mort: counts.mort                           // Reste dans la barre ROUGE
    };

    res.json(dataForVue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHealthHistory = async (req, res) => {
  const { id } = req.params; // id de la campagne
  try {
    const query = `
      SELECT h.*, s.qr_code_token 
      FROM sante_sujets h
      JOIN sujets s ON h.sujet_id = s.id
      WHERE s.campagne_id = ?
      ORDER BY h.date_acte DESC, h.created_at DESC
      LIMIT 50
    `;
    const [rows] = await db.execute(query, [id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- ROUTES POUR LES VENTES ---
// 1. Enregistrer une vente
export const recordVente = async (req, res) => {
    const { id } = req.params; // campaignId
    const { type_vente, qr_token, poids_kg, prix_unitaire, client_nom } = req.body;
    const prix_total = poids_kg * prix_unitaire;

    try {
        let sujetId = null;

        if (type_vente === 'individuel') {
            const [sujet] = await db.query("SELECT id FROM sujets WHERE qr_code_token = ?", [qr_token]);
            if (sujet.length === 0) return res.status(404).json({ message: "Sujet non trouvé" });
            sujetId = sujet[0].id;

            // Marquer le sujet comme vendu
            await db.query("UPDATE sujets SET statut = 'vendu' WHERE id = ?", [sujetId]);
        }

        const query = `
            INSERT INTO ventes (campagne_id, sujet_id, poids_kg, prix_unitaire, prix_total, client_nom) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await db.execute(query, [id, sujetId, poids_kg, prix_unitaire, prix_total, client_nom]);

        res.status(201).json({ message: "Vente enregistrée !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Récupérer l'historique des ventes
export const getVentes = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT v.*, s.qr_code_token 
            FROM ventes v 
            LEFT JOIN sujets s ON v.sujet_id = s.id 
            WHERE v.campagne_id = ? 
            ORDER BY v.date_vente DESC
        `;
        const [rows] = await db.execute(query, [id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Le Bilan Financier (Le plus important !)
export const getFinancialSummary = async (req, res) => {
    const { id } = req.params;
    try {
        // Total des ventes (Recettes)
        const [ventes] = await db.query("SELECT IFNULL(SUM(prix_total), 0) as total FROM ventes WHERE campagne_id = ?", [id]);
        
        // Total des dépenses d'aliments
        const [aliments] = await db.query("SELECT IFNULL(SUM(prix_total), 0) as total FROM feedings WHERE campagne_id = ?", [id]);
        
        // Total des autres dépenses (santé, achat poussins, etc.)
        const [depenses] = await db.query("SELECT IFNULL(SUM(montant), 0) as total FROM depenses_campagne WHERE campagne_id = ?", [id]);

        const recettes = ventes[0].total;
        const charges = aliments[0].total + depenses[0].total;
        const benefice = recettes - charges;

        res.json({
            recettes,
            charges,
            benefice,
            rentabilite: charges > 0 ? ((benefice / charges) * 100).toFixed(2) : 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
