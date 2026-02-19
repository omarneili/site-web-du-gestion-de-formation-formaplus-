import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaChalkboardTeacher, FaUserShield, FaClock, FaBook, FaCheckCircle, FaCommentAlt } from 'react-icons/fa';
import courseService from '../services/courseService';
import CourseList from '../components/CourseList';
import './Dashboard.css';
import ChatWindow from '../components/Chat/ChatWindow';

const Dashboard = () => {
    const { user } = useAuth();
    const [instructorCourses, setInstructorCourses] = React.useState([]);
    const [instructorStudents, setInstructorStudents] = React.useState([]);
    const [enrolledCourses, setEnrolledCourses] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [fetchError, setFetchError] = React.useState(null);
    const [studentTab, setStudentTab] = React.useState('available'); // 'available' or 'mine'
    const [trainerTab, setTrainerTab] = React.useState('courses'); // 'courses' or 'students'
    const [contactTrainer, setContactTrainer] = React.useState(null);

    const fetchDashboardData = async () => {
        if (!user) return;
        setLoading(true);
        setFetchError(null);
        try {
            if (user.role === 'formateur') {
                try {
                    const coursesRes = await courseService.getInstructorCourses();
                    if (coursesRes.success) setInstructorCourses(coursesRes.courses);
                } catch (err) {
                    console.error('Error fetching courses:', err);
                }

                try {
                    const studentsRes = await courseService.getInstructorStudents();
                    if (studentsRes.success) {
                        setInstructorStudents(studentsRes.students);
                    } else {
                        console.warn('API Warning (students):', studentsRes.message);
                        setFetchError(studentsRes.message);
                    }
                } catch (err) {
                    console.error('Error fetching students:', err);
                    setFetchError('Erreur lors de la récupération des apprenants');
                }
            } else if (user.role === 'apprenant') {
                const data = await courseService.getEnrolledCourses();
                if (data.success) setEnrolledCourses(data.courses);
            }
        } catch (error) {
            console.error('General Dashboard Error:', error);
            setFetchError('Erreur de chargement du tableau de bord');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchDashboardData();
    }, [user]);

    const getDashboardContent = () => {
        switch (user?.role) {
            case 'administrateur':
                return (
                    <div className="dashboard-content">
                        <div className="welcome-card">
                            <FaUserShield className="role-icon admin" />
                            <h2>Tableau de bord Administrateur</h2>
                            <p>Bienvenue, {user.prenom} {user.nom}</p>
                        </div>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Utilisateurs</h3>
                                <p className="stat-number">0</p>
                                <span>Total des utilisateurs</span>
                            </div>
                            <div className="stat-card">
                                <h3>Formations</h3>
                                <p className="stat-number">0</p>
                                <span>Formations actives</span>
                            </div>
                            <div className="stat-card">
                                <h3>Inscriptions</h3>
                                <p className="stat-number">0</p>
                                <span>Inscriptions totales</span>
                            </div>
                        </div>
                    </div>
                );

            case 'formateur':
                return (
                    <div className="dashboard-content">
                        <div className="welcome-hero">
                            <div className="hero-text">
                                <span className="hero-badge formateur">Espace Formateur</span>
                                <h2>Ravi de vous revoir, {user.prenom} {user.nom} 👋</h2>
                                <p>Gérez vos formations et suivez la progression de vos apprenants en un coup d'œil.</p>
                            </div>
                            <div className="hero-icon-container">
                                <FaChalkboardTeacher className="hero-icon formateur" />
                            </div>
                        </div>

                        <div className="student-tabs trainer-tabs">
                            <button
                                className={`tab-btn ${trainerTab === 'courses' ? 'active' : ''}`}
                                onClick={() => setTrainerTab('courses')}
                            >
                                <FaBook /> Mes Formations ({instructorCourses.length})
                            </button>
                            <button
                                className={`tab-btn ${trainerTab === 'students' ? 'active' : ''}`}
                                onClick={() => setTrainerTab('students')}
                            >
                                <FaGraduationCap /> Mes Apprenants ({instructorStudents.length})
                            </button>
                        </div>

                        {trainerTab === 'courses' ? (
                            <div className="instructor-courses-section">
                                <div className="section-header">
                                    <h3>Formations Assignées</h3>
                                </div>
                                {fetchError && <div className="alert alert-error">{fetchError}</div>}
                                {loading ? (
                                    <div className="loading-small">Chargement de vos formations...</div>
                                ) : instructorCourses.length > 0 ? (
                                    <div className="instructor-courses-grid">
                                        {instructorCourses.map(course => (
                                            <div key={course.id} className="instructor-course-card">
                                                <div className="course-card-header">
                                                    <span className="category-tag">{course.categorie_nom}</span>
                                                    <span className={`level-tag ${course.niveau}`}>{course.niveau}</span>
                                                </div>
                                                <h4>{course.titre}</h4>
                                                <div className="course-card-footer">
                                                    <span><FaClock /> {course.duree}h</span>
                                                    <span className="course-price-mini">{course.prix} DT</span>
                                                    <Link to={`/course/${course.id}`} className="btn-view-details">Détails</Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="info-card">
                                        <p>Vous n'avez pas encore de formations assignées.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="instructor-students-section">
                                <div className="section-header">
                                    <h3>Liste de vos Apprenants</h3>
                                </div>
                                {instructorStudents.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Apprenant</th>
                                                    <th>Email</th>
                                                    <th>Formation</th>
                                                    <th>Inscrit le</th>
                                                    <th>Statut</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {instructorStudents.map(student => (
                                                    <tr key={student.inscription_id}>
                                                        <td>
                                                            <div className="user-info-cell">
                                                                <div className="user-avatar-mini">
                                                                    {student.apprenant_nom.charAt(0)}{student.apprenant_prenom.charAt(0)}
                                                                </div>
                                                                <span>{student.apprenant_prenom} {student.apprenant_nom}</span>
                                                            </div>
                                                        </td>
                                                        <td>{student.apprenant_email}</td>
                                                        <td><strong>{student.formation_titre}</strong></td>
                                                        <td>{new Date(student.dateInscription).toLocaleDateString()}</td>
                                                        <td>
                                                            <span className={`status-badge ${student.statut}`}>
                                                                {student.statut}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="info-card">
                                        <p>Aucun apprenant n'est encore inscrit à vos formations.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );

            case 'apprenant':
                return (
                    <div className="dashboard-content">
                        <div className="welcome-hero">
                            <div className="hero-text">
                                <span className="hero-badge apprenant">Espace Apprenant</span>
                                <h2>Ravi de vous revoir, {user.prenom} {user.nom} 👋</h2>
                                <p>Continuez votre parcours d'apprentissage et développez de nouvelles compétences dès aujourd'hui.</p>
                            </div>
                            <div className="hero-icon-container">
                                <FaGraduationCap className="hero-icon apprenant" />
                            </div>
                        </div>

                        <div className="student-tabs">
                            <button
                                className={`tab-btn ${studentTab === 'available' ? 'active' : ''}`}
                                onClick={() => setStudentTab('available')}
                            >
                                <FaBook /> Formations Disponibles
                            </button>
                            <button
                                className={`tab-btn ${studentTab === 'mine' ? 'active' : ''}`}
                                onClick={() => setStudentTab('mine')}
                            >
                                <FaCheckCircle />Mes Formations({enrolledCourses.length})
                            </button>
                        </div>

                        {studentTab === 'available' ? (
                            <CourseList />
                        ) : (
                            <div className="my-courses-section">
                                {loading ? (
                                    <div className="loading-small">Chargement de vos formations...</div>
                                ) : enrolledCourses.length > 0 ? (
                                    <div className="instructor-courses-grid">
                                        {enrolledCourses.map(course => (
                                            <div key={course.id} className="instructor-course-card">
                                                {course.hasNewContent && <div className="notification-dot" title="Nouveau contenu ajouté !"></div>}
                                                <div className="course-card-header">
                                                    <span className="category-tag">{course.categorie_nom}</span>
                                                    <span className={`level-tag ${course.niveau}`}>{course.niveau}</span>
                                                </div>
                                                <h4>{course.titre}</h4>
                                                <div className="enrolled-meta">
                                                    <span>Inscrit le {new Date(course.dateInscription).toLocaleDateString()}</span>
                                                </div>
                                                <div className="course-card-actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                                    <Link to={`/course/${course.id}`} className="btn-view-details" style={{ flex: 1, textAlign: 'center' }}>Accéder</Link>
                                                    {course.formateur_id && (
                                                        <button
                                                            className="btn-contact-trainer"
                                                            onClick={() => setContactTrainer({
                                                                id: course.formateur_id,
                                                                nom: course.formateur_nom,
                                                                prenom: course.formateur_prenom
                                                            })}
                                                            style={{
                                                                flex: 1,
                                                                padding: '8px',
                                                                borderRadius: '8px',
                                                                border: '1px solid #4f46e5',
                                                                background: 'transparent',
                                                                color: '#4f46e5',
                                                                fontSize: '0.85rem',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '5px'
                                                            }}
                                                        >
                                                            <FaCommentAlt size={12} /> Contacter
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="course-card-footer" style={{ marginTop: '10px', paddingBottom: '10px' }}>
                                                    <span><FaClock /> {course.duree}h</span>
                                                    <span className="course-price-mini">{course.prix} DT</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <p>Vous n'êtes inscrit à aucune formation pour le moment.</p>
                                        <button className="btn btn-primary" onClick={() => setStudentTab('available')}>
                                            Parcourir le catalogue
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );

            default:
                return <p>Rôle non reconnu</p>;
        }
    };

    return (
        <div className="dashboard-container">
            {getDashboardContent()}
            <ChatWindow
                contactUser={contactTrainer}
                onChatClosed={() => setContactTrainer(null)}
            />
        </div>
    );
};

export default Dashboard;
