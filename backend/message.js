const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { verifyToken } = require('../middleware/auth');

// Toutes les routes de messagerie nécessitent une authentification
router.post('/', verifyToken, messageController.sendMessage);
router.get('/conversations', verifyToken, messageController.getRecentConversations);
router.get('/unread-count', verifyToken, messageController.getUnreadCount);
router.get('/:otherUserId', verifyToken, messageController.getConversation);
router.put('/read/:fromUserId', verifyToken, messageController.markAsRead);

module.exports = router;
