import React, { useState, useEffect } from 'react';
import { skillService } from '../../services/api';

const SkillUsersList = ({ skillId, type }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await skillService.getUsersBySkill(skillId, type);
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error loading users by skill:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (skillId) loadUsers();
  }, [skillId, type]);
  
  if (loading) return <div>Loading users...</div>;
  
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Users with this skill</h3>
      {users.length === 0 ? (
        <p className="text-gray-500">No users found with this skill.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user, index) => (
            <li key={user.userId || index} className="p-3 bg-gray-50 rounded-md">
              {user.userName || 'Anonymous User'} - {user.skillType || type}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SkillUsersList;