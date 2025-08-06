import React from 'react';

function VideoChat({ localVideoRef, remoteVideoRef, isConnected }) {
  return (
    <div className="video-container">
      <div className="video-wrapper">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="remote-video"
        />
        <div className="video-label stranger-label">Stranger</div>
        {!isConnected && (
          <div className="video-placeholder">
            <div className="placeholder-icon">👤</div>
            <p>Waiting for connection...</p>
          </div>
        )}
      </div>
      
      <div className="video-wrapper">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="local-video"
        />
        <div className="video-label you-label">You</div>
      </div>
    </div>
  );
}

export default VideoChat;