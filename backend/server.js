const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Test de la connexion à la base de données
require('./config/database');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/courses', require('./routes/course'));
app.use('/api/categories', require('./routes/category'));
app.use('/api/messages', require('./routes/message'));

// Route de test
app.get('/', (req, res) => {
    res.json({
        message: 'API Gestion de Formation - Serveur actif ✅',
        version: '1.0.0'
    });
});

// Gestion des routes non trouvées
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée'
    });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error('Erreur:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Erreur serveur interne'
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
    console.log(`\n⚡ Prêt à recevoir des requêtes!\n`);
});

module.exports = app;
