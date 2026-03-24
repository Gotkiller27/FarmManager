import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (userData) => {
  try {
    // 1. Récupère TOUS les champs envoyés par le front
    const { email, password, role, first_name, last_name } = userData;

    // 2. Vérification complète
    if (!email || !password || !role || !first_name || !last_name) {
      const err = new Error("Champs manquants (Nom, Prénom, Email, Password ou Rôle)");
      err.statusCode = 400;
      throw err;
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    // 3. Mise à jour de la requête SQL pour inclure nom et prénom
    const [result] = await db.query(
      "INSERT INTO users (email, password, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)",
      [email, passwordHashed, role, first_name, last_name],
    );

    if (result.affectedRows > 0) {
      return { id: result.insertId, email, role, first_name, last_name };
    }
    return null;
  } catch (error) {
    // 4. On "re-throw" l'erreur pour qu'elle soit attrapée par le contrôleur
    throw error; 
  }
};

const loginUser = async (data) => {
  const { email, password } = data;

  // if (!email || !password) {
  //   const err = new Error(
  //     "Toutes les données ne sont pas reçues dans auth.service/login",
  //   );
  //   err.statusCode = 400
  //   throw err
  // }
  const [row] = await db.query("SELECT * FROM users WHERE email= ?", [email]);
  const user = row[0];
  if (!user) {
    const err = new Error("User not Found");
    err.statusCode = 404
    throw err
  }

  const checkPwd = await bcrypt.compare(password, user.password);

  if (!checkPwd) {
    const err =  new Error("Password incorrect, veuillez rééssayer !!");
    err.statusCode = 401
    throw err
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role, last_name: user.last_name,  first_name: user.first_name },
    JWT_SECRET,
    { expiresIn: "4h" },
  );
  return {
    user: {
      id: user.id,
      last_name: user.last_name, 
      first_name: user.first_name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export { register, loginUser };
