const pool = require('../config/database');

const seedCourses = async () => {
    try {
        // 1. Vérifier s'il y a déjà des formations
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM formation');

        if (rows[0].count > 0) {
            console.log('ℹ️ La table formation contient déjà des données.');
            return;
        }

        console.log('🌱 Début du remplissage des formations de test...');

        // 2. Récupérer quelques catégories existantes
        const [categories] = await pool.query('SELECT id FROM categorie LIMIT 3');
        if (categories.length === 0) {
            console.error('❌ Aucune catégorie trouvée. Veuillez d\'abord exécuter le script SQL.');
            return;
        }

        // 3. Insérer des formations de test
        const formations = [
            [
                'Développement Web Fullstack avec React & Node.js',
                'Apprenez à créer des applications web modernes de A à Z. Ce programme complet couvre les bases du HTML/CSS jusqu\'aux frameworks avancés.',
                120,
                1500.00,
                'intermédiaire',
                categories[0].id
            ],
            [
                'Introduction à la Data Science avec Python',
                'Maîtrisez l\'analyse de données, la visualisation et les algorithmes de Machine Learning avec le langage de programmation Python.',
                80,
                1200.00,
                'débutant',
                categories[1] ? categories[1].id : categories[0].id
            ],
            [
                'UX/UI Design Pro : Créez des interfaces mémorables',
                'Découvrez les principes fondamentaux du design centré utilisateur et apprenez à utiliser Figma pour vos projets de design.',
                60,
                800.00,
                'débutant',
                categories[2] ? categories[2].id : categories[0].id
            ],
            [
                'Gestion de Projet Agile & Scrum',
                'Améliorez la productivité de votre équipe en apprenant les méthodologies Agiles et en devenant un expert du framework Scrum.',
                40,
                950.00,
                'avancé',
                categories[0].id
            ]
        ];

        const query = 'INSERT INTO formation (titre, description, duree, prix, niveau, categorie_id) VALUES ?';
        await pool.query(query, [formations]);

        console.log('✅ Formations de test ajoutées avec succès !');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors du remplissage:', error);
        process.exit(1);
    }
};

seedCourses();
