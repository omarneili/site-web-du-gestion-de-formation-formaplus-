const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Obtenir tous les utilisateurs
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, nom, prenom, email, role, statut, created_at FROM utilisateur ORDER BY created_at DESC'
        );
        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Erreur getAllUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des utilisateurs'
        });
    }
};

// Ajouter un utilisateur
const addUser = async (req, res) => {
    try {
        const { nom, prenom, email, password, role } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const [existing] = await db.query('SELECT id FROM utilisateur WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cet email est déjà utilisé'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO utilisateur (nom, prenom, email, motDePasse, role) VALUES (?, ?, ?, ?, ?)',
            [nom, prenom, email, hashedPassword, role]
        );

        res.status(201).json({
            success: true,
            message: 'Utilisateur ajouté avec succès',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Erreur addUser:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'ajout de l\'utilisateur'
        });
    }
};

// Modifier un utilisateur
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, prenom, email, role, password } = req.body;

        let query = 'UPDATE utilisateur SET nom = ?, prenom = ?, email = ?, role = ?';
        let params = [nom, prenom, email, role];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', motDePasse = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE id = ?';
        params.push(id);

        await db.query(query, params);

        res.json({
            success: true,
            message: 'Utilisateur mis à jour avec succès'
        });
    } catch (error) {
        console.error('Erreur updateUser:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour de l\'utilisateur'
        });
    }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Ne pas se supprimer soi-même
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Vous ne pouvez pas supprimer votre propre compte admin'
            });
        }

        await db.query('DELETE FROM utilisateur WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Utilisateur supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur deleteUser:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'utilisateur'
        });
    }
};

// Bloquer/Débloquer un utilisateur
const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;

        if (parseInt(id) === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Vous ne pouvez pas modifier votre propre statut'
            });
        }

        await db.query('UPDATE utilisateur SET statut = ? WHERE id = ?', [statut, id]);

        res.json({
            success: true,
            message: `Utilisateur ${statut === 'bloque' ? 'bloqué' : 'débloqué'} avec succès`
        });
    } catch (error) {
        console.error('Erreur toggleUserStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du changement de statut'
        });
    }
};

module.exports = {
    getAllUsers,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus
};
