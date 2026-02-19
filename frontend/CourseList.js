import React, { useState, useEffect } from 'react';
import courseService from '../services/courseService';
import { FaClock, FaCalendarAlt, FaUserTie, FaCheckCircle, FaExclamationCircle, FaMoneyBillWave } from 'react-icons/fa';
import PaymentModal from './PaymentModal';
import './CourseList.css';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [enrolling, setEnrolling] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const getCourseImage = (category) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('web') || cat.includes('dev')) return '/dev.png';
        if (cat.includes('ia') || cat.includes('intelligence artificielle')) return '/ia.png';
        if (cat.includes('data')) return '/data.png';
        if (cat.includes('sec')) return '/sec.png';
        return '/dev.png'; // Default
    };

    const fetchCourses = async () => {
        try {
            const data = await courseService.getAllCourses();
            if (data.success) {
                setCourses(data.courses);
            } else {
                setError('Erreur lors de la récupération des formations');
            }
        } catch (err) {
            setError('Impossible de charger les formations pour le moment');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleEnrollClick = (course) => {
        setSelectedCourse(course);
        setShowPaymentModal(true);
    };

    const handlePaymentConfirm = async (paymentData) => {
        setEnrolling(selectedCourse.id);
        try {
            const data = await courseService.enrollInCourse(selectedCourse.id, paymentData);
            if (data.success) {
                alert('Félicitations ! Votre paiement a été accepté et vous êtes inscrit.');
                setShowPaymentModal(false);
                setSelectedCourse(null);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setEnrolling(null);
        }
    };

    if (loading) {
        return (
            <div className="courses-loading">
                <div className="spinner"></div>
                <p>Chargement des formations...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="courses-error">
                <FaExclamationCircle />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="courses-container">
            <div className="courses-header">
                <h2>Formations Disponibles</h2>
                <p>Découvrez nos programmes de formation pour booster vos compétences</p>
            </div>

            <div className="courses-grid">
                {courses.length > 0 ? (
                    courses.map(course => (
                        <div key={course.id} className="course-card">
                            <div className="course-image-container">
                                <img src={getCourseImage(course.categorie_nom)} alt={course.titre} className="course-image" />
                                <div className="course-badge">{course.categorie_nom || 'Formation'}</div>
                            </div>
                            <div className="course-content">
                                <h3>{course.titre}</h3>
                                <p className="course-description">{course.description}</p>

                                <div className="course-details">
                                    <div className="detail-item">
                                        <FaClock />
                                        <span>{course.duree}h</span>
                                    </div>
                                    <div className="detail-item">
                                        <FaCalendarAlt />
                                        <span>{course.niveau || 'Tout niveau'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <FaUserTie />
                                        <span>{course.formateur_prenom ? `${course.formateur_prenom} ${course.formateur_nom}` : 'À confirmer'}</span>
                                    </div>
                                    <div className="detail-item price-item">
                                        <FaMoneyBillWave />
                                        <span>{course.prix} DT</span>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary btn-enroll"
                                    onClick={() => handleEnrollClick(course)}
                                    disabled={enrolling === course.id}
                                >
                                    <FaCheckCircle /> {enrolling === course.id ? 'Inscription...' : 'S\'inscrire'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-courses">
                        <p>Aucune formation disponible pour le moment.</p>
                    </div>
                )}
            </div>

            {showPaymentModal && (
                <PaymentModal
                    course={selectedCourse}
                    onClose={() => setShowPaymentModal(false)}
                    onConfirm={handlePaymentConfirm}
                    loading={enrolling !== null}
                />
            )}
        </div>
    );
};

export default CourseList;
