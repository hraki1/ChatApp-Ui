import React, { useState, useEffect } from 'react';
import config from '../config/config';

const UserList = ({ currentUser, users, onUserSelect, isConnected }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${config.API_URL}${config.ENDPOINTS.USERS}`);
      if (response.ok) {
        const data = await response.json();
        // Handle both old and new response formats
        const userData = data.users || data;
        // Filter out current user from the list
        const otherUsers = userData.filter(user => user.userId !== currentUser.userId);
        setAllUsers(otherUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (isOnline) => {
    return isOnline ? 'bg-green-500' : 'bg-gray-400';
  };

  const getStatusText = (isOnline) => {
    return isOnline ? 'Online' : 'Offline';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={`${config.API_URL}${config.ENDPOINTS.UPLOADS}/${currentUser.image}`}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(isConnected)}`}></div>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">{currentUser.name}</h1>
                <p className="text-sm text-gray-500">{isConnected ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-800">{config.APP_NAME}</h2>
              <p className="text-sm text-gray-500">Select a user to start chatting</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">All Users ({allUsers.length})</h3>
          </div>
          
          {allUsers.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-600">No other users found</p>
              <p className="text-sm text-gray-500 mt-2">Be the first to join the chat!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {allUsers.map((user) => (
                <div
                  key={user.userId}
                  onClick={() => onUserSelect(user)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={`${config.API_URL}${config.ENDPOINTS.UPLOADS}/${user.image}`}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(user.isOnline)}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium text-gray-900 truncate">
                          {user.name}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.isOnline 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {getStatusText(user.isOnline)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {user.isOnline ? 'Active now' : `Last seen ${new Date(user.lastSeen).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
