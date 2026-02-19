import api from './api';

const courseService = {
    // Obtenir toutes les formations
    getAllCourses: async () => {
        const response = await api.get('/courses');
        return response.data;
    },

    // Obtenir une formation par ID
    getCourseById: async (id) => {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    },

    // Inscription à une formation
    enrollInCourse: async (courseId, paymentData) => {
        const response = await api.post(`/courses/${courseId}/enroll`, paymentData);
        return response.data;
    },

    // --- Méthodes d'Administration ---

    // Ajouter une formation
    addCourse: async (courseData) => {
        const response = await api.post('/courses', courseData);
        return response.data;
    },

    // Modifier une formation
    updateCourse: async (id, courseData) => {
        const response = await api.put(`/courses/${id}`, courseData);
        return response.data;
    },

    // Supprimer une formation
    deleteCourse: async (id) => {
        const response = await api.delete(`/courses/${id}`);
        return response.data;
    },

    // Obtenir toutes les catégories
    getAllCategories: async () => {
        const response = await api.get('/courses/categories');
        return response.data;
    },

    // Obtenir les formations de l'instructeur connecté
    getInstructorCourses: async () => {
        const response = await api.get('/courses/instructor');
        return response.data;
    },

    // Obtenir les apprenants de l'instructeur connecté
    getInstructorStudents: async () => {
        const response = await api.get('/courses/instructor/students');
        return response.data;
    },

    // Obtenir les formations suivies par l'apprenant connecté
    getEnrolledCourses: async () => {
        const response = await api.get('/courses/enrolled');
        return response.data;
    },

    // Obtenir toutes les inscriptions (Admin)
    getAllEnrollments: async () => {
        const response = await api.get('/courses/enrollments/all');
        return response.data;
    },

    // --- Gestion du contenu ---
    getCourseContent: async (courseId) => {
        const response = await api.get(`/courses/${courseId}/content`);
        return response.data;
    },

    addContent: async (contentData) => {
        const config = contentData instanceof FormData
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : {};
        const response = await api.post('/courses/content', contentData, config);
        return response.data;
    },

    updateContent: async (contentId, contentData) => {
        const config = contentData instanceof FormData
            ? { headers: { 'Content-Type': 'multipart/form-data' } }
            : {};
        const response = await api.put(`/courses/content/${contentId}`, contentData, config);
        return response.data;
    },

    deleteContent: async (contentId) => {
        const response = await api.delete(`/courses/content/${contentId}`);
        return response.data;
    },

    // Marquer une formation comme consultée
    markAsViewed: async (courseId) => {
        const response = await api.put(`/courses/${courseId}/viewed`);
        return response.data;
    },

    // Mettre à jour la progression d'une leçon
    updateLessonProgress: async (contentId, completed) => {
        const response = await api.post(`/courses/content/${contentId}/progress`, { completed });
        return response.data;
    }
};

export default courseService;
