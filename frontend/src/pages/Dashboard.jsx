import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { skillService, matchService } from '../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [userSkills, setUserSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch user's skills
        const skillsResponse = await skillService.getUserSkills();
        
        // Fetch skill matches
        const matchesResponse = await matchService.getMatches();
        console.log('Matches response:', matchesResponse.data);
        
        // Ensure data is properly handled as arrays
        setUserSkills(Array.isArray(skillsResponse.data) ? skillsResponse.data : []);
        
        // Check if matches is in the expected format
        const matchesData = matchesResponse.data.matches || [];
        setMatches(Array.isArray(matchesData) ? matchesData : []);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        // Initialize with empty arrays on error
        setUserSkills([]);
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Summary Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Skills</h2>
          {userSkills.length > 0 ? (
            <div className="space-y-3">
              {Array.isArray(userSkills) && userSkills.slice(0, 3).map((skill) => (
                <span 
                  key={skill.id}
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    skill.type === 'offered' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {skill.skillName}
                </span>
              ))}
              {userSkills.length > 3 && (
                <Link to="/skills" className="text-blue-500 hover:underline text-sm block mt-2">
                  View all {userSkills.length} skills →
                </Link>
              )}
            </div>
          ) : (
            <p className="text-gray-500">You haven't added any skills yet.</p>
          )}
          <Link 
            to="/skills" 
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Manage Skills
          </Link>
        </div>
        
        {/* Matches Summary Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Potential Matches</h2>
          {matches.length > 0 ? (
            <div className="space-y-3">
              {matches.slice(0, 3).map((match) => (
                <div key={match.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{match.userName}</p>
                    <p className="text-sm text-gray-500">
                      {match.matchingSkill} ({match.matchType})
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Match
                  </span>
                </div>
              ))}
              {matches.length > 3 && (
                <Link to="/matches" className="text-blue-500 hover:underline text-sm block mt-2">
                  View all {matches.length} matches →
                </Link>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No matches found yet. Add more skills to find potential matches.</p>
          )}
          <Link 
            to="/matches" 
            className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
          >
            Explore Matches
          </Link>
        </div>
      </div>
      
      {/* Quick Actions Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/profile" 
            className="bg-white rounded-lg shadow-md p-4 text-center hover:bg-gray-50 transition duration-200"
          >
            <div className="text-2xl mb-2">👤</div>
            <p className="font-medium">Update Profile</p>
          </Link>
          <Link 
            to="/skills" 
            className="bg-white rounded-lg shadow-md p-4 text-center hover:bg-gray-50 transition duration-200"
          >
            <div className="text-2xl mb-2">🧠</div>
            <p className="font-medium">Add Skills</p>
          </Link>
          <Link 
            to="/matches" 
            className="bg-white rounded-lg shadow-md p-4 text-center hover:bg-gray-50 transition duration-200"
          >
            <div className="text-2xl mb-2">🔍</div>
            <p className="font-medium">Find Matches</p>
          </Link>
          <Link 
            to="/swaps" 
            className="bg-white rounded-lg shadow-md p-4 text-center hover:bg-gray-50 transition duration-200"
          >
            <div className="text-2xl mb-2">🔄</div>
            <p className="font-medium">Manage Swaps</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;