import React, { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';
import courseService from '../services/courseService';
import categoryService from '../services/categoryService';
import {
    FaUserPlus, FaEdit, FaTrash, FaUserShield, FaChalkboardTeacher,
    FaUserEdit, FaSearch, FaLock, FaUnlock, FaBook, FaPlus,
    FaTag, FaClipboardList, FaMoneyBillWave
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
    // --- State Global ---
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    // --- State Utilisateurs ---
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [userFormData, setUserFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: 'apprenant'
    });

    // --- State Formations ---
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingCourse, setEditingCourse] = useState(null);
    const [courseFormData, setCourseFormData] = useState({
        titre: '',
        description: '',
        duree: '',
        prix: '',
        niveau: 'débutant',
        categorie_id: '',
        formateur_id: ''
    });

    // --- State Catégories (Gestion) ---
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryFormData, setCategoryFormData] = useState({ nom: '' });

    // --- State Inscriptions ---
    const [enrollments, setEnrollments] = useState([]);

    // --- Actions API ---

    const fetchUsers = useCallback(async () => {
        const data = await userService.getAllUsers();
        if (data.success) setUsers(data.users);
    }, []);

    const fetchCourses = useCallback(async () => {
        const data = await courseService.getAllCourses();
        if (data.success) setCourses(data.courses);
    }, []);

    const fetchCategories = useCallback(async () => {
        const data = await categoryService.getAllCategories();
        if (data.success) setCategories(data.categories);
    }, []);

    const fetchEnrollments = useCallback(async () => {
        const data = await courseService.getAllEnrollments();
        if (data.success) setEnrollments(data.enrollments);
    }, []);

    const loadInitialData = useCallback(async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchUsers(),
                fetchCourses(),
                fetchCategories(),
                fetchEnrollments()
            ]);
        } catch (err) {
            setError('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    }, [fetchUsers, fetchCourses, fetchCategories]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    // --- Handlers Communs ---

    const handleSearch = (e) => setSearchTerm(e.target.value);

    const handleOpenModal = (data = null) => {
        if (activeTab === 'users') {
            if (data) {
                setEditingUser(data);
                setUserFormData({
                    nom: data.nom,
                    prenom: data.prenom,
                    email: data.email,
                    password: '',
                    role: data.role
                });
            } else {
                setEditingUser(null);
                setUserFormData({ nom: '', prenom: '', email: '', password: '', role: 'apprenant' });
            }
        } else if (activeTab === 'courses') {
            if (data) {
                setEditingCourse(data);
                setCourseFormData({
                    titre: data.titre,
                    description: data.description,
                    duree: data.duree,
                    prix: data.prix,
                    niveau: data.niveau,
                    categorie_id: data.categorie_id || '',
                    formateur_id: data.formateur_id || ''
                });
            } else {
                setEditingCourse(null);
                setCourseFormData({
                    titre: '',
                    description: '',
                    duree: '',
                    prix: '',
                    niveau: 'débutant',
                    categorie_id: categories.length > 0 ? categories[0].id : '',
                    formateur_id: ''
                });
            }
        } else {
            // Tab catégories
            if (data) {
                setEditingCategory(data);
                setCategoryFormData({ nom: data.nom });
            } else {
                setEditingCategory(null);
                setCategoryFormData({ nom: '' });
            }
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setEditingCourse(null);
        setEditingCategory(null);
        setError('');
    };

    // --- Handlers Utilisateurs ---

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await userService.updateUser(editingUser.id, userFormData);
            } else {
                await userService.addUser(userFormData);
            }
            fetchUsers();
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue');
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Supprimer cet utilisateur ?')) {
            await userService.deleteUser(id);
            fetchUsers();
        }
    };

    const handleToggleStatus = async (user) => {
        const nextStatus = user.statut === 'actif' ? 'bloque' : 'actif';
        await userService.toggleUserStatus(user.id, nextStatus);
        fetchUsers();
    };

    // --- Handlers Formations ---

    const handleCourseSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCourse) {
                await courseService.updateCourse(editingCourse.id, courseFormData);
            } else {
                await courseService.addCourse(courseFormData);
            }
            fetchCourses();
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
        }
    };

    const handleDeleteCourse = async (id) => {
        if (window.confirm('Supprimer cette formation ?')) {
            await courseService.deleteCourse(id);
            fetchCourses();
        }
    };

    // --- Handlers Catégories ---

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id, categoryFormData);
            } else {
                await categoryService.addCategory(categoryFormData);
            }
            fetchCategories();
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement de la catégorie');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Supprimer cette catégorie ? Cela supprimera également toutes les formations associées !')) {
            await categoryService.deleteCategory(id);
            fetchCategories();
            fetchCourses(); // Re-fetch courses since some might have been deleted (cascade)
        }
    };

    // --- Rendu ---

    const filteredUsers = users.filter(u =>
        u.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCourses = courses.filter(c =>
        c.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.categorie_nom?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCategories = categories.filter(c =>
        c.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        users: users.length,
        courses: courses.length,
        categories: categories.length,
        formateurs: users.filter(u => u.role === 'formateur').length,
        totalRevenue: enrollments.reduce((sum, e) => sum + parseFloat(e.formation_prix || 0), 0)
    };

    if (loading) return <div className="loading">Chargement du dashboard...</div>;

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <div className="header-main">
                    <h1>Administration</h1>
                    <div className="tab-switcher">
                        <button
                            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => setActiveTab('users')}
                        >
                            <FaUserShield /> Utilisateurs
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
                            onClick={() => setActiveTab('courses')}
                        >
                            <FaBook /> Formations
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
                            onClick={() => setActiveTab('categories')}
                        >
                            <FaTag /> Catégories
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'enrollments' ? 'active' : ''}`}
                            onClick={() => setActiveTab('enrollments')}
                        >
                            <FaClipboardList /> Inscriptions
                        </button>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <FaUserEdit />
                        <div className="stat-info">
                            <span>Utilisateurs</span>
                            <strong>{stats.users}</strong>
                        </div>
                    </div>
                    <div className="stat-card">
                        <FaChalkboardTeacher />
                        <div className="stat-info">
                            <span>Formateurs</span>
                            <strong>{stats.formateurs}</strong>
                        </div>
                    </div>
                    <div className="stat-card">
                        <FaBook />
                        <div className="stat-info">
                            <span>Formations</span>
                            <strong>{stats.courses}</strong>
                        </div>
                    </div>
                    <div className="stat-card">
                        <FaTag />
                        <div className="stat-info">
                            <span>Catégories</span>
                            <strong>{stats.categories}</strong>
                        </div>
                    </div>
                    <div className="stat-card">
                        <FaClipboardList />
                        <div className="stat-info">
                            <span>Inscriptions</span>
                            <strong>{enrollments.length}</strong>
                        </div>
                    </div>
                </div>
            </header>

            <main className="dashboard-content">
                <div className="controls">
                    <div className="search-bar">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder={
                                activeTab === 'users' ? "Rechercher un utilisateur..." :
                                    activeTab === 'courses' ? "Rechercher une formation..." :
                                        activeTab === 'categories' ? "Rechercher une catégorie..." :
                                            "Rechercher une inscription..."
                            }
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    {activeTab !== 'enrollments' ? (
                        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                            {activeTab === 'users' ? <FaUserPlus /> : <FaPlus />}
                            {activeTab === 'users' ? ' Ajouter un Utilisateur' :
                                (activeTab === 'courses' ? ' Nouvelle Formation' : ' Nouvelle Catégorie')}
                        </button>
                    ) : (
                        <div className="revenue-display-mini">
                            <FaMoneyBillWave />
                            <div className="rev-info">
                                <span>Revenu Total:</span>
                                <strong>{stats.totalRevenue.toFixed(2)} DT</strong>
                            </div>
                        </div>
                    )}
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <div className="table-container">
                    {activeTab === 'users' ? (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Rôle</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.prenom} {user.nom}</td>
                                        <td>{user.email}</td>
                                        <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                                        <td><span className={`status-badge ${user.statut}`}>{user.statut}</span></td>
                                        <td className="actions">
                                            <button className="btn-icon" onClick={() => handleToggleStatus(user)}>
                                                {user.statut === 'bloque' ? <FaUnlock /> : <FaLock />}
                                            </button>
                                            <button className="btn-icon" onClick={() => handleOpenModal(user)}><FaEdit /></button>
                                            <button className="btn-icon btn-delete" onClick={() => handleDeleteUser(user.id)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : activeTab === 'courses' ? (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Formation</th>
                                    <th>Catégorie</th>
                                    <th>Duree</th>
                                    <th>Prix</th>
                                    <th>Formateur</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.map(course => (
                                    <tr key={course.id}>
                                        <td>
                                            <div className="course-name-cell">
                                                <strong>{course.titre}</strong>
                                                <span>{course.niveau}</span>
                                            </div>
                                        </td>
                                        <td><span className="cat-badge">{course.categorie_nom}</span></td>
                                        <td>{course.duree}h</td>
                                        <td>{course.prix} DT</td>
                                        <td>{course.formateur_prenom || 'N/A'} {course.formateur_nom || ''}</td>
                                        <td className="actions">
                                            <button className="btn-icon" onClick={() => handleOpenModal(course)}><FaEdit /></button>
                                            <button className="btn-icon btn-delete" onClick={() => handleDeleteCourse(course.id)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : activeTab === 'categories' ? (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nom de la Catégorie</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map(cat => (
                                    <tr key={cat.id}>
                                        <td>#{cat.id}</td>
                                        <td><strong>{cat.nom}</strong></td>
                                        <td className="actions">
                                            <button className="btn-icon" onClick={() => handleOpenModal(cat)}><FaEdit /></button>
                                            <button className="btn-icon btn-delete" onClick={() => handleDeleteCategory(cat.id)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Apprenant</th>
                                    <th>Formation</th>
                                    <th>Formateur</th>
                                    <th>Date</th>
                                    <th>Prix</th>
                                    <th>Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.filter(e =>
                                    e.apprenant_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    e.apprenant_prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    e.formation_titre.toLowerCase().includes(searchTerm.toLowerCase())
                                ).map(enrollment => (
                                    <tr key={enrollment.id}>
                                        <td>
                                            <div className="user-info-cell">
                                                <strong>{enrollment.apprenant_prenom} {enrollment.apprenant_nom}</strong>
                                                <span>{enrollment.apprenant_email}</span>
                                            </div>
                                        </td>
                                        <td>{enrollment.formation_titre}</td>
                                        <td>{enrollment.formateur_prenom || '-'} {enrollment.formateur_nom || ''}</td>
                                        <td>{new Date(enrollment.dateInscription).toLocaleDateString()}</td>
                                        <td>{enrollment.formation_prix} DT</td>
                                        <td>
                                            <span className={`status-badge ${enrollment.statut}`}>
                                                {enrollment.statut}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main >

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>
                            {activeTab === 'users'
                                ? (editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur')
                                : activeTab === 'courses'
                                    ? (editingCourse ? 'Modifier la formation' : 'Nouvelle Formation')
                                    : (editingCategory ? 'Modifier la catégorie' : 'Nouvelle Catégorie')}
                        </h2>

                        <form onSubmit={
                            activeTab === 'users' ? handleUserSubmit :
                                activeTab === 'courses' ? handleCourseSubmit :
                                    handleCategorySubmit
                        }>
                            {activeTab === 'users' ? (
                                <>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Nom</label>
                                            <input type="text" name="nom" value={userFormData.nom} onChange={(e) => setUserFormData({ ...userFormData, nom: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Prénom</label>
                                            <input type="text" name="prenom" value={userFormData.prenom} onChange={(e) => setUserFormData({ ...userFormData, prenom: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="email" name="email" value={userFormData.email} onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Mot de passe {editingUser && '(laisser vide pour garder l\'actuel)'}</label>
                                        <input type="password" name="password" value={userFormData.password} onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })} required={!editingUser} />
                                    </div>
                                    <div className="form-group">
                                        <label>Rôle</label>
                                        <select value={userFormData.role} onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}>
                                            <option value="apprenant">Apprenant</option>
                                            <option value="formateur">Formateur</option>
                                            <option value="administrateur">Administrateur</option>
                                        </select>
                                    </div>
                                </>
                            ) : activeTab === 'courses' ? (
                                <>
                                    <div className="form-group">
                                        <label>Titre de la formation</label>
                                        <input type="text" value={courseFormData.titre} onChange={(e) => setCourseFormData({ ...courseFormData, titre: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea value={courseFormData.description} onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })} required rows="3"></textarea>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Durée (heures)</label>
                                            <input type="number" value={courseFormData.duree} onChange={(e) => setCourseFormData({ ...courseFormData, duree: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Prix (DT)</label>
                                            <input type="number" step="0.01" value={courseFormData.prix} onChange={(e) => setCourseFormData({ ...courseFormData, prix: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Niveau</label>
                                            <select value={courseFormData.niveau} onChange={(e) => setCourseFormData({ ...courseFormData, niveau: e.target.value })}>
                                                <option value="débutant">Débutant</option>
                                                <option value="intermédiaire">Intermédiaire</option>
                                                <option value="avancé">Avancé</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Catégorie</label>
                                            <select value={courseFormData.categorie_id} onChange={(e) => setCourseFormData({ ...courseFormData, categorie_id: e.target.value })} required>
                                                <option value="">Sélectionner...</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Formateur assigné</label>
                                        <select value={courseFormData.formateur_id} onChange={(e) => setCourseFormData({ ...courseFormData, formateur_id: e.target.value })}>
                                            <option value="">Non assigné</option>
                                            {users.filter(u => u.role === 'formateur').map(u => (
                                                <option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label>Nom de la catégorie</label>
                                        <input
                                            type="text"
                                            value={categoryFormData.nom}
                                            onChange={(e) => setCategoryFormData({ ...categoryFormData, nom: e.target.value })}
                                            required
                                            placeholder="Ex: Intelligence Artificielle"
                                        />
                                    </div>
                                </>
                            )}
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Annuler</button>
                                <button type="submit" className="btn btn-primary">
                                    {editingUser || editingCourse || editingCategory ? 'Mettre à jour' : 'Ajouter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div >
    );
};

export default AdminDashboard;
