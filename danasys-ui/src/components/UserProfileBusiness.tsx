import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { setMode } from "../store/mode";

const UserProfileBusiness: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentMode = useAppSelector((state) => state.mode.currentMode);

  const handleSwitchToUser = () => {
    dispatch(setMode('user'));
    navigate('/');
  };

  const handleSwitchToBusiness = () => {
    dispatch(setMode('business'));
    navigate('/');
  };

  return (
    <button
      onClick={() => {
        dispatch(setMode('user'));
        navigate('/');
      }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg z-50 hover:bg-green-600 transition-colors"
    >
      Switch to User
    </button>
  );
};

export default UserProfileBusiness;
