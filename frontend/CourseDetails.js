import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import {
    FaClock, FaTag, FaSignal, FaMoneyBillWave,
    FaUserTie, FaArrowLeft, FaCalendarAlt, FaCheckCircle,
    FaPlus, FaFilePdf, FaVideo, FaFlask, FaEdit, FaTrash, FaExternalLinkAlt, FaQuoteLeft
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './CourseDetails.css';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingContent, setEditingContent] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMode, setUploadMode] = useState('url'); // 'url' or 'file'
    const [formData, setFormData] = useState({
        titre: '',
        type: 'PDF',
        contenu: '',
        fichier_url: '',
        ordre: 0,
        avis_formateur: ''
    });

    const fetchCourseDetails = useCallback(async () => {
        setLoading(true);
        try {
            const data = await courseService.getCourseById(id);
            if (data.success) {
                setCourse(data.course);

                // Vérifier si l'utilisateur est inscrit (si c'est un apprenant)
                if (user?.role === 'apprenant') {
                    const enrolledData = await courseService.getEnrolledCourses();
                    if (enrolledData.success) {
                        const enrolled = enrolledData.courses.some(c => c.id === parseInt(id));
                        setIsEnrolled(enrolled);
                    }
                }

                // Charger le contenu du cours
                fetchContents();

                // Marquer comme consulté si c'est un apprenant inscrit
                if (user?.role === 'apprenant') {
                    courseService.markAsViewed(id).catch(console.error);
                }
            } else {
                setError(data.message || 'Impossible de charger les détails de la formation');
            }
        } catch (err) {
            console.error('Erreur fetchCourseDetails:', err);
            setError('Une erreur est survenue lors de la récupération des données');
        } finally {
            setLoading(false);
        }
    }, [id, user]);

    const fetchContents = async () => {
        try {
            const data = await courseService.getCourseContent(id);
            if (data.success) {
                setContents(data.content);
            }
        } catch (err) {
            console.error('Erreur fetchContents:', err);
        }
    };

    useEffect(() => {
        fetchCourseDetails();
    }, [fetchCourseDetails]);

    if (loading) return (
        <div className="details-loading">
            <div className="spinner"></div>
            <p>Chargement des détails...</p>
        </div>
    );

    if (error || !course) return (
        <div className="details-error">
            <h2>Oops!</h2>
            <p>{error || 'Formation non trouvée'}</p>
            <button className="btn btn-primary" onClick={() => navigate(-1)}>Retour</button>
        </div>
    );

    return (
        <div className="course-details-page">
            <div className="details-container">
                <button className="btn-back" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Retour
                </button>

                <div className="details-grid">
                    <div className="details-main">
                        <div className="details-header">
                            <div className="category-badge">{course.categorie_nom}</div>
                            <h1>{course.titre}</h1>
                            <div className="header-meta">
                                <span><FaSignal /> {course.niveau}</span>
                                <span><FaClock /> {course.duree} heures</span>
                                <span><FaCalendarAlt /> Mis à jour le {new Date(course.updated_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="details-section">
                            <h3>Description</h3>
                            <p>{course.description}</p>
                        </div>

                        <div className="details-section">
                            <h3>Ce que vous apprendrez</h3>
                            <ul className="learning-points">
                                <li><FaCheckCircle /> Maîtrise des concepts fondamentaux</li>
                                <li><FaCheckCircle /> Application pratique sur des projets réels</li>
                                <li><FaCheckCircle /> Accompagnement personnalisé par un expert</li>
                                <li><FaCheckCircle /> Certification de fin de formation</li>
                            </ul>
                        </div>

                        {/* Section Contenu de la formation */}
                        <div className="details-section content-section">
                            <div className="section-header-actions">
                                <h3>Programme de la formation</h3>
                                {(user?.role === 'administrateur' || (user?.role === 'formateur' && user.id === course?.formateur_id)) && (
                                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                                        <FaPlus /> Ajouter un contenu
                                    </button>
                                )}
                            </div>

                            {/* Barre de progression pour l'apprenant */}
                            {user?.role === 'apprenant' && isEnrolled && contents.length > 0 && (
                                <div className="course-global-progress-box">
                                    <div className="progress-header">
                                        <h4>Ma Progression</h4>
                                        <span className="progress-percentage">
                                            {Math.round((contents.filter(c => c.completed).length / contents.length) * 100)}%
                                        </span>
                                    </div>
                                    <div className="global-progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${(contents.filter(c => c.completed).length / contents.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {contents.length > 0 ? (
                                <div className="content-list">
                                    {contents.map((item) => (
                                        <div key={item.id} className="content-item-card">
                                            <div className="content-item-header">
                                                <div className="item-info-main">
                                                    <span className="item-type-badge">
                                                        {item.type === 'PDF' && <FaFilePdf />}
                                                        {item.type === 'Vidéo' && <FaVideo />}
                                                        {item.type === 'Quiz' && <FaFlask />}
                                                        {item.type === 'Présentation' && <FaFilePdf />}
                                                        {' '}{item.type}
                                                    </span>
                                                    <h4>{item.titre}</h4>
                                                </div>

                                                {(user?.role === 'administrateur' || (user?.role === 'formateur' && user.id === course?.formateur_id)) && (
                                                    <div className="item-actions">
                                                        <button className="btn-icon btn-edit" title="Modifier" onClick={() => handleOpenModal(item)}>
                                                            <FaEdit />
                                                        </button>
                                                        <button className="btn-icon btn-delete" title="Supprimer" onClick={() => handleDeleteContent(item.id)}>
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                )}

                                                {user?.role === 'apprenant' && isEnrolled && (
                                                    <div className="item-completion-toggle">
                                                        <label className={`completion-label ${item.completed ? 'completed' : ''}`}>
                                                            <input
                                                                type="checkbox"
                                                                checked={item.completed}
                                                                onChange={() => handleToggleComplete(item.id, !item.completed)}
                                                            />
                                                            <span>{item.completed ? 'Terminé' : 'Marquer comme terminé'}</span>
                                                        </label>
                                                    </div>
                                                )}
                                            </div>

                                            {item.contenu && <p className="item-description">{item.contenu}</p>}

                                            {/* Avis du formateur */}
                                            {item.avis_formateur && (
                                                <div className="trainer-opinion-box">
                                                    <div className="opinion-header">
                                                        <FaQuoteLeft /> Avis du formateur
                                                    </div>
                                                    <p className="opinion-text">{item.avis_formateur}</p>
                                                </div>
                                            )}

                                            {/* Bouton d'accès pour les inscrits ou le formateur */}
                                            {(user?.role === 'administrateur' || (user?.role === 'formateur' && user.id === course?.formateur_id) || isEnrolled) ? (
                                                item.fichier_url && (
                                                    <a href={item.fichier_url} target="_blank" rel="noopener noreferrer" className="btn-access">
                                                        <FaExternalLinkAlt /> Accéder au contenu
                                                    </a>
                                                )
                                            ) : (
                                                <div className="lock-message">
                                                    <p>Inscrivez-vous pour accéder à ce contenu.</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-content">Aucun contenu disponible pour le moment.</p>
                            )}
                        </div>
                    </div>

                    <div className="details-sidebar">
                        <div className="sidebar-card instructor-card">
                            <h3>Formateur</h3>
                            <div className="instructor-info">
                                <div className="instructor-avatar">
                                    <FaUserTie />
                                </div>
                                <div className="instructor-text">
                                    <strong>{course.formateur_prenom} {course.formateur_nom}</strong>
                                    <span>Expert en {course.categorie_nom}</span>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-card details-list">
                            <h3>Détails</h3>
                            <ul>
                                <li>
                                    <FaTag />
                                    <span>Catégorie: <strong>{course.categorie_nom}</strong></span>
                                </li>
                                <li>
                                    <FaSignal />
                                    <span>Niveau: <strong>{course.niveau}</strong></span>
                                </li>
                                <li>
                                    <FaClock />
                                    <span>Durée: <strong>{course.duree} heures</strong></span>
                                </li>
                                <li>
                                    <FaMoneyBillWave />
                                    <span>Prix: <strong>{course.prix} DT</strong></span>
                                </li>
                            </ul>
                            {user?.role === 'apprenant' && !isEnrolled && (
                                <button
                                    className="btn btn-primary btn-block mt-2"
                                    onClick={() => navigate(`/checkout/${id}`)}
                                >
                                    S'inscrire à {course.prix} DT
                                </button>
                            )}
                            {isEnrolled && (
                                <div className="enrollment-status">
                                    <FaCheckCircle className="text-success" /> Vous êtes inscrit
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de gestion du contenu */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="content-modal">
                        <h3>{editingContent ? 'Modifier le contenu' : 'Ajouter un contenu'}</h3>
                        <form onSubmit={handleSubmitContent}>
                            <div className="form-group">
                                <label>Titre</label>
                                <input
                                    type="text"
                                    value={formData.titre}
                                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Type de contenu</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="PDF">PDF</option>
                                    <option value="Vidéo">Vidéo</option>
                                    <option value="Présentation">Présentation</option>
                                    <option value="Quiz">Quiz</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Description/Contenu</label>
                                <textarea
                                    value={formData.contenu}
                                    onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Mode d'ajout du document</label>
                                <div className="mode-toggle">
                                    <button
                                        type="button"
                                        className={`mode-btn ${uploadMode === 'url' ? 'active' : ''}`}
                                        onClick={() => setUploadMode('url')}
                                    >
                                        Lien URL
                                    </button>
                                    <button
                                        type="button"
                                        className={`mode-btn ${uploadMode === 'file' ? 'active' : ''}`}
                                        onClick={() => setUploadMode('file')}
                                    >
                                        Fichier Local
                                    </button>
                                </div>
                            </div>

                            {uploadMode === 'url' ? (
                                <div className="form-group">
                                    <label>URL du fichier/vidéo</label>
                                    <input
                                        type="url"
                                        value={formData.fichier_url}
                                        onChange={(e) => setFormData({ ...formData, fichier_url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label>Sélectionner le fichier (PDF, Image)</label>
                                    <input
                                        type="file"
                                        accept=".pdf,image/*"
                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                    />
                                    {selectedFile && <p className="file-info">📄 {selectedFile.name}</p>}
                                </div>
                            )}
                            <div className="form-group">
                                <label>Ordre d'affichage</label>
                                <input
                                    type="number"
                                    value={formData.ordre}
                                    onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Avis du formateur</label>
                                <textarea
                                    value={formData.avis_formateur}
                                    onChange={(e) => setFormData({ ...formData, avis_formateur: e.target.value })}
                                    rows="3"
                                    placeholder="Donnez votre avis ou des instructions sur ce cours..."
                                ></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingContent ? 'Mettre à jour' : 'Ajouter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    // Fonctions de gestion du contenu
    function handleOpenModal(item = null) {
        if (item) {
            setEditingContent(item);
            setFormData({
                titre: item.titre,
                type: item.type,
                contenu: item.contenu || '',
                fichier_url: item.fichier_url || '',
                ordre: item.ordre || 0,
                avis_formateur: item.avis_formateur || ''
            });
        } else {
            setEditingContent(null);
            setSelectedFile(null);
            setUploadMode('url');
            setFormData({
                titre: '',
                type: 'PDF',
                contenu: '',
                fichier_url: '',
                ordre: contents.length,
                avis_formateur: ''
            });
        }
        setShowModal(true);
    }

    async function handleSubmitContent(e) {
        e.preventDefault();
        try {
            // Utiliser FormData si un fichier est sélectionné
            let dataToSubmit;
            if (uploadMode === 'file' && selectedFile) {
                dataToSubmit = new FormData();
                dataToSubmit.append('titre', formData.titre);
                dataToSubmit.append('type', formData.type);
                dataToSubmit.append('contenu', formData.contenu);
                dataToSubmit.append('ordre', formData.ordre);
                dataToSubmit.append('avis_formateur', formData.avis_formateur);
                dataToSubmit.append('fichier', selectedFile);
                if (!editingContent) dataToSubmit.append('formation_id', id);
            } else {
                dataToSubmit = editingContent ? formData : { ...formData, formation_id: id };
            }

            if (editingContent) {
                await courseService.updateContent(editingContent.id, dataToSubmit);
            } else {
                await courseService.addContent(dataToSubmit);
            }
            setShowModal(false);
            setSelectedFile(null);
            fetchContents();
        } catch (err) {
            console.error('Erreur handleSubmitContent:', err);
            alert('Erreur lors de l\'enregistrement du contenu');
        }
    }

    async function handleDeleteContent(contentId) {
        if (window.confirm('Voulez-vous vraiment supprimer ce contenu ?')) {
            try {
                await courseService.deleteContent(contentId);
                fetchContents();
            } catch (err) {
                console.error('Erreur handleDeleteContent:', err);
                alert('Erreur lors de la suppression');
            }
        }
    }

    async function handleToggleComplete(lessonId, completed) {
        try {
            // Mise à jour optimiste de l'UI
            setContents(prev => prev.map(item =>
                item.id === lessonId ? { ...item, completed } : item
            ));

            await courseService.updateLessonProgress(lessonId, completed);
        } catch (err) {
            console.error('Erreur handleToggleComplete:', err);
            // Recharger en cas d'erreur
            fetchContents();
        }
    }
};

export default CourseDetails;
