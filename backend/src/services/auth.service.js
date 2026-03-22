import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (userData) => {
  try {
    const { email, password, role } = userData;

    if (!email || !password || !role) {
      const err = new Error(
        "Toutes les données ne sont pas reçues dans auth.service/register",
      );
      err.statusCode = 400
      throw err
    }

    // Utilisation correcte de bcrypt.hash
    const passwordHashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, passwordHashed, role],
    );

    if (result.affectedRows > 0) {
      return { id: result.insertId, email, role };
    }
    return null;
  } catch (error) {
    next(error)
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
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "4h" },
  );
  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export { register, loginUser };
