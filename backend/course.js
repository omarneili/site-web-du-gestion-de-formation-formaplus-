const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// --- Routes ---

// Obtenir toutes les catégories
router.get('/categories', courseController.getAllCategories);

// Route pour voir toutes les formations
router.get('/', courseController.getAllCourses);

// Route pour les formations d'un formateur (doit être avant /:id)
router.get('/instructor', verifyToken, checkRole('formateur', 'administrateur'), courseController.getInstructorCourses);

// Route pour les apprenants d'un formateur (doit être avant /:id)
router.get('/instructor/students', verifyToken, checkRole('formateur', 'administrateur'), courseController.getInstructorStudents);

// Route pour les formations suivies par l'apprenant (doit être avant /:id)
router.get('/enrolled', verifyToken, checkRole('apprenant'), courseController.getStudentCourses);

// Route pour voir les détails d'une formation
router.get('/:id', courseController.getCourseById);

// --- Routes Protégées Authentifiées ---
router.use(verifyToken);

// Inscription à une formation
router.post('/:id/enroll', checkRole('apprenant'), courseController.enrollInCourse);

// Marquer comme consulté (Apprenant)
router.put('/:id/viewed', checkRole('apprenant'), courseController.markCourseAsViewed);

// Mettre à jour la progression d'une leçon (Apprenant)
router.post('/content/:id/progress', checkRole('apprenant'), courseController.updateLessonProgress);

// --- Routes de Gestion du Contenu (Accessibles aux Formateurs) ---

// Obtenir le contenu d'une formation (Accessible à tous les connectés)
router.get('/:id/content', courseController.getCourseContent);

// Ajouter du contenu (Formateur et Admin)
router.post('/content', checkRole('formateur', 'administrateur'), upload.single('fichier'), courseController.addCourseContent);

// Modifier du contenu (Formateur et Admin)
router.put('/content/:id', checkRole('formateur', 'administrateur'), upload.single('fichier'), courseController.updateCourseContent);

// Supprimer du contenu (Formateur et Admin)
router.delete('/content/:id', checkRole('formateur', 'administrateur'), courseController.deleteCourseContent);

// --- Routes Admin uniquement ---
router.use(checkRole('administrateur'));

// Ajouter une formation
router.post('/', courseController.addCourse);

// Modifier une formation
router.put('/:id', courseController.updateCourse);

// Supprimer une formation
router.delete('/:id', courseController.deleteCourse);

// Obtenir toutes les inscriptions
router.get('/enrollments/all', courseController.getAllEnrollments);

module.exports = router;
