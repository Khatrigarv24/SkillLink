import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { skillService } from '../services/api';
import SkillUsersList from '../components/skills/SkillUsersList';

const SkillDetails = () => {
  const { skillId } = useParams();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSkillDetails = async () => {
      try {
        setLoading(true);
        
        // First get all skills
        const response = await skillService.getSkills();
        const skills = Array.isArray(response.data) ? response.data : [];
        
        // Find the specific skill by ID
        const foundSkill = skills.find(s => s.id === skillId);
        
        if (foundSkill) {
          setSkill(foundSkill);
        } else {
          setError('Skill not found');
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load skill details');
        setLoading(false);
        console.error('Error fetching skill details:', err);
      }
    };
    
    if (skillId) {
      fetchSkillDetails();
    }
  }, [skillId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !skill) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p className="text-red-600">{error || 'Skill not found'}</p>
        </div>
        <Link 
          to="/skills" 
          className="text-blue-600 hover:underline flex items-center"
        >
          ← Back to Skills
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link 
          to="/skills" 
          className="text-blue-600 hover:underline flex items-center"
        >
          ← Back to Skills
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">{skill.skillName}</h1>
        
        <div className="mb-4">
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
            skill.type === 'offered' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {skill.type === 'offered' ? 'Offered' : 'Wanted'}
          </span>
        </div>
        
        {skill.description && (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Description</h2>
            <p className="text-gray-700">{skill.description}</p>
          </div>
        )}
        
        {/* Users with this skill */}
        <SkillUsersList skillId={skillId} type={skill.type} />
      </div>
    </div>
  );
};

export default SkillDetails;