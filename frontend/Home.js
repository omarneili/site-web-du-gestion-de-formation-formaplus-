import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { user, isAuthenticated } = useAuth();

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Plateforme de Gestion de Formations <span>FormaPlus</span></h1>
                <p className="hero-subtitle">
                    Gérez vos formations, formateurs et apprenants en toute simplicité.
                </p>
                <div className="hero-buttons">
                    {isAuthenticated ? (
                        <Link
                            to={user.role === 'administrateur' ? "/admin-dashboard" : "/dashboard"}
                            className="btn btn-primary-large"
                        >
                            Accéder au Tableau de Bord
                        </Link>
                    ) : (
                        <>
                            <Link to="/register" className="btn btn-primary-large">
                                Commencer maintenant
                            </Link>
                            <Link to="/login" className="btn btn-secondary-large">
                                Se connecter
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <div className="features-section">
                <div className="section-header">
                    <h2>Tout ce dont vous avez besoin pour gérer vos formations efficacement.</h2>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🎓</div>
                        <h3>Gestion des Formations</h3>
                        <p>Créez et gérez vos formations facilement avec nos outils intuitifs.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">👨‍🏫</div>
                        <h3>Espace Formateur</h3>
                        <p>Outils complets pour les formateurs pour suivre leurs cours et étudiants.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📚</div>
                        <h3>Suivi Pédagogique</h3>
                        <p>Suivez la progression des apprenants en temps réel avec des indicateurs clés.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Statistiques</h3>
                        <p>Tableaux de bord et rapports détaillés pour une vision claire de votre activité.</p>
                    </div>
                </div>
            </div>

            <div className="info-section">
                <div className="info-content">
                    <div className="info-text">
                        <h2>Pourquoi choisir <span>FormaPlus</span> ?</h2>
                        <p>Notre plateforme offre une solution complète pour la gestion de vos centres de formation. De l'inscription des apprenants au suivi des certifications, tout est centralisé.</p>
                        <ul className="info-list">
                            <li>Interface intuitive et moderne</li>
                            <li>Accessible sur tous vos appareils</li>
                            <li>Sécurité maximale de vos données</li>
                        </ul>
                    </div>
                    <div className="info-image">
                        <img src="/images/img2.png" alt="Gestion de formation" onerror="this.src='https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000'" />
                    </div>
                </div>
            </div>

            <div className="info-section alternate">
                <div className="info-content">
                    <div className="info-image">
                        <img src="/images/img4.png" alt="Apprentissage" onerror="this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000'" />
                    </div>
                    <div className="info-text">
                        <h2>Une vision moderne de l'apprentissage</h2>
                        <p>Nous croyons en un apprentissage interactif et engageant. FormaPlus facilite la collaboration entre formateurs et apprenants pour de meilleurs résultats.</p>
                        <p>Profitez d'outils collaboratifs exclusifs et d'un suivi en temps réel de votre progression.</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;
