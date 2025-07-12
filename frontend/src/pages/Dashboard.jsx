import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { skillService, matchService, swapService } from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  UserIcon,
  BoltIcon,
  ArrowsRightLeftIcon,
  StarIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [userSkills, setUserSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [recentSwaps, setRecentSwaps] = useState([]);
  const [stats, setStats] = useState({
    totalSkills: 0,
    activeSwaps: 0,
    completedSwaps: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch user's skills
        const skillsResponse = await skillService.getUserSkills();
        const skillsData = Array.isArray(skillsResponse.data) ? skillsResponse.data : [];
        setUserSkills(skillsData);
        
        // Fetch skill matches
        const matchesResponse = await matchService.getMatches();
        const matchesData = matchesResponse.data?.matches || [];
        setMatches(Array.isArray(matchesData) ? matchesData : []);
        
        // Fetch recent swaps
        const swapsResponse = await swapService.getSwaps();
        const swapsData = Array.isArray(swapsResponse.data) ? swapsResponse.data : [];
        setRecentSwaps(swapsData.slice(0, 5)); // Get recent 5 swaps
        
        // Calculate stats
        const activeSwaps = swapsData.filter(swap => swap.status === 'pending' || swap.status === 'accepted').length;
        const completedSwaps = swapsData.filter(swap => swap.status === 'completed').length;
        
        setStats({
          totalSkills: skillsData.length,
          activeSwaps,
          completedSwaps,
          averageRating: 4.8 // This would come from your rating system
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        // Initialize with empty arrays on error
        setUserSkills([]);
        setMatches([]);
        setRecentSwaps([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-center space-x-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, to, badge }) => (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link
        to={to}
        className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              {badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {badge}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <svg 
            className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-indigo-100 text-lg">
                Ready to continue your skill-sharing journey?
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-indigo-200 text-sm">Today is</p>
                <p className="text-white font-semibold">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Skills"
          value={stats.totalSkills}
          icon={BoltIcon}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          trend={12}
        />
        <StatCard
          title="Active Swaps"
          value={stats.activeSwaps}
          icon={ArrowsRightLeftIcon}
          color="bg-gradient-to-r from-green-500 to-green-600"
          trend={8}
        />
        <StatCard
          title="Completed Swaps"
          value={stats.completedSwaps}
          icon={CheckCircleIcon}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          trend={25}
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating}
          icon={StarIcon}
          color="bg-gradient-to-r from-yellow-500 to-orange-500"
          trend={5}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Skills & Matches */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <Link to="/swaps" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentSwaps.length > 0 ? (
                <div className="space-y-4">
                  {recentSwaps.slice(0, 4).map((swap, index) => (
                    <motion.div
                      key={swap.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className={`p-2 rounded-full ${
                        swap.status === 'completed' ? 'bg-green-100' :
                        swap.status === 'accepted' ? 'bg-blue-100' :
                        swap.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        <ArrowsRightLeftIcon className={`h-4 w-4 ${
                          swap.status === 'completed' ? 'text-green-600' :
                          swap.status === 'accepted' ? 'text-blue-600' :
                          swap.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Swap request {swap.status}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(swap.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        swap.status === 'completed' ? 'bg-green-100 text-green-800' :
                        swap.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClockIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Skills Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Your Skills</h2>
                <Link to="/skills" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  Manage Skills
                </Link>
              </div>
            </div>
            <div className="p-6">
              {userSkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Skills You Offer</h3>
                    <div className="space-y-2">
                      {userSkills.filter(skill => skill.type === 'offered').slice(0, 3).map((skill) => (
                        <div key={skill.id} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{skill.skillName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Skills You Want</h3>
                    <div className="space-y-2">
                      {userSkills.filter(skill => skill.type === 'wanted').slice(0, 3).map((skill) => (
                        <div key={skill.id} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{skill.skillName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BoltIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No skills added yet</p>
                  <Link
                    to="/skills"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Your First Skill
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Quick Actions & Matches */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <QuickActionCard
                title="Update Profile"
                description="Keep your profile current"
                icon={UserIcon}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
                to="/profile"
              />
              <QuickActionCard
                title="Add Skills"
                description="Expand your skill portfolio"
                icon={BoltIcon}
                color="bg-gradient-to-r from-green-500 to-green-600"
                to="/skills"
                badge={userSkills.length === 0 ? "New" : null}
              />
              <QuickActionCard
                title="Find Matches"
                description="Discover learning opportunities"
                icon={EyeIcon}
                color="bg-gradient-to-r from-purple-500 to-purple-600"
                to="/matches"
                badge={matches.length > 0 ? matches.length : null}
              />
              <QuickActionCard
                title="Manage Swaps"
                description="Track your skill exchanges"
                icon={ArrowsRightLeftIcon}
                color="bg-gradient-to-r from-orange-500 to-red-500"
                to="/swaps"
                badge={stats.activeSwaps > 0 ? stats.activeSwaps : null}
              />
            </div>
          </motion.div>

          {/* Potential Matches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Potential Matches</h2>
                <Link to="/matches" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {matches.length > 0 ? (
                <div className="space-y-3">
                  {matches.slice(0, 3).map((match, index) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {match.userName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {match.userName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {match.matchingSkill}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {match.matchType}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <StarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No matches yet</p>
                  <p className="text-xs text-gray-400">Add more skills to find matches</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Achievement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center space-x-3">
              <TrophyIcon className="h-8 w-8" />
              <div>
                <h3 className="font-semibold">Skill Sharer</h3>
                <p className="text-yellow-100 text-sm">
                  You're making great progress! Keep sharing your skills.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;