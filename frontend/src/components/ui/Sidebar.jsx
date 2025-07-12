import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  HomeIcon, 
  UserIcon, 
  ArrowsRightLeftIcon, 
  BoltIcon,
  StarIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
    { name: 'Skills', href: '/skills', icon: BoltIcon },
    { name: 'Swaps', href: '/swaps', icon: ArrowsRightLeftIcon },
    { name: 'Matches', href: '/matches', icon: StarIcon },
  ];

  return (
    <aside className="w-64 bg-indigo-700 text-white">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center h-16 px-4 border-b border-indigo-800">
          <h1 className="text-2xl font-bold">SkillLink</h1>
        </div>
        
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  isActive
                    ? 'bg-indigo-800 text-white group flex items-center px-3 py-2 text-sm font-medium rounded-md'
                    : 'text-indigo-100 hover:bg-indigo-600 group flex items-center px-3 py-2 text-sm font-medium rounded-md'
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon 
                      className={`${
                        isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'
                      } mr-3 flex-shrink-0 h-6 w-6`} 
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-indigo-800">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
              {user?.profilePhotoUrl ? (
                <img
                  className="h-10 w-10 rounded-full"
                  src={user.profilePhotoUrl}
                  alt={user?.name}
                />
              ) : (
                <span className="text-xl font-medium text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs font-medium text-indigo-200">{user?.email}</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50"
          >
            <ArrowLeftOnRectangleIcon className="mr-2 h-5 w-5" />
            Sign Out
          </motion.button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;