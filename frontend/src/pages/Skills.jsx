import { useState, useEffect } from 'react';
import { skillService } from '../services/api';
import { Link } from 'react-router-dom';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    skillName: '',
    description: '',
    type: 'offered' // Default to offered
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all skills and user's skills on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get all skills using your service
        const allSkillsResponse = await skillService.getSkills();
        
        // Get user's skills using your service
        const userSkillsResponse = await skillService.getUserSkills();
        
        // Ensure we're always working with arrays
        setSkills(Array.isArray(allSkillsResponse.data) ? allSkillsResponse.data : []);
        setUserSkills(Array.isArray(userSkillsResponse.data) ? userSkillsResponse.data : []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load skills. Please try again later.');
        setLoading(false);
        console.error('Error fetching skills:', err);
        // Initialize with empty arrays on error
        setSkills([]);
        setUserSkills([]);
      }
    };
    
    fetchData();
  }, []);

  // Add this function to your Skills component:
  const fetchUsersBySkill = async (skillId, type) => {
    try {
      const response = await skillService.getUsersBySkill(skillId, type);
      return response.data;
    } catch (err) {
      console.error('Error fetching users by skill:', err);
      return [];
    }
  };

  // Handle input changes for new skill form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSkill(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle skill creation
  const handleCreateSkill = async (e) => {
    e.preventDefault();
    
    try {
      const response = await skillService.createSkill(newSkill);
      
      // Add the new skill to the user's skills list
      setUserSkills([...userSkills, response.data]);
      
      // Reset the form
      setNewSkill({
        skillName: '',
        description: '',
        type: 'offered'
      });
      
    } catch (err) {
      setError('Failed to create skill. Please try again.');
      console.error('Error creating skill:', err);
    }
  };

  // Handle skill deletion
  const handleDeleteSkill = async (skillId) => {
    try {
      await skillService.deleteSkill(skillId);
      
      // Remove deleted skill from list
      setUserSkills(userSkills.filter(skill => skill.id !== skillId));
      
    } catch (err) {
      setError('Failed to delete skill. Please try again.');
      console.error('Error deleting skill:', err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading skills...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Skills Marketplace</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Add new skill form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add a New Skill</h2>
        <form onSubmit={handleCreateSkill}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Name
              </label>
              <input
                type="text"
                name="skillName"
                value={newSkill.skillName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                name="type"
                value={newSkill.type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="offered">Skill I can offer</option>
                <option value="wanted">Skill I want to learn</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={newSkill.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                rows="3"
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Add Skill
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* My skills section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">My Skills</h2>
        
        {!userSkills || userSkills.length === 0 ? (
          <p className="text-gray-500">You haven't added any skills yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Skills I Offer</h3>
              <ul className="space-y-2">
                {Array.isArray(userSkills) && userSkills
                  .filter(skill => skill.type === 'offered')
                  .map(skill => (
                    <li 
                      key={skill.id} 
                      className="flex justify-between items-center bg-gray-50 p-3 rounded"
                    >
                      <div>
                        <p className="font-medium">{skill.skillName}</p>
                        {skill.description && (
                          <p className="text-sm text-gray-600">{skill.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Skills I Want to Learn</h3>
              <ul className="space-y-2">
                {Array.isArray(userSkills) && userSkills
                  .filter(skill => skill.type === 'wanted')
                  .map(skill => (
                    <li 
                      key={skill.id} 
                      className="flex justify-between items-center bg-gray-50 p-3 rounded"
                    >
                      <div>
                        <p className="font-medium">{skill.skillName}</p>
                        {skill.description && (
                          <p className="text-sm text-gray-600">{skill.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      
      {/* Skills marketplace */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Skills Marketplace</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skill
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {skills.map(skill => (
                <tr key={skill.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/skills/${skill.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {skill.skillName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      skill.type === 'offered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {skill.type === 'offered' ? 'Offered' : 'Wanted'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {skill.description || 'No description provided'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Skills;