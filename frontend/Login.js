import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login(formData);
            if (result.success) {
                if (result.user.role === 'administrateur') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(result.message || 'Erreur de connexion');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion. Vérifiez vos identifiants.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Connexion</h1>
                    <p>Bienvenue sur la plateforme FormaPlus</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">
                            <FaEnvelope /> Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="votre_email@exemple.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            <FaLock /> Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? (
                            'Connexion...'
                        ) : (
                            <>
                                <FaSignInAlt /> Se connecter
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Pas encore de compte ? <Link to="/register">Inscrivez-vous</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
