import React, { useState } from 'react';
import { FaCreditCard, FaCalendarAlt, FaLock, FaTimes } from 'react-icons/fa';
import './PaymentModal.css';

const PaymentModal = ({ course, onClose, onConfirm, loading }) => {
    const [formData, setFormData] = useState({
        card_number: '',
        card_expiry: '',
        card_cvv: ''
    });

    const handleChange = (e) => {
        let { name, value } = e.target;

        // Auto-format for card number (max 16 chars)
        if (name === 'card_number') {
            value = value.replace(/\D/g, '').slice(0, 16);
        }
        // Auto-format for expiry (MM/YY)
        if (name === 'card_expiry') {
            value = value.replace(/\D/g, '').slice(0, 4);
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
        }
        // Auto-format for CVV (max 3 or 4)
        if (name === 'card_cvv') {
            value = value.replace(/\D/g, '').slice(0, 3);
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="payment-modal">
                <button className="close-btn" onClick={onClose}><FaTimes /></button>

                <div className="modal-header">
                    <h2>Paiement Sécurisé</h2>
                    <p>Vous vous inscrivez à : <strong>{course.titre}</strong></p>
                    <div className="modal-price">{course.prix} DT</div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Numéro de Carte</label>
                        <div className="input-group">
                            <input
                                type="text"
                                name="card_number"
                                placeholder="0000 0000 0000 0000"
                                value={formData.card_number}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Expiration (MM/YY)</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="card_expiry"
                                    placeholder="12/24"
                                    value={formData.card_expiry}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>CVV</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="card_cvv"
                                    placeholder="123"
                                    value={formData.card_cvv}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="security-notice">
                        <FaLock /> Vos informations sont traitées de manière sécurisée.
                    </div>

                    <button type="submit" className="confirm-btn" disabled={loading}>
                        {loading ? 'Traitement...' : `Payer ${course.prix} DT`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
