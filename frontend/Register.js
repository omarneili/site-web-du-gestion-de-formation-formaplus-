import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaUserTag } from 'react-icons/fa';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'apprenant'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
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
        setSuccess('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            setLoading(false);
            return;
        }

        try {
            const { confirmPassword, ...dataToSend } = formData;
            const result = await register(dataToSend);

            if (result.success) {
                setSuccess('Inscription réussie ! Redirection vers la connexion...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(result.message || 'Erreur lors de l\'inscription');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Inscription</h1>
                    <p>Créez votre compte pour accéder à la plateforme</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nom">
                                <FaUser /> Nom
                            </label>
                            <input
                                type="text"
                                id="nom"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                placeholder="Votre nom"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="prenom">
                                <FaUser /> Prénom
                            </label>
                            <input
                                type="text"
                                id="prenom"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                placeholder="Votre prénom"
                                required
                            />
                        </div>
                    </div>

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
                        <label htmlFor="role">
                            <FaUserTag /> Rôle
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="apprenant">Apprenant</option>
                            <option value="formateur">Formateur</option>
                        </select>
                    </div>

                    <div className="form-row">
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

                        <div className="form-group">
                            <label htmlFor="confirmPassword">
                                <FaLock /> Confirmer
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? (
                            'Inscription...'
                        ) : (
                            <>
                                <FaUserPlus /> S'inscrire
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Déjà un compte ? <Link to="/login">Connectez-vous</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
