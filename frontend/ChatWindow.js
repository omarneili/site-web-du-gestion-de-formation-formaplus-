import React, { useState, useEffect, useRef } from 'react';
import { FaCommentAlt, FaTimes, FaPaperPlane, FaUserCircle, FaArrowLeft } from 'react-icons/fa';
import messageService from '../../services/messageService';
import { useAuth } from '../../context/AuthContext';
import './ChatWindow.css';

const ChatWindow = ({ contactUser, onChatClosed }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalUnread, setTotalUnread] = useState(0);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (contactUser) {
            setIsOpen(true);
            setSelectedUser(contactUser);
        }
    }, [contactUser]);

    useEffect(() => {
        if (isOpen && !selectedUser) {
            fetchConversations();
        }
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 10000);
        return () => clearInterval(interval);
    }, [isOpen, selectedUser]);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages();
            scrollToBottom();
            // Polling pour les nouveaux messages (toutes les 5 secondes)
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchConversations = async () => {
        const data = await messageService.getRecentConversations();
        if (data.success) {
            setConversations(data.conversations);
        }
    };

    const fetchUnreadCount = async () => {
        if (!user) return;
        const data = await messageService.getUnreadCount();
        if (data.success) {
            setTotalUnread(data.unreadCount);
        }
    };

    const fetchMessages = async () => {
        if (!selectedUser) return;
        const data = await messageService.getConversation(selectedUser.id);
        if (data.success) {
            setMessages(data.messages);
            // Marquer comme lu à la réception si la fenêtre est ouverte
            if (isOpen && data.messages.some(m => m.expediteur_id === selectedUser.id && !m.lu)) {
                await messageService.markAsRead(selectedUser.id);
                fetchUnreadCount();
            }
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        const data = await messageService.sendMessage({
            destinataire_id: selectedUser.id,
            contenu: newMessage
        });

        if (data.success) {
            setNewMessage('');
            fetchMessages();
        }
    };

    const selectConversation = async (conv) => {
        const contact = {
            id: conv.contact_id,
            nom: conv.contact_nom,
            prenom: conv.contact_prenom
        };
        setSelectedUser(contact);
        await messageService.markAsRead(contact.id);
        fetchUnreadCount();
    };

    return (
        <div className="chat-window-container">
            {isOpen ? (
                <div className="chat-box">
                    <div className="chat-header">
                        {selectedUser ? (
                            <>
                                <button className="close-chat-btn" onClick={() => {
                                    setSelectedUser(null);
                                    if (onChatClosed) onChatClosed();
                                }}>
                                    <FaArrowLeft />
                                </button>
                                <h3>{selectedUser.prenom} {selectedUser.nom}</h3>
                            </>
                        ) : (
                            <h3>Messagerie</h3>
                        )}
                        <button className="close-chat-btn" onClick={() => {
                            setIsOpen(false);
                            if (onChatClosed) onChatClosed();
                        }}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="chat-body">
                        {selectedUser ? (
                            <>
                                {messages.length > 0 ? (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`message ${msg.expediteur_id === user.id ? 'sent' : 'received'}`}
                                        >
                                            {msg.contenu}
                                            <span className="message-time">
                                                {new Date(msg.date_envoi).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-chat">
                                        <p>Commencez la conversation...</p>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        ) : (
                            <div className="conversation-list">
                                {conversations.length > 0 ? (
                                    conversations.map((conv) => (
                                        <div
                                            key={conv.id}
                                            className="conversation-item"
                                            onClick={() => selectConversation(conv)}
                                        >
                                            <div className="conv-info">
                                                <div className="conv-header">
                                                    <h4>{conv.contact_prenom} {conv.contact_nom}</h4>
                                                    {conv.unread_count > 0 && (
                                                        <span className="unread-badge">{conv.unread_count}</span>
                                                    )}
                                                </div>
                                                <p className="last-msg">{conv.contenu}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-chat">
                                        <FaCommentAlt size={40} />
                                        <p>Aucune conversation pour le moment.</p>
                                        {user.role === 'apprenant' && (
                                            <p style={{ fontSize: '0.8rem' }}>Allez dans mes formations pour contacter un formateur.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {selectedUser && (
                        <form className="chat-footer" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                className="chat-input"
                                placeholder="Votre message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit" className="send-msg-btn">
                                <FaPaperPlane />
                            </button>
                        </form>
                    )}
                </div>
            ) : (
                <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
                    <FaCommentAlt />
                    {totalUnread > 0 && <span className="notification-bubble">{totalUnread}</span>}
                </button>
            )}
        </div>
    );
};

export default ChatWindow;
