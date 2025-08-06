import React from 'react';

function Controls({ isConnected, isWaiting, onStart, onSkip }) {
  return (
    <div className="controls">
      {!isConnected && !isWaiting && (
        <button onClick={onStart} className="start-button">
          🚀 Start Chatting
        </button>
      )}
      
      {isWaiting && (
        <div className="waiting-indicator">
          <div className="spinner"></div>
          <p>Finding someone to chat with...</p>
        </div>
      )}
      
      {isConnected && (
        <button onClick={onSkip} className="skip-button">
          ⏭️ Skip to Next Person
        </button>
      )}
    </div>
  );
}

export default Controls;