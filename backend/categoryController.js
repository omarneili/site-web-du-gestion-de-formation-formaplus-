const pool = require('../config/database');

const categoryController = {
    // Obtenir toutes les catégories
    getAllCategories: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM categorie ORDER BY nom ASC');
            res.json({
                success: true,
                categories: rows
            });
        } catch (error) {
            console.error('Erreur getAllCategories:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des catégories'
            });
        }
    },

    // Ajouter une catégorie
    addCategory: async (req, res) => {
        try {
            const { nom } = req.body;
            if (!nom) {
                return res.status(400).json({ success: false, message: 'Le nom de la catégorie est requis' });
            }

            const [result] = await pool.query(
                'INSERT INTO categorie (nom) VALUES (?)',
                [nom]
            );

            res.status(201).json({
                success: true,
                message: 'Catégorie ajoutée avec succès',
                categoryId: result.insertId
            });
        } catch (error) {
            console.error('Erreur addCategory:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'ajout de la catégorie'
            });
        }
    },

    // Modifier une catégorie
    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const { nom } = req.body;

            if (!nom) {
                return res.status(400).json({ success: false, message: 'Le nom de la catégorie est requis' });
            }

            await pool.query(
                'UPDATE categorie SET nom = ? WHERE id = ?',
                [nom, id]
            );

            res.json({
                success: true,
                message: 'Catégorie mise à jour avec succès'
            });
        } catch (error) {
            console.error('Erreur updateCategory:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour de la catégorie'
            });
        }
    },

    // Supprimer une catégorie
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;

            // Note: Si la foreign key est en ON DELETE CASCADE, 
            // supprimer la catégorie supprimera automatiquement les formations.
            await pool.query('DELETE FROM categorie WHERE id = ?', [id]);

            res.json({
                success: true,
                message: 'Catégorie et formations associées supprimées avec succès'
            });
        } catch (error) {
            console.error('Erreur deleteCategory:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression de la catégorie'
            });
        }
    }
};

module.exports = categoryController;
