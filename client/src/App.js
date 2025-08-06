import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import VideoChat from './components/VideoChat';
import TextChat from './components/TextChat';
import Controls from './components/Controls';
import './styles/App.css';

const socket = io('http://localhost:5000');

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    // Socket event listeners
    socket.on('waiting', () => {
      setIsWaiting(true);
      setConnectionStatus('waiting');
    });

    socket.on('match-found', (data) => {
      setIsWaiting(false);
      setIsConnected(true);
      setRoomId(data.roomId);
      setPartnerId(data.partnerId);
      setConnectionStatus('connected');
      setMessages([]);
      initializeWebRTC();
    });

    socket.on('receive-message', (data) => {
      setMessages(prev => [...prev, { 
        text: data.message, 
        sender: 'stranger', 
        timestamp: data.timestamp 
      }]);
    });

    socket.on('partner-left', () => {
      setConnectionStatus('partner-left');
      resetConnection();
    });

    socket.on('skipped', () => {
      setConnectionStatus('skipped');
      resetConnection();
    });

    // WebRTC signaling
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);

    return () => {
      socket.off('waiting');
      socket.off('match-found');
      socket.off('receive-message');
      socket.off('partner-left');
      socket.off('skipped');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  }, []);

  const initializeWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      peerConnectionRef.current = peerConnection;

      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', event.candidate);
        }
      };

      // Create offer for the first user
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit('offer', offer);

    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const handleOffer = async (offer) => {
    try {
      await peerConnectionRef.current.setRemoteDescription(offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit('answer', answer);
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async (answer) => {
    try {
      await peerConnectionRef.current.setRemoteDescription(answer);
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  const handleIceCandidate = async (candidate) => {
    try {
      await peerConnectionRef.current.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  const startChat = () => {
    socket.emit('join-queue', { timestamp: new Date() });
  };

  const skipChat = () => {
    socket.emit('skip');
  };

  const sendMessage = (message) => {
    if (message.trim() && isConnected) {
      socket.emit('send-message', { message });
      setMessages(prev => [...prev, { 
        text: message, 
        sender: 'you', 
        timestamp: new Date() 
      }]);
    }
  };

  const resetConnection = () => {
    setIsConnected(false);
    setIsWaiting(false);
    setRoomId(null);
    setPartnerId(null);
    setMessages([]);
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎥 Simple Chat</h1>
        <div className={`status ${connectionStatus}`}>
          {connectionStatus === 'waiting' && 'Looking for someone...'}
          {connectionStatus === 'connected' && 'Connected to stranger'}
          {connectionStatus === 'partner-left' && 'Stranger disconnected'}
          {connectionStatus === 'skipped' && 'Chat ended'}
          {connectionStatus === 'disconnected' && 'Ready to chat'}
        </div>
      </header>

      <main className="app-main">
        <div className="video-section">
          <VideoChat 
            localVideoRef={localVideoRef}
            remoteVideoRef={remoteVideoRef}
            isConnected={isConnected}
          />
        </div>

        <div className="chat-section">
          <TextChat 
            messages={messages}
            onSendMessage={sendMessage}
            isConnected={isConnected}
          />
        </div>
      </main>

      <Controls 
        isConnected={isConnected}
        isWaiting={isWaiting}
        onStart={startChat}
        onSkip={skipChat}
      />
    </div>
  );
}

export default App;