const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, checkRole } = require('../middleware/auth');

// --- Routes Publiques ---
router.get('/', categoryController.getAllCategories);

// --- Routes Protégées (Admin uniquement) ---
router.use(verifyToken);
router.use(checkRole('administrateur'));
router.post('/', categoryController.addCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
