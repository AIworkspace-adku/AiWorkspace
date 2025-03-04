import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import axios from 'axios';


function Chatbot({ userData}) {
  const email = userData.email;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef(null);
  const chatWindowRef = useRef(null);

  const backendURL = 'https://adku-workspaceai.hf.space/chat';

  const toggleChat = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const sendMessage = async () => {
    if (query.trim() === '') return;

    const userMessage = { text: query, type: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const response = await fetch(backendURL, {
        method: "POST", // ✅ Ensure it's a POST request
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, query })
    });
    console.log(response);

    const result = await response.json();
    console.log("🔍 Parsed JSON Result:", result);
  
    if (result.response) {
      console.log("🤖 Bot Reply:", result.response);
      const botResponse = { text: result.response, type: "bot" };
  
      setMessages((prev) =>
        prev.filter((msg) => msg.text !== "Thinking...") // Remove Loader
      );
      setMessages((prev) => [...prev, botResponse]);
    } else {
      console.warn("⚠️ Unexpected API Response Structure");
      setMessages((prev) => [
        ...prev,
        { text: "Invalid response from AI Workspace.", type: "bot" },
      ]);
    }
    } catch (error) {
      console.log(error);
      setMessages((prev) => [...prev, { text: 'Failed to connect to the AI Workspace!', type: 'bot' }]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <button className="chatbot-button" onClick={toggleChat}>
        WorkspaceAI
      </button>

      {open && (
        <div className="chat-window" ref={chatWindowRef} onClick={(e) => e.stopPropagation()}>
          <div className="chat-header">Workspace AI Chatbot</div>
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.type === 'user' ? 'user-message' : 'bot-message'}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="loading">Thinking...</div>}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Chat with WorkspaceAI..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
