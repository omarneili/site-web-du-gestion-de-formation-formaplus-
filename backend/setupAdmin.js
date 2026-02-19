const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' }); // Adjust path to reach root .env if running from scripts dir

const createAdmin = async () => {
    let connection;
    try {
        console.log('🔌 Connexion à la base de données...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        console.log('🧹 Suppression des administrateurs existants...');
        await connection.execute('DELETE FROM utilisateur WHERE role = ?', ['administrateur']);

        console.log('🔒 Hashage du mot de passe...');
        const hashedPassword = await bcrypt.hash('999999', 10);

        console.log('👤 Création du nouvel administrateur...');
        const [result] = await connection.execute(
            'INSERT INTO utilisateur (nom, prenom, email, motDePasse, role) VALUES (?, ?, ?, ?, ?)',
            ['Admin', 'Principal', 'omarneili308@gmail.com', hashedPassword, 'administrateur']
        );

        console.log(`✅ Administrateur créé avec succès! ID: ${result.insertId}`);
        console.log('EMAIL: omarneili308@gmail.com');
        console.log('MP: 999999');

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Déconnexion.');
        }
        process.exit();
    }
};

createAdmin();
