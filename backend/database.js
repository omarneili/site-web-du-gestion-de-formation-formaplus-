const mysql = require('mysql2');
require('dotenv').config();

// Création du pool de connexions MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Utilisation des promesses pour une syntaxe async/await
const promisePool = pool.promise();

// Test de connexion
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erreur de connexion à MySQL:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error('⚠️  Assurez-vous que XAMPP MySQL est démarré!');
    }
    return;
  }
  console.log('✅ Connexion à MySQL réussie!');
  connection.release();
});

module.exports = promisePool;
