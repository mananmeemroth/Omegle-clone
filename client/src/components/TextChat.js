import React, { useState, useRef, useEffect } from 'react';

function TextChat({ messages, onSendMessage, isConnected }) {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="text-chat">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>💬 Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <span className="sender-label">
                {msg.sender === 'you' ? 'You' : 'Stranger'}:
              </span>
              <span className="message-text">{msg.text}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSend} className="message-input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={isConnected ? "Type a message..." : "Connect to start chatting"}
          disabled={!isConnected}
          className="message-input"
        />
        <button 
          type="submit" 
          disabled={!isConnected || !inputMessage.trim()}
          className="send-button"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default TextChat;