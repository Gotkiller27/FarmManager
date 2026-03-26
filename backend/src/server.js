import app from "./app.js"
import db from "./config/db.js";

async function test() {
  try {
    const [rows] = await db.query("SELECT NOW() AS TIME");
    console.log("✅ Connexion réussie !");
    console.log(rows);

  } catch (err) {
    console.error("❌ Erreur :", err);
  }
}

test();




const PORT = process.env.PORT ?? 8000
// await connectDb()

app.listen(PORT, ()=> {
    console.log(`Serveur démarré sur http://localhost:${PORT}`)
})