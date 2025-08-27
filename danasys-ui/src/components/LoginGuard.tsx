import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal';

interface LoginGuardProps {
  children: React.ReactNode;
}

interface UserData {
  fullname: string;
  email: string;
  userProfilePicture: string;
  contactInfo: string;
}

const LoginGuard: React.FC<LoginGuardProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // console.log('🔍 LoginGuard: Checking authentication status...');
    const checkAuthStatus = () => {
      const loginStatus = localStorage.getItem('userLoggedIn');
      // console.log('🔍 LoginGuard: localStorage loginStatus =', loginStatus);
      
      if (loginStatus === 'true') {
        // console.log('🔍 LoginGuard: User is logged in, fetching details...');
        fetchUserDetails();
      } else {
        // console.log('🔍 LoginGuard: User is not logged in, showing login form');
        setIsLoggedIn(false);
        setLoading(false);
        setShowLogin(true);
      }
    };

    checkAuthStatus();
  }, []);

  const fetchUserDetails = async () => {
    try {
      // console.log('🔍 LoginGuard: Making API call to /api/user/getUserDetails...');
      const response = await fetch('/api/user/getUserDetails');
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
        
        // console.log('🔍 LoginGuard: User details fetched successfully:', data);
        setUserData(data);
        setIsLoggedIn(true);
        setShowLogin(false);
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      // console.error('❌ LoginGuard: Error fetching user details:', error);
      setIsLoggedIn(false);
      setShowLogin(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials: any) => {
    // console.log('🔍 LoginGuard: Login attempt with credentials:', credentials);
    
    try {
      let response;
      
      if ('email' in credentials) {
        // Email login
        response = await fetch('/public/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
      } else {
        // Phone login
        response = await fetch('/public/loginM', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
      }

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        let responseData;
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
        
        // console.log('🔍 LoginGuard: Login successful!');
        localStorage.setItem('userLoggedIn', 'true');
        
        // Fetch user details and show home page
        await fetchUserDetails();
      } else {
        const errorData = await response.text();
        throw new Error(`Login failed: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      // console.error('❌ LoginGuard: Login error:', error);
      alert(`Login failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    }
  };

  const handleLogout = () => {
    // console.log('🔍 LoginGuard: Logout called');
    localStorage.removeItem('userLoggedIn');
    setIsLoggedIn(false);
    setUserData(null);
    setShowLogin(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, show only login form
  if (!isLoggedIn || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <img 
              src="/logo-removebg-preview.png" 
              alt="Logo" 
              className="w-32 h-32 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to QuickCart</h1>
            <p className="text-gray-600">Please login to continue</p>
          </div>
          
          <LoginModal 
            isOpen={showLogin} 
            onClose={() => {}} // Prevent closing
            onLogin={handleLogin}
          />
        </div>
      </div>
    );
  }

  // If logged in, show the actual app content with normal UserProfile
  return (
    <div>
      {/* Main app content - UserProfile will handle the logout functionality */}
      {children}
    </div>
  );
};

export default LoginGuard;
