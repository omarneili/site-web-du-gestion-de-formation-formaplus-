const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'Token non fourni. Accès refusé.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Ajoute les infos utilisateur à la requête
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token invalide ou expiré.'
        });
    }
};

// Middleware pour vérifier le rôle
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Non authentifié.'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Accès refusé. Rôle requis: ${allowedRoles.join(' ou ')}`
            });
        }

        next();
    };
};

module.exports = { verifyToken, checkRole };
