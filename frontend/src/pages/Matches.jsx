import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skills, setSkills] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [newSwap, setNewSwap] = useState({
    receiverId: '',
    offeredSkillId: '',
    wantedSkillId: ''
  });

  // Fetch matches and supporting data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get skill matches for the current user
        const matchesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/matches`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Get all skills for reference
        const skillsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/skills`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Get users for displaying names
        const usersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }).catch(() => ({ data: [] })); // Fallback if endpoint doesn't exist
        
        setMatches(matchesResponse.data.matches || []);
        setSkills(skillsResponse.data);
        setUsers(usersResponse.data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load matches. Please try again later.');
        setLoading(false);
        console.error('Error fetching match data:', err);
      }
    };
    
    fetchData();
  }, []);

  // Find username by ID
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  // Find skill ID by name
  const getSkillId = (skillName, userId, type) => {
    const skill = skills.find(s => 
      s.skillName === skillName && 
      s.userId === userId && 
      s.type === type
    );
    return skill ? skill.id : null;
  };

  // Handle selecting a match to create a swap
  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    
    // Find the skill IDs needed for the swap
    const offeredSkillId = getSkillId(match.youOffer, localStorage.getItem('userId'), 'offered');
    const wantedSkillId = getSkillId(match.youWant, localStorage.getItem('userId'), 'wanted');
    
    setNewSwap({
      receiverId: match.partnerId,
      offeredSkillId: offeredSkillId,
      wantedSkillId: wantedSkillId
    });
  };

  // Handle creating a swap request from a match
  const handleCreateSwap = async (e) => {
    e.preventDefault();
    
    try {
      if (!newSwap.offeredSkillId || !newSwap.wantedSkillId) {
        setError('Could not find the necessary skill IDs. Please try again.');
        return;
      }
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/swap`, 
        newSwap,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Reset form and show success
      setSelectedMatch(null);
      setError(null);
      // You could add a success message state here
      
      // Navigate to swaps page - optional, requires useNavigate hook
      // navigate('/swaps');
    } catch (err) {
      setError('Failed to create swap request. Please try again.');
      console.error('Error creating swap:', err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading potential matches...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Skill Matches</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">How Matching Works</h2>
        <p className="mb-4">
          Our matching algorithm identifies users with complementary skills - 
          people who are offering what you want to learn, and who want to learn what you can offer.
        </p>
        <p>
          To improve your matches:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Add more skills to your profile (both offered and wanted)</li>
          <li>Make sure your skill descriptions are clear and specific</li>
          <li>Browse the skills marketplace for inspiration</li>
        </ul>
        <div className="mt-4">
          <Link to="/skills" className="text-blue-600 hover:text-blue-800">
            → Go to Skills Management
          </Link>
        </div>
      </div>
      
      {/* Match results */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Potential Skill Swap Partners</h2>
        
        {matches.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No matches found yet.</p>
            <p className="text-gray-500">
              Try adding more skills to your profile to increase your chances of finding a match.
            </p>
          </div>
        ) : (
          <>
            {selectedMatch ? (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-lg mb-3">Create Swap Request with {getUserName(selectedMatch.partnerId)}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">You'll offer:</p>
                    <p className="text-lg">{selectedMatch.youOffer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">You'll receive:</p>
                    <p className="text-lg">{selectedMatch.youWant}</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleCreateSwap}
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                    disabled={!newSwap.offeredSkillId || !newSwap.wantedSkillId}
                  >
                    Confirm Swap Request
                  </button>
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match, index) => (
                <div 
                  key={index} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="font-medium text-lg mb-2">{getUserName(match.partnerId)}</div>
                  
                  <div className="mb-4">
                    <div className="flex items-center">
                      <div className="w-1/2">
                        <p className="text-xs text-gray-500">YOU OFFER</p>
                        <p className="font-medium">{match.youOffer}</p>
                      </div>
                      <div className="w-1/2">
                        <p className="text-xs text-gray-500">THEY WANT</p>
                        <p className="font-medium">{match.theyWant}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center">
                      <div className="w-1/2">
                        <p className="text-xs text-gray-500">YOU WANT</p>
                        <p className="font-medium">{match.youWant}</p>
                      </div>
                      <div className="w-1/2">
                        <p className="text-xs text-gray-500">THEY OFFER</p>
                        <p className="font-medium">{match.theyOffer}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleSelectMatch(match)}
                    className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    Request Swap
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Optional: Show existing swaps in progress */}
      <div className="mt-8 text-center">
        <Link 
          to="/swaps"
          className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
        >
          View My Active Swaps
        </Link>
      </div>
    </div>
  );
};

export default Matches;