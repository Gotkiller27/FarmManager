import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";

// Validation des variables d'environnement
const requiredEnvVars = ["PORT_DB", "PASSWORD", "DB_NAME"];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Erreur : La variable d'environnement ${key} est manquante.`);
    process.exit(1); // Arrête l'application si une variable est manquante
  }
});

// Variables d'environnement
const HOST = process.env.HOST ?? "mysql-e940780-fructueuxabiala-012d.l.aivencloud.com";
const PORT_DB = process.env.PORT_DB;
const USER_DB = process.env.USER_DB ?? "avnadmin";
const PASSWORD = process.env.PASSWORD;
const DB_NAME = process.env.DB_NAME;

// Création du pool de connexions
let db;
try {
  db = mysql.createPool({
    host: HOST,
    port: PORT_DB,
    user: USER_DB,
    password: PASSWORD,
    database: DB_NAME,

    // SSL sécurisé (si possible, utilise un certificat valide)
    ssl: {
      rejectUnauthorized: false,
    },

    waitForConnections: true,
    connectionLimit: 10,
  });

  console.log("✅ Connexion à la base de données réussie !");
} catch (error) {
  console.error("❌ Erreur lors de la connexion à la base de données :", error.message);
  process.exit(1); // Arrête l'application en cas d'erreur critique
}

export default db;