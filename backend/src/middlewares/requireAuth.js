import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET

export const requireAuth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    // 1️⃣ vérifier header
    if (!header || !header.startsWith("Bearer ")) {
      const err = new Error("Accès non autorisé");
      err.statusCode = 401;
      return next(err);
    }

    // 2️⃣ récupérer token
    const token = header.split(" ")[1];

    // 3️⃣ vérifier token (IMPORTANT)
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4️⃣ attacher utilisateur
    req.user = decoded;

    next();

  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};