const pool = require('../config/database');

const courseController = {
    // Obtenir toutes les formations avec détails
    getAllCourses: async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    f.*, 
                    c.nom as categorie_nom,
                    u.nom as formateur_nom,
                    u.prenom as formateur_prenom
                FROM formation f
                LEFT JOIN categorie c ON f.categorie_id = c.id
                LEFT JOIN utilisateur u ON f.formateur_id = u.id
                ORDER BY f.created_at DESC
            `);

            res.json({
                success: true,
                count: rows.length,
                courses: rows
            });
        } catch (error) {
            console.error('Erreur getAllCourses:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des formations',
                error: error.message
            });
        }
    },

    // Obtenir une formation par ID
    getCourseById: async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    f.*, 
                    c.nom as categorie_nom,
                    u.nom as formateur_nom,
                    u.prenom as formateur_prenom
                FROM formation f
                LEFT JOIN categorie c ON f.categorie_id = c.id
                LEFT JOIN utilisateur u ON f.formateur_id = u.id
                WHERE f.id = ?
            `, [req.params.id]);

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Formation non trouvée'
                });
            }

            res.json({
                success: true,
                course: rows[0]
            });
        } catch (error) {
            console.error('Erreur getCourseById:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des détails de la formation'
            });
        }
    },

    // Ajouter une formation
    addCourse: async (req, res) => {
        try {
            const { titre, description, duree, prix, niveau, categorie_id, formateur_id } = req.body;

            const [result] = await pool.query(
                'INSERT INTO formation (titre, description, duree, prix, niveau, categorie_id, formateur_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [titre, description, duree, prix, niveau, categorie_id, formateur_id]
            );

            res.status(201).json({
                success: true,
                message: 'Formation ajoutée avec succès',
                courseId: result.insertId
            });
        } catch (error) {
            console.error('Erreur addCourse:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'ajout de la formation'
            });
        }
    },

    // Modifier une formation
    updateCourse: async (req, res) => {
        try {
            const { id } = req.params;
            const { titre, description, duree, prix, niveau, categorie_id, formateur_id } = req.body;

            await pool.query(
                'UPDATE formation SET titre = ?, description = ?, duree = ?, prix = ?, niveau = ?, categorie_id = ?, formateur_id = ? WHERE id = ?',
                [titre, description, duree, prix, niveau, categorie_id, formateur_id, id]
            );

            res.json({
                success: true,
                message: 'Formation mise à jour avec succès'
            });
        } catch (error) {
            console.error('Erreur updateCourse:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour de la formation'
            });
        }
    },

    // Supprimer une formation
    deleteCourse: async (req, res) => {
        try {
            const { id } = req.params;
            await pool.query('DELETE FROM formation WHERE id = ?', [id]);

            res.json({
                success: true,
                message: 'Formation supprimée avec succès'
            });
        } catch (error) {
            console.error('Erreur deleteCourse:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression de la formation'
            });
        }
    },

    // Obtenir toutes les catégories
    getAllCategories: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM categorie ORDER BY nom ASC');
            res.json({
                success: true,
                categories: rows
            });
        } catch (error) {
            console.error('Erreur getAllCategories:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des catégories'
            });
        }
    },

    // Obtenir les formations d'un formateur spécifique (via son token)
    getInstructorCourses: async (req, res) => {
        try {
            const instructorId = req.user.id;
            const [rows] = await pool.query(`
                SELECT 
                    f.*, 
                    c.nom as categorie_nom
                FROM formation f
                LEFT JOIN categorie c ON f.categorie_id = c.id
                WHERE f.formateur_id = ?
                ORDER BY f.created_at DESC
            `, [instructorId]);

            res.json({
                success: true,
                count: rows.length,
                courses: rows
            });
        } catch (error) {
            console.error('Erreur getInstructorCourses:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération de vos formations',
                error: error.message
            });
        }
    },

    // Obtenir les apprenants inscrits aux formations d'un formateur spécifique
    getInstructorStudents: async (req, res) => {
        try {
            const instructorId = req.user.id;
            console.log('DEBUG: Fetching students for instructor ID:', instructorId);

            const [rows] = await pool.query(`
                SELECT 
                    i.id as inscription_id,
                    i.dateInscription,
                    i.statut,
                    u.nom as apprenant_nom,
                    u.prenom as apprenant_prenom,
                    u.email as apprenant_email,
                    f.titre as formation_titre,
                    f.id as formation_id
                FROM inscription i
                INNER JOIN formation f ON i.formation_id = f.id
                INNER JOIN utilisateur u ON i.apprenant_id = u.id
                WHERE f.formateur_id = ?
                ORDER BY i.dateInscription DESC
            `, [instructorId]);

            console.log(`DEBUG: Found ${rows.length} students for instructor ${instructorId}`);

            res.json({
                success: true,
                count: rows.length,
                students: rows
            });
        } catch (error) {
            console.error('Erreur getInstructorStudents:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération de la liste des apprenants',
                error: error.message
            });
        }
    },

    // Inscription à une formation
    enrollInCourse: async (req, res) => {
        try {
            const { id } = req.params; // ID de la formation
            const { card_number, card_expiry, card_cvv } = req.body;
            const studentId = req.user.id;
            const dateInscription = new Date().toISOString().split('T')[0];

            // Vérifier si déjà inscrit
            const [existing] = await pool.query(
                'SELECT id FROM inscription WHERE apprenant_id = ? AND formation_id = ?',
                [studentId, id]
            );

            if (existing.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Vous êtes déjà inscrit à cette formation'
                });
            }

            await pool.query(
                'INSERT INTO inscription (apprenant_id, formation_id, dateInscription, statut, card_number, card_expiry, card_cvv) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [studentId, id, dateInscription, 'valide', card_number, card_expiry, card_cvv]
            );

            res.status(201).json({
                success: true,
                message: 'Inscription et paiement réussis !'
            });
        } catch (error) {
            console.error('Erreur enrollInCourse:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'inscription',
                error: error.message
            });
        }
    },

    // Obtenir les formations d'un apprenant
    getStudentCourses: async (req, res) => {
        try {
            const studentId = req.user.id;
            const [rows] = await pool.query(`
                SELECT 
                    f.*, 
                    c.nom as categorie_nom,
                    u.nom as formateur_nom,
                    u.prenom as formateur_prenom,
                    i.dateInscription,
                    i.statut as inscription_statut
                FROM formation f
                INNER JOIN inscription i ON f.id = i.formation_id
                LEFT JOIN categorie c ON f.categorie_id = c.id
                LEFT JOIN utilisateur u ON f.formateur_id = u.id
                WHERE i.apprenant_id = ?
                ORDER BY i.created_at DESC
            `, [studentId]);

            // Pour chaque formation, vérifier s'il y a du nouveau contenu
            for (let course of rows) {
                const [newContent] = await pool.query(`
                    SELECT COUNT(*) as count 
                    FROM cours 
                    WHERE formation_id = ? AND created_at > (
                        SELECT last_viewed_at FROM inscription 
                        WHERE apprenant_id = ? AND formation_id = ?
                    )
                `, [course.id, studentId, course.id]);
                course.hasNewContent = newContent[0].count > 0;

                // Calculer la progression globale
                const [progressionStats] = await pool.query(`
                    SELECT 
                        (SELECT COUNT(*) FROM cours WHERE formation_id = ?) as total_lessons,
                        (SELECT COUNT(*) FROM progression_cours pc 
                         INNER JOIN cours c ON pc.cours_id = c.id 
                         WHERE c.formation_id = ? AND pc.apprenant_id = ? AND pc.pourcentage = 100) as completed_lessons
                `, [course.id, course.id, studentId]);

                const stats = progressionStats[0];
                course.global_progress = stats.total_lessons > 0
                    ? Math.round((stats.completed_lessons / stats.total_lessons) * 100)
                    : 0;
            }

            res.json({
                success: true,
                count: rows.length,
                courses: rows
            });
        } catch (error) {
            console.error('Erreur getStudentCourses:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération de vos formations',
                error: error.message
            });
        }
    },

    // Obtenir toutes les inscriptions (Admin uniquement)
    getAllEnrollments: async (req, res) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    i.*,
                    app.nom as apprenant_nom,
                    app.prenom as apprenant_prenom,
                    app.email as apprenant_email,
                    f.titre as formation_titre,
                    f.prix as formation_prix,
                    form.nom as formateur_nom,
                    form.prenom as formateur_prenom
                FROM inscription i
                INNER JOIN utilisateur app ON i.apprenant_id = app.id
                INNER JOIN formation f ON i.formation_id = f.id
                LEFT JOIN utilisateur form ON f.formateur_id = form.id
                ORDER BY i.dateInscription DESC
            `);

            res.json({
                success: true,
                count: rows.length,
                enrollments: rows
            });
        } catch (error) {
            console.error('Erreur getAllEnrollments:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des inscriptions',
                error: error.message
            });
        }
    },

    // --- Gestion du contenu des cours ---

    // Obtenir le contenu d'une formation
    getCourseContent: async (req, res) => {
        try {
            const { id } = req.params;
            const studentId = req.user ? req.user.id : null;

            let query = 'SELECT * FROM cours WHERE formation_id = ? ORDER BY ordre ASC';
            let params = [id];

            if (studentId) {
                query = `
                    SELECT c.*, IF(pc.pourcentage = 100, 1, 0) as completed
                    FROM cours c
                    LEFT JOIN progression_cours pc ON c.id = pc.cours_id AND pc.apprenant_id = ?
                    WHERE c.formation_id = ? 
                    ORDER BY c.ordre ASC
                `;
                params = [studentId, id];
            }

            const [rows] = await pool.query(query, params);
            res.json({
                success: true,
                content: rows
            });
        } catch (error) {
            console.error('Erreur getCourseContent:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération du contenu'
            });
        }
    },

    addCourseContent: async (req, res) => {
        try {
            const { formation_id, titre, type, contenu, fichier_url, ordre, avis_formateur } = req.body;

            // Si un fichier a été uploadé, utiliser son URL locale
            let final_fichier_url = fichier_url;
            if (req.file) {
                // On stocke l'URL relative accessible via le middleware static
                final_fichier_url = `http://localhost:5000/uploads/${req.file.filename}`;
            }

            const [result] = await pool.query(
                'INSERT INTO cours (formation_id, titre, type, contenu, fichier_url, ordre, avis_formateur) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [formation_id, titre, type, contenu, final_fichier_url, ordre || 0, avis_formateur || '']
            );
            res.status(201).json({
                success: true,
                message: 'Contenu ajouté avec succès',
                contentId: result.insertId
            });
        } catch (error) {
            console.error('Erreur addCourseContent:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'ajout du contenu'
            });
        }
    },

    updateCourseContent: async (req, res) => {
        try {
            const { id } = req.params;
            const { titre, type, contenu, fichier_url, ordre, avis_formateur } = req.body;

            // Si un nouveau fichier a été uploadé, mettre à jour l'URL
            let final_fichier_url = fichier_url;
            if (req.file) {
                final_fichier_url = `http://localhost:5000/uploads/${req.file.filename}`;
            }

            await pool.query(
                'UPDATE cours SET titre = ?, type = ?, contenu = ?, fichier_url = ?, ordre = ?, avis_formateur = ? WHERE id = ?',
                [titre, type, contenu, final_fichier_url, ordre, avis_formateur, id]
            );

            res.json({
                success: true,
                message: 'Contenu mis à jour avec succès'
            });
        } catch (error) {
            console.error('Erreur updateCourseContent:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour du contenu'
            });
        }
    },

    // Supprimer un contenu
    deleteCourseContent: async (req, res) => {
        try {
            const { id } = req.params;
            await pool.query('DELETE FROM cours WHERE id = ?', [id]);
            res.json({
                success: true,
                message: 'Contenu supprimé avec succès'
            });
        } catch (error) {
            console.error('Erreur deleteCourseContent:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression du contenu'
            });
        }
    },

    // Marquer une formation comme consultée
    markCourseAsViewed: async (req, res) => {
        try {
            const { id } = req.params; // ID de la formation
            const studentId = req.user.id;

            await pool.query(
                'UPDATE inscription SET last_viewed_at = CURRENT_TIMESTAMP WHERE apprenant_id = ? AND formation_id = ?',
                [studentId, id]
            );

            res.json({
                success: true,
                message: 'Formation marquée comme consultée'
            });
        } catch (error) {
            console.error('Erreur markCourseAsViewed:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour de l\'état de consultation'
            });
        }
    },

    // Mettre à jour la progression d'un cours (leçon)
    updateLessonProgress: async (req, res) => {
        try {
            const { id } = req.params; // ID du contenu (cours)
            const { completed } = req.body;
            const studentId = req.user.id;
            const percentage = completed ? 100 : 0;
            const dateUpdate = new Date().toISOString().split('T')[0];

            await pool.query(`
                INSERT INTO progression_cours (apprenant_id, cours_id, pourcentage, dateMiseAJour)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    pourcentage = VALUES(pourcentage),
                    dateMiseAJour = VALUES(dateMiseAJour)
            `, [studentId, id, percentage, dateUpdate]);

            res.json({
                success: true,
                message: 'Progression mise à jour'
            });
        } catch (error) {
            console.error('Erreur updateLessonProgress:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour de la progression'
            });
        }
    }
};

module.exports = courseController;
