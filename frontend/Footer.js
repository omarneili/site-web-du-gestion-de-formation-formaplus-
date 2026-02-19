import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone, FaUserShield } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <img src="/logofor.png" alt="FormaPlus Logo" className="logo-img" /> <span>FormaPlus</span>
                        </Link>
                        <p className="footer-tagline">Votre plateforme de formation de confiance pour un avenir brillant.</p>
                    </div>

                    <div className="footer-contact">
                        <h4>Contactez l'Administrateur</h4>
                        <div className="contact-info">
                            <div className="contact-item">
                                <FaUserShield /> <span>Omar Neili (Responsable)</span>
                            </div>
                            <a href="mailto:omarneili308@gmail.com" className="contact-item link">
                                <FaEnvelope /> <span>omarneili308@gmail.com</span>
                            </a>
                            <a href="tel:+21626518167" className="contact-item link">
                                <FaPhone /> <span>+216 26 518 167</span>
                            </a>
                        </div>
                    </div>
                </div>


            </div>
        </footer>
    );
};

export default Footer;
