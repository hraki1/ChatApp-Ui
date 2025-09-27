// Environment configuration
const config = {
  // Backend URLs
  API_URL: process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://chatapp-backend-myr7.onrender.com' : 'http://localhost:5000'),
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || (process.env.NODE_ENV === 'production' ? 'https://chatapp-backend-myr7.onrender.com' : 'http://localhost:5000'),
  
  // App settings
  APP_NAME: process.env.REACT_APP_APP_NAME || 'Chat App',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  
  // File upload settings
  MAX_FILE_SIZE: parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 5242880, // 5MB
  ALLOWED_FILE_TYPES: process.env.REACT_APP_ALLOWED_FILE_TYPES || 'image/*',
  
  // UI settings
  DEFAULT_AVATAR: process.env.REACT_APP_DEFAULT_AVATAR || '/default-avatar.png',
  THEME: process.env.REACT_APP_THEME || 'light',
  
  // API endpoints
  ENDPOINTS: {
    USERS: '/api/users',
    MESSAGES: '/api/messages',
    HEALTH: '/api/health',
    UPLOADS: '/uploads'
  },
  
  // Socket events
  SOCKET_EVENTS: {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    JOIN: 'join',
    SEND_MESSAGE: 'sendMessage',
    RECEIVE_MESSAGE: 'receiveMessage',
    MESSAGE_SENT: 'messageSent',
    TYPING: 'typing',
    USER_TYPING: 'userTyping',
    USER_STATUS_UPDATE: 'userStatusUpdate',
    ERROR: 'error'
  }
};

export default config;
