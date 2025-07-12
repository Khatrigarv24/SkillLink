import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for token and load user on mount
  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Get user profile using token
          const response = await authService.getProfile();
          
          // Create user object with token
          const userData = {
            ...response.data,
            token
          };
          
          // Store user ID in localStorage if not already there
          if (userData.id) {
            localStorage.setItem('userId', userData.id);
          }
          
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user from token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        }
      }
      setLoading(false);
    };

    loadUserFromToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      
      const userData = response.data;
      localStorage.setItem('token', userData.token);
      
      // Make sure we're getting the correct property name for the user ID
      // and handle both formats (id or userId)
      if (userData.id) {
        localStorage.setItem('userId', userData.id);
        console.log('Stored userId in localStorage:', userData.id);
      } else if (userData.userId) {
        localStorage.setItem('userId', userData.userId);
        console.log('Stored userId in localStorage:', userData.userId);
      } else if (userData.user && userData.user.id) {
        localStorage.setItem('userId', userData.user.id);
        console.log('Stored userId from user object:', userData.user.id);
      }
      
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);
      localStorage.setItem('token', response.data.token);
      
      // Also store userId
      const user = response.data.user || response.data;
      if (user.id) {
        localStorage.setItem('userId', user.id);
        console.log('Stored userId in localStorage during signup:', user.id);
      }
      
      setUser(response.data.user || response.data);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      setUser(response.data);
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);