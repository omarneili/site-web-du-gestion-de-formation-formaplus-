import api from './api';

const authService = {
    // Inscription
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // Connexion
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Déconnexion
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Obtenir l'utilisateur actuel
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Vérifier si l'utilisateur est connecté
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Obtenir le profil
    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    }
};

export default authService;
