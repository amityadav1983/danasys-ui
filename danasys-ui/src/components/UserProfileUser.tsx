import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingBag,
  FaMapMarkerAlt,
  FaUserEdit,
  FaKey,
  FaUserFriends,
  FaUsers,
  FaBuilding,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { show as showModal } from "../store/modal";
import { setMode } from "../store/mode";

interface UserProfileUserProps {
  setShowDropdown: (show: boolean) => void;
  userData: {
    userWalletImage?: string;
  };
}

const UserProfileUser: React.FC<UserProfileUserProps> = ({
  setShowDropdown,
  userData,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <>
      <div
        className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => {
          setShowDropdown(false);
          dispatch(showModal({ type: "updateAddress" }));
        }}
      >
        <FaMapMarkerAlt className="text-purple-600" size={18} />
        <span className="text-sm font-medium text-gray-700">
          Update Address
        </span>
      </div>

      <div
        className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => {
          setShowDropdown(false);
          dispatch(showModal({ type: "updateProfile" }));
        }}
      >
        <FaUserEdit className="text-green-600" size={18} />
        <span className="text-sm font-medium text-gray-700">
          Update Profile
        </span>
      </div>

      {/* ✅ My References */}
      <div
        className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => {
          setShowDropdown(false);
          dispatch(showModal({ type: "myReferences" }));
        }}
      >
        <FaUserFriends className="text-pink-600" size={18} />
        <span className="text-sm font-medium text-gray-700">
          My References
        </span>
      </div>

      {/* ✅ My Connections */}
      <div
        className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => {
          setShowDropdown(false);
          navigate('/my-connections');
        }}
      >
        <FaUsers className="text-indigo-600" size={18} />
        <span className="text-sm font-medium text-gray-700">
          My Connections
        </span>
      </div>

      <div
        className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => {
          setShowDropdown(false);
          dispatch(showModal({ type: "updatePassword" }));
        }}
      >
        <FaKey className="text-orange-600" size={18} />
        <span className="text-sm font-medium text-gray-700">
          Update Password
        </span>
      </div>

      <div 
        className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => {
          setShowDropdown(false);
          navigate('/orders');
        }}
      >
        <FaShoppingBag className="text-blue-600" size={18} />
        <span className="text-sm font-medium text-gray-700">
          {t("myOrders")}
        </span>
      </div>

      {/* Mobile only */}
      <div className="sm:hidden space-y-2">
        {/* <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
          <DeliveryToggle />
        </div> */}
        {userData.userWalletImage && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <img
              src={userData.userWalletImage}
              alt="Wallet"
              className="w-6 h-6 object-contain"
            />
            <span className="text-sm font-medium text-gray-700">
              My Wallet
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfileUser;
