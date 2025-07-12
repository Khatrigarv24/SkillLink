import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService, skillService } from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    location: '',
    availability: '',
    profilePhotoUrl: ''
  });
  const [skills, setSkills] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch profile data whenever component mounts or user changes
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // Check if we have a token first
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('No token found in localStorage');
          setIsLoading(false);
          return;
        }
        
        console.log('Fetching profile data...');
        
        // Use the services directly instead of axios
        const profileResponse = await authService.getProfile();
        console.log('Profile data received:', profileResponse.data);
        
        const skillsResponse = await skillService.getUserSkills();
        console.log('Skills data received:', skillsResponse.data);
        
        // Set user profile data
        setUserProfile({
          name: profileResponse.data.name || '',
          email: profileResponse.data.email || '',
          location: profileResponse.data.location || '',
          availability: profileResponse.data.availability || '',
          profilePhotoUrl: profileResponse.data.profilePhotoUrl || ''
        });
        
        // Ensure skills is an array
        setSkills(Array.isArray(skillsResponse.data) ? skillsResponse.data : []);
        
        // Try to fetch ratings if possible
        try {
          const userId = profileResponse.data.id || localStorage.getItem('userId');
          if (userId) {
            const ratingsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/ratings/${userId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setRatings(Array.isArray(ratingsResponse.data) ? ratingsResponse.data : []);
          }
        } catch (ratingError) {
          console.warn('Could not fetch ratings:', ratingError);
          setRatings([]);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data');
        // Initialize with empty arrays on error
        setSkills([]);
        setRatings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []); // Don't depend on user, as it may not be available after a refresh

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({
      ...userProfile,
      [name]: value
    });
  };

  // Update the handleSubmit function with the correct endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await authService.updateProfile({
        name: userProfile.name,
        location: userProfile.location,
        availability: userProfile.availability,
        profilePhotoUrl: userProfile.profilePhotoUrl
      });
      
      toast.success('Profile updated successfully');
      
      // Update local state with the returned data
      if (response.data) {
        setUserProfile(prev => ({
          ...prev,
          ...response.data
        }));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={userProfile.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userProfile.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={userProfile.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="availability">
                    Availability
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={userProfile.availability}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select availability</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Weekends">Weekends</option>
                    <option value="Evenings">Evenings</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profilePhotoUrl">
                    Profile Photo URL
                  </label>
                  <input
                    type="text"
                    id="profilePhotoUrl"
                    name="profilePhotoUrl"
                    value={userProfile.profilePhotoUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:bg-blue-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Profile Summary Section */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                {userProfile.profilePhotoUrl ? (
                  <img 
                    src={userProfile.profilePhotoUrl} 
                    alt={userProfile.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
                    👤
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{userProfile.name}</h2>
                <p className="text-sm text-gray-500">{userProfile.location || 'No location set'}</p>
                <p className="text-sm text-gray-500">
                  Availability: {userProfile.availability || 'Not specified'}
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium mb-2">Your Skills</h3>
              {Array.isArray(skills) && skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span 
                      key={skill.id}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        skill.type === 'offered' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {skill.skillName}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No skills added yet</p>
              )}
              <a 
                href="/skills" 
                className="text-sm text-blue-500 hover:underline block mt-2"
              >
                Manage skills →
              </a>
            </div>
          </div>
          
          {/* Ratings Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-medium mb-3">Your Ratings</h3>
            {ratings.length > 0 ? (
              <div className="space-y-3">
                {ratings.slice(0, 3).map((rating) => (
                  <div key={rating.id} className="border-b pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-yellow-400">
                          {Array.from({ length: rating.rating }).map((_, i) => (
                            <span key={i} className="inline-block">★</span>
                          ))}
                          {Array.from({ length: 5 - rating.rating }).map((_, i) => (
                            <span key={i} className="inline-block text-gray-300">★</span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="text-sm mt-1">{rating.comment}</p>
                    )}
                  </div>
                ))}
                {ratings.length > 3 && (
                  <p className="text-sm text-gray-500 mt-2">
                    +{ratings.length - 3} more ratings
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No ratings yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;