import React, { useState, useEffect, useRef } from "react";
import "./Ragui.css";

function Ragui() {
  const [files, setFiles] = useState([]);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const totalFiles = files.length + uploadedFiles.length;

    if (totalFiles > 5) {
      alert("You can upload a maximum of 5 files!");
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  // Remove a file
  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Simulate question answering
  const handleAskQuestion = async () => {
    if (!question.trim()) {
      return;
    }

    const userMessage = { type: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setQuestion("");

    setTimeout(() => {
      const newAnswer =
        files.length === 0
          ? "I can help answer your questions. If you want me to analyze specific documents, please upload them."
          : "This is a sample answer based on the documents you provided.";

      const assistantMessage = { type: "assistant", content: newAnswer };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Enter key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAskQuestion();
    }
  };

  return (
    <div className="app-container">
      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <div className="model-selector">
            <span>RAG Model</span>
          </div>
        </div>

        {/* Messages Section */}
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <h2>What can I help with?</h2>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.type}`}>
                  <div className="message-icon">
                    {message.type === "user" ? "👤" : "🤖"}
                  </div>
                  <div className="message-content">{message.content}</div>
                </div>
              ))}
              {isLoading && (
                <div className="message assistant">
                  <div className="message-icon">🤖</div>
                  <div className="message-content">
                    <div className="loading-dots">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="input-area">
          <div className="input-container">
            <label htmlFor="file-upload" className="file-upload-btn">
              📎
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                disabled={files.length >= 5}
                className="hidden-file-input"
              />
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything"
              className="input-field"
              rows="1"
            />
            <button
              onClick={handleAskQuestion}
              className={`send-btn ${!question.trim() ? "disabled" : ""}`}
              disabled={!question.trim()}
            >
              ➤
            </button>
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="file-bar">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${file.lastModified}`}
                  className="file-chip"
                >
                  {file.name}
                  <button
                    onClick={() => removeFile(index)}
                    className="remove-chip"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="input-footer">
            <span className="disclaimer">
              This model can make mistakes. Check important info.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ragui;
