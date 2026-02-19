const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus
} = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Toutes les routes ici nécessitent d'être admin
router.use(verifyToken);
router.use(checkRole('administrateur'));

router.get('/', getAllUsers);
router.post('/', addUser);
router.put('/:id', updateUser);
router.patch('/:id/status', toggleUserStatus);
router.delete('/:id', deleteUser);

module.exports = router;
