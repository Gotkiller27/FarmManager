import { register, loginUser } from "../services/auth.service.js";
import { getAllUsers } from "../services/users.service.js";
import db from "../config/database.js"; // À adapter selon ta config DB

const create = async (req, res, next) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password || !role) {
      const error = new Error("Tous les champs n'ont pas été renseignés")
      error.statusCode = 400
      throw error
    }

    const user = await register(req.body)
    if (!user) {
      const error = new Error("Erreur lors de la création du nouvel utilisateur")
      error.statusCode = 500
      throw error
    }

    return res.status(201).json({
      message: "Compte créér avec succès ✅✅",
      user
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body

    if (!email || !password) {
      const err = new Error("email and password required")
      err.statusCode = 400
      throw err
    }

    const loginData = await loginUser({ email, password })
    req.user = loginData.user

    res.status(200).json({ message: "connexion réussie", loginData })
  } catch (error) {
    next(error)
  }
}

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { age, tel, city, bio } = req.body;

    const result = await db.query(
      `UPDATE admins SET age = ?, tel = ?, city = ?, bio = ?, updated_at = NOW() WHERE user_id = ?`,
      [age || null, tel || null, city || null, bio || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const [user] = await db.query(
      `SELECT * FROM admins WHERE user_id = ?`,
      [id]
    );

    res.json({
      message: "Profil mis à jour",
      user: user[0] || user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { create, login, updateProfile };
