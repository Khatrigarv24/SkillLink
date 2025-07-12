import { useState, useEffect } from 'react';
import { swapService, skillService, userService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Swaps = () => {
  const { user } = useAuth();
  const [swaps, setSwaps] = useState([]);
  const [skills, setSkills] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [newSwap, setNewSwap] = useState({
    receiverId: '',
    offeredSkillId: '',
    wantedSkillId: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Get userId from localStorage or auth context
  const getUserId = () => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) return storedUserId;
    
    // Fallback to auth context
    if (user && user.id) {
      // Store it in localStorage for future use
      localStorage.setItem('userId', user.id);
      return user.id;
    }
    
    return null;
  };

  // Check if userId exists
  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      setError('User ID not found. Please log in again.');
      console.warn('User ID not found in localStorage or auth context');
    } else {
      console.log('Using userId:', userId);
    }
  }, [user]);

  // Fetch all necessary data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get user's swaps
        const swapsResponse = await swapService.getSwaps();
        console.log('Fetched swaps:', swapsResponse.data);
        
        // Get all skills for reference
        const skillsResponse = await skillService.getSkills();
        console.log('Fetched skills:', skillsResponse.data);
        
        // Get user's skills
        const userSkillsResponse = await skillService.getUserSkills();
        console.log('Fetched user skills:', userSkillsResponse.data);
        
        // First, set the data we know exists
        setSwaps(Array.isArray(swapsResponse.data) ? swapsResponse.data : []);
        setSkills(Array.isArray(skillsResponse.data) ? skillsResponse.data : []);
        setUserSkills(Array.isArray(userSkillsResponse.data) ? userSkillsResponse.data : []);
        
        // Then try to get users
        try {
          const usersResponse = await userService.getUsers();
          console.log('Fetched users:', usersResponse.data);
          setUsers(Array.isArray(usersResponse.data) ? usersResponse.data : []);
        } catch (userError) {
          console.error("Error fetching users:", userError);
          // If we can't get all users, we'll need the user info for the swaps
          // Extract user info from swaps for display
          const uniqueUserIds = new Set();
          const extractedUsers = [];
          
          // Extract requester and receiver IDs from swaps
          swapsResponse.data.forEach(swap => {
            if (swap.requesterId && !uniqueUserIds.has(swap.requesterId)) {
              uniqueUserIds.add(swap.requesterId);
              // The name will be filled in later if possible
              extractedUsers.push({ id: swap.requesterId, name: `User ${swap.requesterId.slice(0, 5)}` });
            }
            if (swap.receiverId && !uniqueUserIds.has(swap.receiverId)) {
              uniqueUserIds.add(swap.receiverId);
              extractedUsers.push({ id: swap.receiverId, name: `User ${swap.receiverId.slice(0, 5)}` });
            }
          });
          
          setUsers(extractedUsers);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', err);
        // Initialize with empty arrays on error
        setSwaps([]);
        setSkills([]);
        setUserSkills([]);
        setUsers([]);
      }
    };
    
    fetchData();
  }, []);

  // Find username by ID
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  // Find skill name by ID
  const getSkillName = (skillId) => {
    const skill = skills.find(s => s.id === skillId);
    return skill ? skill.skillName : 'Unknown Skill';
  };

  // Handle input changes for new swap form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSwap(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle swap creation
  const handleCreateSwap = async (e) => {
    e.preventDefault();
    
    try {
      console.log("Creating swap with data:", newSwap);
      
      // Make sure all required fields are filled
      if (!newSwap.receiverId || !newSwap.offeredSkillId || !newSwap.wantedSkillId) {
        setError("All fields are required");
        return;
      }
      
      // Make the API call
      const response = await swapService.createSwap(newSwap);
      console.log("Swap created successfully:", response.data);
      
      // Add the new swap to the swaps list
      setSwaps(prevSwaps => [...prevSwaps, response.data]);
      
      // Reset the form
      setNewSwap({
        receiverId: '',
        offeredSkillId: '',
        wantedSkillId: ''
      });
      
      // Show success message
      setError(null);
      setSuccess("Swap request created successfully!");
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error('Error creating swap:', err);
      setError(err.response?.data?.message || 'Failed to create swap request. Please try again.');
    }
  };

  // Handle updating swap status
  const handleUpdateSwapStatus = async (swapId, newStatus) => {
    try {
      const response = await swapService.updateSwapStatus(swapId, newStatus);
      
      // Update the swap in the list
      setSwaps(swaps.map(swap => 
        swap.id === swapId ? response.data : swap
      ));
      
    } catch (err) {
      setError(`Failed to ${newStatus} swap. Please try again.`);
      console.error('Error updating swap:', err);
    }
  };

  // Filter swaps by those I've requested
  const requestedSwaps = Array.isArray(swaps) ? swaps.filter(swap => 
    getUserId() === swap.requesterId
  ) : [];

  // Filter swaps by those I've received
  const receivedSwaps = Array.isArray(swaps) ? swaps.filter(swap => 
    getUserId() === swap.receiverId
  ) : [];

  // Filter user's offered skills for the dropdown
  const offeredSkills = Array.isArray(userSkills) ? userSkills.filter(skill => skill.type === 'offered') : [];
  
  // Filter user's wanted skills for the dropdown
  const wantedSkills = Array.isArray(userSkills) ? userSkills.filter(skill => skill.type === 'wanted') : [];

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading swaps...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Skill Swaps</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {/* Create new swap request form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Swap Request</h2>
        <form onSubmit={handleCreateSwap}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select User
              </label>
              <select
                name="receiverId"
                value={newSwap.receiverId}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill I Offer
              </label>
              <select
                name="offeredSkillId"
                value={newSwap.offeredSkillId}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select a skill to offer</option>
                {offeredSkills.map(skill => (
                  <option key={skill.id} value={skill.id}>
                    {skill.skillName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill I Want
              </label>
              <select
                name="wantedSkillId"
                value={newSwap.wantedSkillId}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Select a skill you want</option>
                {wantedSkills.map(skill => (
                  <option key={skill.id} value={skill.id}>
                    {skill.skillName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                disabled={!newSwap.receiverId || !newSwap.offeredSkillId || !newSwap.wantedSkillId}
              >
                Create Swap Request
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* My Requested Swaps */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">My Requested Swaps</h2>
        
        {requestedSwaps.length === 0 ? (
          <p className="text-gray-500">You haven't requested any swaps yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    I Offer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    I Want
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requestedSwaps.map(swap => (
                  <tr key={swap.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getUserName(swap.receiverId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSkillName(swap.offeredSkillId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSkillName(swap.wantedSkillId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        swap.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                        swap.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Received Swap Requests */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Received Swap Requests</h2>
        
        {receivedSwaps.length === 0 ? (
          <p className="text-gray-500">You haven't received any swap requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    They Offer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    They Want
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {receivedSwaps.map(swap => (
                  <tr key={swap.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getUserName(swap.requesterId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSkillName(swap.offeredSkillId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSkillName(swap.wantedSkillId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        swap.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                        swap.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {swap.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateSwapStatus(swap.id, 'accepted')}
                            className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 text-xs"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateSwapStatus(swap.id, 'rejected')}
                            className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {swap.status === 'accepted' && (
                        <button
                          onClick={() => handleUpdateSwapStatus(swap.id, 'completed')}
                          className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 text-xs"
                        >
                          Mark Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Swaps;