import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BellIcon, UserIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New skill match found!", date: new Date(), type: "match" },
    { id: 2, message: "Sarah accepted your swap proposal", date: new Date(), type: "swap" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </p>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
                <AnimatePresence>
                  {notifications.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center"
                    >
                      <span className="text-xs font-bold text-white">
                        {notifications.length}
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                          <BellIcon className="mx-auto h-12 w-12 text-gray-300" />
                          <p className="mt-2 text-sm text-gray-500">No new notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer transition-colors duration-200"
                          >
                            <div className="flex items-start">
                              <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                                notification.type === 'match' ? 'bg-green-400' : 'bg-blue-400'
                              }`} />
                              <div className="ml-3 flex-1">
                                <p className="text-sm text-gray-700">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.date.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="bg-gray-50 px-4 py-2">
                        <button 
                          onClick={() => setNotifications([])}
                          className="text-xs text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                          Mark all as read
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* User Avatar */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full px-3 py-2"
            >
              <div className="flex-shrink-0">
                {user?.profilePhotoUrl ? (
                  <img
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
                    src={user.profilePhotoUrl}
                    alt={user?.name}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;