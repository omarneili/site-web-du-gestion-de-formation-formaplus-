const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

// Validation pour l'inscription
const registerValidation = [
    body('nom').trim().notEmpty().withMessage('Le nom est requis'),
    body('prenom').trim().notEmpty().withMessage('Le prénom est requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('role').isIn(['administrateur', 'formateur', 'apprenant']).withMessage('Rôle invalide')
];

// Validation pour la connexion
const loginValidation = [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Le mot de passe est requis')
];

// Inscription
const register = async (req, res) => {
    try {
        // Vérification des erreurs de validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { nom, prenom, email, password, role } = req.body;

        // Vérifier si l'email existe déjà
        const [existingUsers] = await db.query(
            'SELECT id FROM utilisateur WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cet email est déjà utilisé.'
            });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Déterminer le rôle
        const userRole = role || 'apprenant';

        // Insérer dans la table utilisateur
        const [result] = await db.query(
            'INSERT INTO utilisateur (nom, prenom, email, motDePasse, role) VALUES (?, ?, ?, ?, ?)',
            [nom, prenom, email, hashedPassword, userRole]
        );

        const userId = result.insertId;

        res.status(201).json({
            success: true,
            message: 'Inscription réussie!',
            userId: userId
        });

    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de l\'inscription.'
        });
    }
};

// Connexion
const login = async (req, res) => {
    try {
        // Vérification des erreurs de validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Rechercher l'utilisateur
        const [users] = await db.query(
            'SELECT * FROM utilisateur WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect.'
            });
        }

        const user = users[0];

        // Vérifier si l'utilisateur est bloqué
        if (user.statut === 'bloque') {
            return res.status(403).json({
                success: false,
                message: 'Votre compte a été bloqué. Veuillez contacter l\'administrateur.'
            });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.motDePasse);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect.'
            });
        }

        // Générer le token JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                nom: user.nom,
                prenom: user.prenom
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            success: true,
            message: 'Connexion réussie!',
            token,
            user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la connexion.'
        });
    }
};

// Obtenir le profil de l'utilisateur connecté
const getProfile = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, nom, prenom, email, role, created_at FROM utilisateur WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé.'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur.'
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    registerValidation,
    loginValidation
};
