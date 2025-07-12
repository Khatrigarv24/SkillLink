import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService, skillService } from '../services/api';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon, 
  CameraIcon, 
  MapPinIcon, 
  ClockIcon,
  StarIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    location: '',
    availability: '',
    profilePhotoUrl: ''
  });
  const [skills, setSkills] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please log in to view your profile');
          setIsLoading(false);
          return;
        }

        // Fetch profile data using the existing service
        const profileResponse = await authService.getProfile();
        const skillsResponse = await skillService.getUserSkills();
        
        setUserProfile({
          name: profileResponse.data.name || '',
          email: profileResponse.data.email || '',
          location: profileResponse.data.location || '',
          availability: profileResponse.data.availability || '',
          profilePhotoUrl: profileResponse.data.profilePhotoUrl || ''
        });
        
        setSkills(Array.isArray(skillsResponse.data) ? skillsResponse.data : []);
        
        // Try to fetch ratings if available
        try {
          const userId = profileResponse.data.id || localStorage.getItem('userId');
          if (userId) {
            // Assuming there's a ratings endpoint - adjust as needed
            setRatings([]);
          }
        } catch (ratingError) {
          console.warn('Could not fetch ratings:', ratingError);
          setRatings([]);
        }
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data');
        setSkills([]);
        setRatings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!userProfile.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (userProfile.profilePhotoUrl && !isValidUrl(userProfile.profilePhotoUrl)) {
      newErrors.profilePhotoUrl = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await authService.updateProfile({
        name: userProfile.name,
        location: userProfile.location,
        availability: userProfile.availability,
        profilePhotoUrl: userProfile.profilePhotoUrl
      });
      
      toast.success('Profile updated successfully!');
      
      if (response.data) {
        setUserProfile(prev => ({
          ...prev,
          ...response.data
        }));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProfileCompleteness = () => {
    const fields = ['name', 'location', 'availability', 'profilePhotoUrl'];
    const completed = fields.filter(field => userProfile[field]?.trim()).length;
    const skillsAdded = skills.length > 0 ? 1 : 0;
    return Math.round(((completed + skillsAdded) / (fields.length + 1)) * 100);
  };

  const offeredSkills = skills.filter(skill => skill.type === 'offered');
  const wantedSkills = skills.filter(skill => skill.type === 'wanted');
  const completeness = getProfileCompleteness();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-5rem)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600">Manage your personal information and skills</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Profile Photo Section */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-white overflow-hidden ring-4 ring-white/20">
                      {userProfile.profilePhotoUrl ? (
                        <img 
                          src={userProfile.profilePhotoUrl} 
                          alt={userProfile.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center text-gray-400 text-3xl ${userProfile.profilePhotoUrl ? 'hidden' : 'flex'}`}>
                        <UserCircleIcon className="w-16 h-16 text-indigo-300" />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-indigo-600 rounded-full p-2">
                      <CameraIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-white mt-4">{userProfile.name || 'Your Name'}</h2>
                  <p className="text-indigo-100 text-sm">{userProfile.email}</p>
                </div>
              </div>

              {/* Profile Info */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    {userProfile.location || 'Location not set'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    {userProfile.availability || 'Availability not set'}
                  </div>
                </div>

                {/* Profile Completeness */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
                    <span className="text-sm text-gray-500">{completeness}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completeness}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-2 rounded-full ${
                        completeness >= 80 ? 'bg-green-500' : 
                        completeness >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Skills Summary */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-medium text-gray-900 mb-3">Skills Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{offeredSkills.length}</div>
                      <div className="text-xs text-gray-500">Offered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{wantedSkills.length}</div>
                      <div className="text-xs text-gray-500">Wanted</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'profile', name: 'Profile Information', icon: UserCircleIcon },
                    { id: 'skills', name: 'Skills', icon: AcademicCapIcon },
                    { id: 'ratings', name: 'Ratings', icon: StarIcon }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={userProfile.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="Enter your full name"
                            required
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                              {errors.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={userProfile.email}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                            disabled
                          />
                          <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            value={userProfile.location}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                            placeholder="City, Country"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Availability
                          </label>
                          <select
                            name="availability"
                            value={userProfile.availability}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                          >
                            <option value="">Select availability</option>
                            <option value="Weekdays">Weekdays</option>
                            <option value="Weekends">Weekends</option>
                            <option value="Evenings">Evenings</option>
                            <option value="Flexible">Flexible</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Photo URL
                          </label>
                          <input
                            type="url"
                            name="profilePhotoUrl"
                            value={userProfile.profilePhotoUrl}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                              errors.profilePhotoUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="https://example.com/your-photo.jpg"
                          />
                          {errors.profilePhotoUrl && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                              {errors.profilePhotoUrl}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <div className="flex items-center text-sm text-gray-500">
                          <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                          All changes are saved automatically
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                              />
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === 'skills' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold">Your Skills</h2>
                      <a
                        href="/skills"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <AcademicCapIcon className="w-4 h-4 mr-2" />
                        Manage Skills
                      </a>
                    </div>

                    {skills.length === 0 ? (
                      <div className="text-center py-12">
                        <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No skills added yet</h3>
                        <p className="text-gray-500 mb-6">Start building your profile by adding skills you can offer or want to learn.</p>
                        <a
                          href="/skills"
                          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Add Your First Skill
                        </a>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            Skills You Offer ({offeredSkills.length})
                          </h3>
                          <div className="space-y-3">
                            {offeredSkills.map((skill) => (
                              <div key={skill.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-medium text-green-800">{skill.skillName}</h4>
                                {skill.description && (
                                  <p className="text-sm text-green-600 mt-1">{skill.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                            Skills You Want ({wantedSkills.length})
                          </h3>
                          <div className="space-y-3">
                            {wantedSkills.map((skill) => (
                              <div key={skill.id} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <h4 className="font-medium text-purple-800">{skill.skillName}</h4>
                                {skill.description && (
                                  <p className="text-sm text-purple-600 mt-1">{skill.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'ratings' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold mb-6">Your Ratings & Reviews</h2>
                    {ratings.length === 0 ? (
                      <div className="text-center py-12">
                        <StarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No ratings yet</h3>
                        <p className="text-gray-500">Complete some skill swaps to start receiving ratings from other users.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {ratings.map((rating) => (
                          <div key={rating.id} className="bg-gray-50 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <div className="flex text-yellow-400">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`w-5 h-5 ${
                                        i < rating.rating ? 'fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="font-medium text-gray-900">{rating.rating}/5</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(rating.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {rating.comment && (
                              <p className="text-gray-700">{rating.comment}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;