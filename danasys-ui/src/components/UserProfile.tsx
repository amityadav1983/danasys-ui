import React, { useState, useEffect } from 'react';
import { FaRegUser, FaShoppingBag, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import LoginModal from './LoginModal';
import DeliveryToggle from './DeliveryToggle';

interface UserData {
  fullname: string;
  email: string;
  userProfilePicture: string;
  contactInfo: string;
  userWalletImage?: string;
}

const UserProfile = () => {
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem('userLoggedIn');
    if (loginStatus === 'true') {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch('/api/user/getUserDetails');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    setIsLoggedIn(false);
    setUserData(null);
    setShowDropdown(false);
    setShowLogin(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center cursor-pointer sm:hover:bg-gray-50 max-w-[80px] lg:max-w-[100px] w-full">
        <div className="animate-pulse bg-gray-300 rounded-full w-8 h-8"></div>
      </div>
    );
  }

  if (!isLoggedIn || !userData) {
    return (
      <>
        <div
          className="flex items-center _header_login justify-center cursor-pointer sm:hover:bg-gray-50 max-w-[80px] lg:max-w-[100px] w-full"
          onClick={() => setShowLogin(true)}
        >
          <span className="font-medium _text-default hidden sm:block">
            {t('login')}
          </span>
          <span className="sm:hidden _text-default">
            <FaRegUser size={22} />
          </span>
        </div>

        <LoginModal 
          isOpen={showLogin} 
          onClose={() => setShowLogin(false)}
          onLogin={() => fetchUserDetails()}
        />
      </>
    );
  }

  return (
    <>
      <div className="relative">
        <div
          className="flex items-center gap-2 cursor-pointer sm:hover:bg-gray-50 p-2 rounded-lg"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img
            src={userData.userProfilePicture}
            alt={userData.fullname}
            className="w-10 h-10 rounded-full object-cover"
          />
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

        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[280px]">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200 mb-3">
              <img
                src={userData.userProfilePicture}
                alt={userData.fullname}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{userData.fullname}</h4>
                <p className="text-sm text-gray-600">{userData.email}</p>
                <p className="text-xs text-gray-500">{userData.contactInfo}</p>
              </div>
            </div>

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

              {/* ✅ Mobile only - Delivery Toggle & Wallet */}
              <div className="sm:hidden space-y-2">
                <div className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <DeliveryToggle />
                </div>

                {userData.userWalletImage && (
                  <div className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <img
                      src={userData.userWalletImage}
                      alt="Wallet"
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-sm font-medium">My Wallet</span>
                  </div>
                )}
              </div>

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

      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        onLogin={() => fetchUserDetails()}
      />
    </>
  );
};

export default UserProfile;
