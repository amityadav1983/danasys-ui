import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRegUser,
  FaSignOutAlt,
  FaBuilding,
  FaExchangeAlt,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import LoginModal from "./LoginModal";
import UserProfileUser from "./UserProfileUser";
import UserProfileBusiness from "./UserProfileBusiness";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { setMode } from "../store/mode";

declare global {
  interface Window {
    Razorpay: any;
  }
}



interface UserData {
  fullname: string;
  email: string;
  userProfilePicture: string;
  contactInfo: string;
  userWalletImage?: string;
  userWalletBalance?: number;
}

const UserProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useAppDispatch();
  const currentMode = useAppSelector((state) => state.mode.currentMode);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [showBusinessPopup, setShowBusinessPopup] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);

  useEffect(() => {
    const loginStatus = localStorage.getItem("userLoggedIn");
    if (loginStatus === "true") {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showBusinessPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showBusinessPopup]);

  // outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showBusinessPopup) return;
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, showBusinessPopup]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch("/api/user/getUserDetails");
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
    localStorage.removeItem("userLoggedIn");
    setIsLoggedIn(false);
    setUserData(null);
    setShowDropdown(false);
    setShowLogin(true);
  };

  const handleSwitchToBusiness = async () => {
    if (isSwitching) return;
    setIsSwitching(true);
    try {
      const response = await fetch("/api/user/getUserDetails");
      if (!response.ok) throw new Error('Failed to fetch user details');
      const data = await response.json();
      const { roles, businessUserOneTimePayment } = data;
      const hasBusinessRole = roles.includes('ROLE_BUSINESS_USER') || roles.includes('ROLE_BUSINESS_USER_MGR');
      if (hasBusinessRole) {
        dispatch(setMode('business'));
        setShowDropdown(false);
        navigate('/business');
      } else if (roles.length === 1 && roles[0] === 'ROLE_USER' && businessUserOneTimePayment && businessUserOneTimePayment > 0) {
        setPaymentAmount(businessUserOneTimePayment);
        setShowBusinessPopup(true);
      } else {
        dispatch(setMode('business'));
        setShowDropdown(false);
        navigate('/business');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSwitching(false);
    }
  };

  const initiatePayment = async (amount: number) => {
    try {
      const createRes = await fetch(`/api/order/create-order?amount=${amount}`, {
        method: 'POST',
        headers: { accept: '*/*' },
      });
      if (!createRes.ok) throw new Error('Failed to create order');
      const orderData = await createRes.json();
      const options: any = {
        key: 'rzp_test_9djW8eAXNxoCGF', // Replace with your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Your Company',
        description: 'Payment for business mode',
        order_id: orderData.id,
        handler: function (response: any) {
          console.log('Payment successful:', response);
          dispatch(setMode('business'));
          setShowDropdown(false);
          navigate('/business');
        },
        prefill: {
          name: userData?.fullname || 'User',
          email: userData?.email || '',
        },
        theme: { color: '#0c30fe' },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
      rzp1.on('payment.failed', (response: any) => {
        console.error('Payment Failed:', response.error);
      });
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
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
            {t("login")}
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
      <div className="relative" ref={dropdownRef}>
        {/* Profile Button */}
        <div
          className="flex items-center gap-2 cursor-pointer sm:hover:bg-gray-50 p-2 rounded-lg"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img
            src={userData.userProfilePicture}
            alt={userData.fullname}
            className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
          />
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-full right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-visible animate-fadeIn">
            {/* User Info */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
              <img
                src={userData.userProfilePicture}
                alt={userData.fullname}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-sm">
                  {userData.fullname}
                </h4>
                <p className="text-xs text-gray-600 truncate">{userData.email}</p>
                <p className="text-xs text-gray-500">{userData.contactInfo}</p>
              </div>
            </div>

            {/* Menu Options */}
            <div className="p-2 space-y-1">
              {currentMode === 'user' && <UserProfileUser setShowDropdown={setShowDropdown} userData={userData} />}

              {/* Wallet for business mode on mobile */}
              {currentMode === 'business' && userData?.userWalletImage && window.innerWidth < 768 && (
                <div className="flex items-center gap-3 w-full px-3 py-2 rounded-xl bg-gray-50">
                  <img
                    src={userData.userWalletImage}
                    alt="Wallet"
                    className="w-6 h-6 object-contain"
                  />
                  <span className="font-medium text-sm text-gray-700">₹{userData?.userWalletBalance}</span>
                </div>
              )}

              {/* ✅ Language Selector */}
              <div className="relative">
                <LanguageSelector />
              </div>

              {/* Mode Switch Button */}
              {currentMode === 'user' ? (
                <button
                  onClick={handleSwitchToBusiness}
                  disabled={isSwitching}
                  className={`flex items-center gap-3 w-full px-3 py-2 text-left rounded-xl transition-colors ${
                    isSwitching
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'hover:bg-blue-50 text-blue-600'
                  }`}
                >
                  <FaBuilding size={18} />
                  <span className="font-medium text-sm">
                    {isSwitching ? 'Switching...' : 'Switch to Business'}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    dispatch(setMode('user'));
                    setShowDropdown(false);
                    navigate('/');
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left rounded-xl hover:bg-green-50 transition-colors text-green-600"
                >
                  <FaExchangeAlt size={18} />
                  <span className="font-medium text-sm">Switch to User</span>
                </button>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2 text-left rounded-xl hover:bg-red-50 transition-colors text-red-600"
              >
                <FaSignOutAlt size={18} />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Business Popup */}
      {showBusinessPopup && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 hover:scale-[1.02]">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3 text-center">
        👋 Hello {userData?.fullname},
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
        We’re excited to help you create your business profile.
      </p>
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-5 border border-gray-100 dark:border-gray-700">
        <p className="text-gray-700 dark:text-gray-200 text-center">
          A one-time fee of <span className="font-semibold text-green-600">₹{paymentAmount}</span> (non-refundable)
          will be charged to complete all required background activities.
        </p>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
        Would you like to proceed with the setup?
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            setShowBusinessPopup(false);
            initiatePayment(paymentAmount!);
          }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.03] focus:ring-2 focus:ring-green-400"
        >
          ✅ Yes, Proceed
        </button>
        <button
          onClick={() => setShowBusinessPopup(false)}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.03] focus:ring-2 focus:ring-red-400"
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  </div>
)}


      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={() => fetchUserDetails()}
      />

      {currentMode === 'business' && <UserProfileBusiness />}
    </>
  );
};

export default UserProfile;
