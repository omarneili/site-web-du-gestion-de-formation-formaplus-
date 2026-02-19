import api from './api';

const messageService = {
    // Envoyer un message
    sendMessage: async (messageData) => {
        try {
            const response = await api.post('/messages', messageData);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de l\'envoi du message'
            };
        }
    },

    // Récupérer une conversation
    getConversation: async (otherUserId, formationId = null) => {
        try {
            const url = formationId
                ? `/messages/${otherUserId}?formationId=${formationId}`
                : `/messages/${otherUserId}`;
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération de la conversation'
            };
        }
    },

    // Récupérer les conversations récentes
    getRecentConversations: async () => {
        try {
            const response = await api.get('/messages/conversations');
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération des conversations'
            };
        }
    },

    // Récupérer le nombre de messages non lus
    getUnreadCount: async () => {
        try {
            const response = await api.get('/messages/unread-count');
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors de la récupération du nombre de messages non lus'
            };
        }
    },

    // Marquer les messages comme lus
    markAsRead: async (fromUserId) => {
        try {
            const response = await api.put(`/messages/read/${fromUserId}`);
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erreur lors du marquage des messages'
            };
        }
    }
};

export default messageService;
