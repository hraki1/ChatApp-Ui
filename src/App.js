import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import UserRegistration from './components/UserRegistration';
import UserList from './components/UserList';
import ChatInterface from './components/ChatInterface';

const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000');

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if user is already registered
    const savedUserId = localStorage.getItem('userId');
    const savedUser = localStorage.getItem('user');
    
    if (savedUserId && savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      socket.emit('join', savedUserId);
      setIsConnected(true);
    }

    // Socket connection events
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('userStatusUpdate', (data) => {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.userId === data.userId 
            ? { ...user, isOnline: data.isOnline }
            : user
        )
      );
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('userStatusUpdate');
    };
  }, []);

  const handleUserRegistration = (user) => {
    setCurrentUser(user);
    localStorage.setItem('userId', user.userId);
    localStorage.setItem('user', JSON.stringify(user));
    socket.emit('join', user.userId);
    setIsConnected(true);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
  };

  if (!currentUser) {
    return <UserRegistration onUserRegistered={handleUserRegistration} />;
  }

  if (selectedUser) {
    return (
      <ChatInterface
        currentUser={currentUser}
        selectedUser={selectedUser}
        socket={socket}
        onBack={handleBackToUsers}
      />
    );
  }

  return (
    <UserList
      currentUser={currentUser}
      users={users}
      onUserSelect={handleUserSelect}
      isConnected={isConnected}
    />
  );
}

export default App;
