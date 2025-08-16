import React, { useState, useEffect } from 'react';
import { FaRegUser, FaShoppingBag, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CartButton } from './cart';
import LanguageSelector from './LanguageSelector';
import LoginModal from './LoginModal';

interface UserData {
  fullname: string;
  email: string;
  userProfilePicture: string;
  contactInfo: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface PhoneLoginRequest {
  phone: string;
  otp: string;
}

type LoginCredentials = LoginRequest | PhoneLoginRequest;

const UserProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log('🔍 UserProfile: useEffect running, checking login status...');
    // Check if user is already logged in
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('userLoggedIn');
      console.log('🔍 UserProfile: localStorage loginStatus =', loginStatus);
      if (loginStatus === 'true') {
        console.log('🔍 UserProfile: User is logged in, fetching details...');
        fetchUserDetails();
      } else {
        console.log('🔍 UserProfile: User is not logged in, setting loading to false');
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const fetchUserDetails = async () => {
    console.log('🔍 UserProfile: fetchUserDetails called...');
    try {
      console.log('🔍 UserProfile: Making API call to /api/user/getUserDetails...');
      const response = await fetch('/api/user/getUserDetails');
      console.log('🔍 UserProfile: getUserDetails API response status:', response.status);
      console.log('🔍 UserProfile: getUserDetails API response ok:', response.ok);
      console.log('🔍 UserProfile: getUserDetails API response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        // Check content type to handle both JSON and text responses
        const contentType = response.headers.get('content-type');
        console.log('🔍 UserProfile: Response content-type:', contentType);
        
        let data;
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
          console.log('🔍 UserProfile: getUserDetails API response data (JSON):', data);
        } else {
          data = await response.text();
          console.log('🔍 UserProfile: getUserDetails API response data (Text):', data);
        }
        
        setUserData(data);
        setIsLoggedIn(true);
        setLoading(false);
        console.log('🔍 UserProfile: User details set successfully');
      } else {
        const errorData = await response.text();
        console.error('❌ UserProfile: getUserDetails API error response:', errorData);
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('❌ UserProfile: Error fetching user details:', error);
      setIsLoggedIn(false);
      setLoading(false);
    }
  };

  const handleLogin = async (credentials: LoginCredentials) => {
    console.log('🔍 UserProfile: handleLogin called with credentials:', credentials);
    
    try {
      let response;
      
      // Handle different login types
      if ('email' in credentials) {
        // Email login
        console.log('🔍 UserProfile: Making email login API call to /public/login...');
        console.log('🔍 UserProfile: Email login request body:', { ...credentials, password: '***' });
        
        response = await fetch('/public/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
      } else {
        // Phone login
        console.log('🔍 UserProfile: Making phone login API call to /public/loginM...');
        console.log('🔍 UserProfile: Phone login request body:', { ...credentials, otp: '***' });
        
        response = await fetch('/public/loginM', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
      }

      console.log('🔍 UserProfile: Login API response status:', response.status);
      console.log('🔍 UserProfile: Login API response ok:', response.ok);
      console.log('🔍 UserProfile: Login API response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        // Check content type to handle both JSON and text responses
        const contentType = response.headers.get('content-type');
        console.log('🔍 UserProfile: Response content-type:', contentType);
        
        let responseData;
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
          console.log('🔍 UserProfile: Login API response data (JSON):', responseData);
        } else {
          responseData = await response.text();
          console.log('🔍 UserProfile: Login API response data (Text):', responseData);
        }
        
        console.log('🔍 UserProfile: Login successful!');
        
        // Login successful
        localStorage.setItem('userLoggedIn', 'true');
        console.log('🔍 UserProfile: localStorage updated with userLoggedIn = true');
        setShowLogin(false);
        console.log('🔍 UserProfile: Login modal closed');
        
        // Fetch user details and show profile
        console.log('🔍 UserProfile: Fetching user details after login...');
        await fetchUserDetails();
        
        // Redirect to home page
        console.log('🔍 UserProfile: Redirecting to home page...');
        navigate('/');
      } else {
        const errorData = await response.text();
        console.error('❌ UserProfile: Login API error response:', errorData);
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('❌ UserProfile: Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    console.log('🔍 UserProfile: handleLogout called...');
    localStorage.removeItem('userLoggedIn');
    setIsLoggedIn(false);
    setUserData(null);
    setShowDropdown(false);
    
    // Instead of redirecting, show login modal
    console.log('🔍 UserProfile: Showing login modal after logout');
    setShowLogin(true);
    
    console.log('🔍 UserProfile: Logout completed');
  };

  const toggleDropdown = () => {
    console.log('🔍 UserProfile: toggleDropdown called, current state:', showDropdown);
    setShowDropdown(!showDropdown);
  };

  const handleLoginButtonClick = () => {
    console.log('🔍 UserProfile: Login button clicked!');
    console.log('🔍 UserProfile: Current showLogin state:', showLogin);
    setShowLogin(true);
    console.log('🔍 UserProfile: showLogin set to true');
  };

  if (loading) {
    console.log('🔍 UserProfile: Rendering loading state...');
    return (
      <div className="flex items-center justify-center cursor-pointer sm:hover:bg-gray-50 max-w-[80px] lg:max-w-[100px] w-full">
        <div className="animate-pulse bg-gray-300 rounded-full w-8 h-8"></div>
      </div>
    );
  }

  // Show login button if not logged in
  if (!isLoggedIn || !userData) {
    console.log('🔍 UserProfile: Rendering login button state...');
    console.log('🔍 UserProfile: isLoggedIn =', isLoggedIn);
    console.log('🔍 UserProfile: userData =', userData);
    return (
      <>
        <div
          className="flex items-center _header_login justify-center cursor-pointer sm:hover:bg-gray-50 max-w-[80px] lg:max-w-[100px] w-full"
          onClick={handleLoginButtonClick}
        >
          <span className="font-medium _text-default hidden sm:block">
            {t('login')}
          </span>
          <span className="sm:hidden _text-default">
            <FaRegUser size={22} />
          </span>
        </div>

        {/* Login Modal - Always render when showLogin is true */}
        <LoginModal 
          isOpen={showLogin} 
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      </>
    );
  }

  // Show user profile if logged in
  console.log('🔍 UserProfile: Rendering user profile state...');
  return (
    <>
      <div className="relative">
        <div
          className="flex items-center gap-2 cursor-pointer sm:hover:bg-gray-50 p-2 rounded-lg"
          onClick={toggleDropdown}
        >
          <img
            src={userData.userProfilePicture}
            alt={userData.fullname}
            className="w-14 h-14 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
            {userData.fullname.charAt(0)}
          </div>
          {/* <span className="font-medium _text-default hidden lg:block">
            {userData.fullname}
          </span> */}
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              showDropdown ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[280px]">
            {/* User Info */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200 mb-3">
              <img
                src={userData.userProfilePicture}
                alt={userData.fullname}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-semibold">
                {userData.fullname.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{userData.fullname}</h4>
                <p className="text-sm text-gray-600">{userData.email}</p>
                <p className="text-xs text-gray-500">{userData.contactInfo}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <Link
                to="/orders"
                className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                <FaShoppingBag className="text-blue-600" size={18} />
                <span className="font-medium _text-default text-sm">
                  {t('myOrders')}
                </span>
              </Link>


              <div className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                <LanguageSelector />
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors text-red-600"
              >
                <FaSignOutAlt size={18} />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Login Modal - Also render here for logged-in users if needed */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onLogin={handleLogin}
      />
    </>
  );
};

export default UserProfile;
