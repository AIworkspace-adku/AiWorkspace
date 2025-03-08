// frontend/src/components/FloatingChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import socket from '../socket';
import styles from './FloatingChat.module.css';

const FloatingChat = ({ teamId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Simple color generator for usernames
  const getColorForUser = (username) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
      '#D4A5A5', '#9B59B6', '#3498DB', '#E74C3C', '#2ECC71',
    ];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  useEffect(() => {
    const fetchMessagesAndUser = async () => {
      try {
        // Fetch messages
        const msgRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/group/messages/${teamId}`, {
          withCredentials: true,
        });
        console.log(msgRes.data);
        setMessages(msgRes.data);

        // Fetch current user data
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/protected`, {
          method: 'POST',
          credentials: 'include',
          withCredentials: true, // Include cookies in the request
        })
          .then((response) => {
            if (!response.ok) {
              if (response.status === 401) {
                navigate('/session-timeout');
              }
              else {
                throw new Error('Failed to fetch data');
              }
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
            setCurrentUser(data);
          })
          .catch((error) => {
            console.log(error);
            setError(error.message)
          });
      } catch (err) {
        console.error('Error fetching data:', err.message);
      }
    };

    fetchMessagesAndUser();

    socket.emit('joinGroup', teamId);
    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off('message');
  }, [teamId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/group/message/${teamId}`,
        { content },
        { withCredentials: true }
      );
      socket.emit('sendMessage', {
        teamId,
        content: res.data.content,
        sender: res.data.sender,
        _id: res.data._id,
        timestamp: res.data.timestamp,
      });
      setContent('');
    } catch (err) {
      console.error('Error sending message:', err.message);
      alert('Failed to send message');
    }
  };

  const toggleMinimize = () => setIsMinimized(!isMinimized);

  return (
    <div className={`${styles.chatContainer} ${isMinimized ? styles.minimized : ''}`}>
      <div className={styles.header}>
        <h3>Team Chat</h3>
        <div className={styles.headerButtons}>
          <button onClick={toggleMinimize} className={styles.minimizeButton}>
            {isMinimized ? '+' : '−'}
          </button>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
      </div>
      {!isMinimized && (
        <>
          <div className={styles.messages}>
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`${styles.message} ${
                  currentUser && msg.sender.email === currentUser.email ? styles.sent : styles.received
                }`}
              >
                <span
                  className={styles.sender}
                  style={{ color: getColorForUser(msg.sender.username) }}
                >
                  {msg.sender.username}
                </span>
                <div className={styles.content}>{msg.content}</div>
                <span className={styles.timestamp}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className={styles.chatForm}>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type a message..."
              className={styles.input}
            />
            <button type="submit" className={styles.sendButton}>Send</button>
          </form>
        </>
      )}
    </div>
  );
};

export default FloatingChat;