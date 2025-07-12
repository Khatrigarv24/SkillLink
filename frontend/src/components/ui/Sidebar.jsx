import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HomeIcon, 
  UserIcon, 
  ArrowsRightLeftIcon, 
  BoltIcon,
  StarIcon,
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, badge: null },
    { name: 'Profile', href: '/profile', icon: UserIcon, badge: null },
    { name: 'Skills', href: '/skills', icon: BoltIcon, badge: '5' },
    { name: 'Swaps', href: '/swaps', icon: ArrowsRightLeftIcon, badge: '2' },
    { name: 'Matches', href: '/matches', icon: StarIcon, badge: '8' },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, badge: null },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.aside 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      exit={{ x: -280 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="w-64 bg-gradient-to-b from-indigo-800 via-indigo-700 to-indigo-900 text-white shadow-2xl relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-purple-600/20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16" />
      
      <div className="h-full flex flex-col relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between h-16 px-4 border-b border-indigo-600/50"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-white to-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-indigo-700 font-bold text-sm">S</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
              SkillLink
            </h1>
          </div>
          
          {/* Close button for mobile */}
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-indigo-600/50 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </motion.button>
          )}
        </motion.div>
        
        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto px-3 py-4">
          <motion.nav 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1 space-y-2"
          >
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm border border-white/20'
                        : 'text-indigo-100 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={`${
                            isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'
                          } mr-3 flex-shrink-0`}
                        >
                          <item.icon className="h-5 w-5" />
                        </motion.div>
                        <span className="truncate">{item.name}</span>
                      </div>
                      
                      {/* Badge */}
                      {item.badge && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-4 text-indigo-700 bg-white rounded-full min-w-[20px]"
                        >
                          {item.badge}
                        </motion.span>
                      )}
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </motion.nav>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-4 border-t border-indigo-600/50"
          >
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm border border-white/20'
                    : 'text-indigo-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Cog6ToothIcon className="mr-3 h-5 w-5 text-indigo-300 group-hover:text-white" />
              Settings
            </NavLink>
          </motion.div>
        </div>
        
        {/* User Profile Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-4 border-t border-indigo-600/50 bg-gradient-to-r from-indigo-800/50 to-purple-800/50 backdrop-blur-sm"
        >
          {/* User Info */}
          <div className="flex items-center mb-4 p-2 rounded-xl bg-white/5 backdrop-blur-sm">
            <div className="relative">
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden ring-2 ring-white/20">
                {user?.profilePhotoUrl ? (
                  <img
                    className="h-full w-full object-cover"
                    src={user.profilePhotoUrl}
                    alt={user?.name}
                  />
                ) : (
                  <span className="text-lg font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-indigo-200 truncate">{user?.email}</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 rounded-lg bg-white/5">
              <div className="text-lg font-bold text-white">12</div>
              <div className="text-xs text-indigo-200">Skills</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/5">
              <div className="text-lg font-bold text-white">8</div>
              <div className="text-xs text-indigo-200">Swaps</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/5">
              <div className="text-lg font-bold text-white">4.8</div>
              <div className="text-xs text-indigo-200">Rating</div>
            </div>
          </div>
          
          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 border border-white/20 rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-500 hover:to-red-600 backdrop-blur-sm transition-all duration-200"
          >
            <ArrowLeftOnRectangleIcon className="mr-2 h-4 w-4" />
            Sign Out
          </motion.button>
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;