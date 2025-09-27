import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import UserRegistration from './components/UserRegistration';
import UserList from './components/UserList';
import ChatInterface from './components/ChatInterface';
import config from './config/config';

const socket = io(config.SOCKET_URL);

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
      socket.emit(config.SOCKET_EVENTS.JOIN, savedUserId);
      setIsConnected(true);
    }

    // Socket connection events
    socket.on(config.SOCKET_EVENTS.CONNECT, () => {
      console.log('Connected to server');
    });

    socket.on(config.SOCKET_EVENTS.DISCONNECT, () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on(config.SOCKET_EVENTS.USER_STATUS_UPDATE, (data) => {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.userId === data.userId 
            ? { ...user, isOnline: data.isOnline }
            : user
        )
      );
    });

    return () => {
      socket.off(config.SOCKET_EVENTS.CONNECT);
      socket.off(config.SOCKET_EVENTS.DISCONNECT);
      socket.off(config.SOCKET_EVENTS.USER_STATUS_UPDATE);
    };
  }, []);

  const handleUserRegistration = (user) => {
    setCurrentUser(user);
    localStorage.setItem('userId', user.userId);
    localStorage.setItem('user', JSON.stringify(user));
    socket.emit(config.SOCKET_EVENTS.JOIN, user.userId);
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
