import db from '../config/db.js';

// 1. Assigner ou Modifier le gérant d'un département (Logique Upsert)
export const assignGerantToDept = async (req, res) => {
  const { gerant_id, departement_id } = req.body;

  try {
    // Vérifier si une assignation existe déjà pour ce département
    const [existing] = await db.execute(
      `SELECT * FROM gerant_departements WHERE departement_id = ?`, 
      [departement_id]
    );

    if (existing.length > 0) {
      // UPDATE
      await db.execute(
        `UPDATE gerant_departements SET gerant_id = ? WHERE departement_id = ?`, 
        [gerant_id, departement_id]
      );
      res.status(200).json({ message: "Gérant mis à jour.", action: "updated" });
    } else {
      // INSERT
      await db.execute(
        `INSERT INTO gerant_departements (gerant_id, departement_id) VALUES (?, ?)`, 
        [gerant_id, departement_id]
      );
      res.status(201).json({ message: "Gérant assigné.", action: "inserted" });
    }
  } catch (error) {
    console.error("Erreur assignation:", error);
    res.status(500).json({ message: "Erreur lors de l'assignation", error: error.message });
  }
};

// 2. Récupérer le gérant actuel d'un département
export const getCurrentGerantByDept = async (req, res) => {
  const { deptId } = req.params;

  try {
    // Utilisation de CONCAT pour créer la colonne 'nom' attendue par le frontend
    const query = `
      SELECT g.*, CONCAT(u.first_name, ' ', u.last_name) AS nom 
      FROM gerant_departements gd
      JOIN gerants g ON gd.gerant_id = g.user_id
      JOIN users u ON g.user_id = u.id
      WHERE gd.departement_id = ?
    `;
    const [rows] = await db.execute(query, [deptId]);

    if (rows.length === 0) {
      return res.status(200).json(null);
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du gérant", error: error.message });
  }
};

// 3. Lister tous les gérants
export const getAllGerants = async (req, res) => {
  try {
    // Utilisation de CONCAT ici aussi
    const query = `
      SELECT g.*, CONCAT(u.first_name, ' ', u.last_name) AS nom 
      FROM gerants g 
      JOIN users u ON g.user_id = u.id
    `;
    const [rows] = await db.execute(query);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};