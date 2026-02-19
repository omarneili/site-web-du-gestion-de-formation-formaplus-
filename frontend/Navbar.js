import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaHome } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src="/logofor.png" alt="FormaPlus Logo" className="logo-img" /> <span>FormaPlus</span>
                </Link>

                <div className="navbar-menu">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to={user?.role === 'administrateur' ? "/admin-dashboard" : "/dashboard"}
                                className={`nav-link ${location.pathname === '/dashboard' || location.pathname === '/admin-dashboard' ? 'btn-active-tab' : ''}`}
                            >
                                <FaHome /> Tableau de bord
                            </Link>
                            <div className="nav-user">
                                <FaUserCircle />
                                <span>{user?.prenom} {user?.nom}</span>
                                <span className="user-role">({user?.role})</span>
                            </div>
                            <button onClick={handleLogout} className="btn-logout">
                                <FaSignOutAlt /> Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'btn-primary' : ''}`}>Connexion</Link>
                            <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'btn-primary' : ''}`}>Inscription</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
