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



interface UserData {
  fullname: string;
  email: string;
  userProfilePicture: string;
  contactInfo: string;
  userWalletImage?: string;
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

  useEffect(() => {
    const loginStatus = localStorage.getItem("userLoggedIn");
    if (loginStatus === "true") {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, []);

  // outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
  }, [showDropdown]);

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

              {/* ✅ Language Selector */}
              <div className="relative">
                <LanguageSelector />
              </div>

              {/* Mode Switch Button */}
              {currentMode === 'user' ? (
                <button
                  onClick={() => {
                    dispatch(setMode('business'));
                    setShowDropdown(false);
                    navigate('/');
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left rounded-xl hover:bg-blue-50 transition-colors text-blue-600"
                >
                  <FaBuilding size={18} />
                  <span className="font-medium text-sm">Switch to Business</span>
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
