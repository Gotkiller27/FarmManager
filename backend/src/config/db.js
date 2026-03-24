import dotenv from "dotenv"
dotenv.config()

import mysql from "mysql2/promise";


const HOST = process.env.HOST ?? "mysql-e940780-fructueuxabiala-012d.l.aivencloud.com"
const PORT_DB = process.env.PORT_DB 
const USER_DB = process.env.USER_DB ?? "avnadmin"
const PASSWORD = process.env.PASSWORD
const DB_NAME = process.env.DB_NAME

const db = mysql.createPool({
  host: HOST, // host Aiven
  port: PORT_DB,                        // port Aiven
  user: USER_DB,
  password: PASSWORD,
  database: DB_NAME,

  // ✅ SSL sans certificat
  ssl: {
    rejectUnauthorized: false
  },

  waitForConnections: true,
  connectionLimit: 10
});

export default db;