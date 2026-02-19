import api from './api';

const userService = {
    // Obtenir tous les utilisateurs
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    // Ajouter un utilisateur
    addUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    // Modifier un utilisateur
    updateUser: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    // Bloquer/Débloquer un utilisateur
    toggleUserStatus: async (id, statut) => {
        const response = await api.patch(`/users/${id}/status`, { statut });
        return response.data;
    },

    // Supprimer un utilisateur
    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};

export default userService;
