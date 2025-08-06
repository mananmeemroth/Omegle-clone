# 🎥 Simple Omegle Clone

A modern, lightweight Omegle clone built with the MERN stack (minus MongoDB). Connect with random strangers through video chat and text messaging with a beautiful, responsive interface.

![Demo](https://img.shields.io/badge/Status-Working-brightgreen)
![Node](https://img.shields.io/badge/Node.js-v14+-green)
![React](https://img.shields.io/badge/React-18.x-blue)

## 🌟 Features

- 🎥 **Real-time Video Chat** - WebRTC peer-to-peer video calling
- 💬 **Instant Messaging** - Send and receive messages in real-time
- ⏭️ **Skip Functionality** - Easily move to the next person
- 🎨 **Beautiful UI** - Modern gradient design with glassmorphism effects
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🚀 **No Database Required** - Uses in-memory storage for simplicity
- 🔄 **Auto-Matching** - Automatically pairs users from waiting queue
- 📊 **Live Stats** - Monitor active users and connections

## 🖼️ Screenshots

### Main Interface
```
┌─────────────────────────────────────────────────────────┐
│                    🎥 Simple Chat                      │
│                  Connected to stranger                 │
├─────────────────────┬───────────────────────────────────┤
│                     │  💬 Chat Messages               │
│   👤 Stranger       │  ┌─────────────────────────────┐ │
│   [Video Area]      │  │ Stranger: Hello!            │ │
│                     │  │ You: Hi there!              │ │
├─────────────────────┤  │ Stranger: How are you?     │ │
│   🟢 You           │  └─────────────────────────────┘ │
│   [Your Video]      │  ┌─────────────────────────────┐ │
│                     │  │ Type a message...    [Send] │ │
└─────────────────────┴──┴─────────────────────────────┘ │
│              ⏭️ Skip to Next Person                    │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser with WebRTC support

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd omegle-clone
```

2. **Setup Server**
```bash
cd server
npm install
```

3. **Setup Client**
```bash
cd ../client
npm install
```

4. **Start the Application**

**Terminal 1** - Start the server:
```bash
cd server
npm run dev
```

**Terminal 2** - Start the client:
```bash
cd client
npm start
```

5. **Open Your Browser**
- Navigate to `http://localhost:3000`
- Open another tab/browser for testing
- Click "Start Chatting" in both tabs

## 📁 Project Structure

```
omegle-clone/
├── 📁 server/                 # Backend server
│   ├── 📄 package.json       # Server dependencies
│   └── 📄 server.js          # Express + Socket.IO server
├── 📁 client/                 # Frontend React app
│   ├── 📄 package.json       # Client dependencies
│   ├── 📁 public/
│   │   └── 📄 index.html     # HTML template
│   └── 📁 src/
│       ├── 📄 App.js         # Main React component
│       ├── 📄 index.js       # React entry point
│       ├── 📁 components/    # React components
│       │   ├── 📄 VideoChat.js    # Video chat component
│       │   ├── 📄 TextChat.js     # Text messaging component
│       │   └── 📄 Controls.js     # Control buttons
│       └── 📁 styles/
│           └── 📄 App.css    # Styling
└── 📄 README.md              # This file
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Socket.IO Client** - Real-time client
- **WebRTC** - Peer-to-peer video/audio
- **CSS3** - Modern styling with animations

## 🔧 Configuration

### Server Configuration
The server runs on port `5000` by default. You can change this in `server/server.js`:

```javascript
const PORT = process.env.PORT || 5000;
```

### Client Configuration
The client connects to `http://localhost:5000` by default. Update this in `client/src/App.js`:

```javascript
const socket = io('http://localhost:5000');
```

## 🌐 Deployment

### Deploy Server (Backend)
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repository
- **DigitalOcean**: Use App Platform

### Deploy Client (Frontend)  
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `build` folder
- **GitHub Pages**: Push to `gh-pages` branch

### Environment Variables
Set these for production:
```bash
PORT=5000                           # Server port
REACT_APP_SERVER_URL=your-server-url # Client server URL
```

## 📊 Monitoring

### Health Check Endpoint
Visit `http://localhost:5000/health` to see:
```json
{
  "status": "OK",
  "users": 2,
  "waiting": 0, 
  "activeRooms": 1
}
```

### Server Logs
The server provides detailed logging:
```
🚀 Server running on port 5000
📊 Health check available at http://localhost:5000/health
User connected: 8Xp7bN9gKLlz1AAAB
User 8Xp7bN9gKLlz1AAAB added to waiting queue
User connected: mN4kJ6tR8FgL2BBBC  
Matched users: 8Xp7bN9gKLlz1AAAB and mN4kJ6tR8FgL2BBBC
```

## 🎨 Customization

### Change Colors
Update the gradient in `client/src/styles/App.css`:
```css
.app {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Modify Layout
Adjust the grid layout:
```css
.app-main {
  grid-template-columns: 2fr 1fr; /* Video : Chat ratio */
}
```

### Add Features
- User authentication
- Interest-based matching  
- Country filtering
- Chat history
- Screen sharing
- File sharing

## 🐛 Troubleshooting

### Common Issues

**1. Camera/Microphone not working**
- Ensure HTTPS in production (WebRTC requirement)
- Check browser permissions
- Test with `chrome://settings/content/camera`

**2. Users not matching**
- Check server logs for connection issues
- Verify Socket.IO connection in browser dev tools
- Ensure both clients are connected

**3. Video not showing**
- WebRTC requires HTTPS in production
- Check firewall/NAT settings
- Test on localhost first

**4. Build errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Browser Support
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ❌ Internet Explorer (not supported)

## 🔒 Security Considerations

### For Production
- Enable HTTPS/WSS
- Add rate limiting
- Implement user reporting
- Add content moderation
- Use turn servers for WebRTC
- Add CSRF protection

### Privacy
- No data is permanently stored
- Sessions are cleared on disconnect
- Video/audio streams are peer-to-peer
- Messages are not logged

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- WebRTC for peer-to-peer communication
- Socket.IO for real-time messaging
- React team for the amazing framework
- The original Omegle for inspiration

## 📞 Support

Having issues? Check out:
- [GitHub Issues](https://github.com/yourname/omegle-clone/issues)
- [WebRTC Documentation](https://webrtc.org/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [React Documentation](https://reactjs.org/)

---

**Made with ❤️ and React**

*Happy coding! 🎉*
