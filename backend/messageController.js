const pool = require('../config/database');

const messageController = {
    // Envoyer un message
    sendMessage: async (req, res) => {
        try {
            const { destinataire_id, formation_id, contenu } = req.body;
            const expediteur_id = req.user.id;

            if (!destinataire_id || !contenu) {
                return res.status(400).json({
                    success: false,
                    message: 'Destinataire et contenu sont requis'
                });
            }

            const [result] = await pool.query(
                'INSERT INTO message (expediteur_id, destinataire_id, formation_id, contenu) VALUES (?, ?, ?, ?)',
                [expediteur_id, destinataire_id, formation_id || null, contenu]
            );

            res.status(201).json({
                success: true,
                message: 'Message envoyé avec succès',
                messageId: result.insertId
            });
        } catch (error) {
            console.error('Erreur sendMessage:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'envoi du message'
            });
        }
    },

    // Obtenir la conversation entre l'utilisateur connecté et un autre utilisateur
    getConversation: async (req, res) => {
        try {
            const userId = req.user.id;
            const otherUserId = req.params.otherUserId;
            const formatonId = req.query.formationId;

            let query = `
                SELECT 
                    m.*,
                    u_exp.nom as expediteur_nom, u_exp.prenom as expediteur_prenom,
                    u_dest.nom as destinataire_nom, u_dest.prenom as destinataire_prenom
                FROM message m
                INNER JOIN utilisateur u_exp ON m.expediteur_id = u_exp.id
                INNER JOIN utilisateur u_dest ON m.destinataire_id = u_dest.id
                WHERE (
                    (m.expediteur_id = ? AND m.destinataire_id = ?) 
                    OR (m.expediteur_id = ? AND m.destinataire_id = ?)
                )
            `;
            let params = [userId, otherUserId, otherUserId, userId];

            if (formatonId) {
                query += ' AND m.formation_id = ?';
                params.push(formatonId);
            }

            query += ' ORDER BY m.date_envoi ASC';

            const [rows] = await pool.query(query, params);

            res.json({
                success: true,
                messages: rows
            });
        } catch (error) {
            console.error('Erreur getConversation:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération de la conversation'
            });
        }
    },

    // Obtenir toutes les conversations récentes de l'utilisateur
    getRecentConversations: async (req, res) => {
        try {
            const userId = req.user.id;

            // Cette requête est plus complexe car on veut le dernier message avec chaque personne
            // Et on compte les messages non lus de ce contact
            const [rows] = await pool.query(`
                SELECT 
                    m.*,
                    IF(m.expediteur_id = ?, u_dest.nom, u_exp.nom) as contact_nom,
                    IF(m.expediteur_id = ?, u_dest.prenom, u_exp.prenom) as contact_prenom,
                    IF(m.expediteur_id = ?, u_dest.id, u_exp.id) as contact_id,
                    f.titre as formation_titre,
                    (SELECT COUNT(*) FROM message WHERE destinataire_id = ? AND expediteur_id = contact_id AND lu = FALSE) as unread_count
                FROM message m
                INNER JOIN (
                    SELECT 
                        MAX(id) as max_id
                    FROM message
                    WHERE expediteur_id = ? OR destinataire_id = ?
                    GROUP BY IF(expediteur_id = ?, destinataire_id, expediteur_id)
                ) last_msg ON m.id = last_msg.max_id
                INNER JOIN utilisateur u_exp ON m.expediteur_id = u_exp.id
                INNER JOIN utilisateur u_dest ON m.destinataire_id = u_dest.id
                LEFT JOIN formation f ON m.formation_id = f.id
                ORDER BY m.date_envoi DESC
            `, [userId, userId, userId, userId, userId, userId, userId]);

            res.json({
                success: true,
                conversations: rows
            });
        } catch (error) {
            console.error('Erreur getRecentConversations:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des conversations'
            });
        }
    },

    // Obtenir le nombre total de messages non lus
    getUnreadCount: async (req, res) => {
        try {
            const userId = req.user.id;
            const [rows] = await pool.query(
                'SELECT COUNT(*) as count FROM message WHERE destinataire_id = ? AND lu = FALSE',
                [userId]
            );

            res.json({
                success: true,
                unreadCount: rows[0].count
            });
        } catch (error) {
            console.error('Erreur getUnreadCount:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération du nombre de messages non lus'
            });
        }
    },

    // Marquer les messages comme lus
    markAsRead: async (req, res) => {
        try {
            const userId = req.user.id;
            const fromUserId = req.params.fromUserId;

            await pool.query(
                'UPDATE message SET lu = TRUE WHERE destinataire_id = ? AND expediteur_id = ? AND lu = FALSE',
                [userId, fromUserId]
            );

            res.json({
                success: true,
                message: 'Messages marqués comme lus'
            });
        } catch (error) {
            console.error('Erreur markAsRead:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors du marquage des messages'
            });
        }
    }
};

module.exports = messageController;
