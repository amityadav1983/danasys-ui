import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import DeliveryToggle from "../../components/DeliveryToggle";
import UserProfile from "../../components/UserProfile";
import newLogo from "../../assets/images/white-logo (2).png";
import { authService } from "../../services/auth";
import { useAppSelector } from "../../hooks/useAppSelector";

type Props = {
  toggleSidebar: () => void;
};

const BusinessHeader = ({ toggleSidebar }: Props) => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [color, setColor] = useState("#2596be");
  const currentMode = useAppSelector((state) => state.mode.currentMode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetailsData = await authService.getUserDetails();
        setUserDetails(userDetailsData);
        const dashboard = await authService.loadBusinessDashboard(userDetailsData.userProfileId);
        console.log("BusinessHeader dashboard.colorTheam:", dashboard.colorTheam);
        setColor(dashboard.colorTheam);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-20">
      {/* 🔹 Sidebar Background Extension - Hidden on mobile */}
      <div
        className="hidden md:flex w-64 items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <Link to="/">
          <img
            src={newLogo}
            alt="Cost2Cost Logo"
            className="h-12 object-contain"
          />
        </Link>
      </div>

      {/* 🔹 Rest of Header (only this part has border bottom) */}
      <div className="flex-1 bg-white flex items-center justify-between px-6 border-b border-gray-200 shadow-md">
        {/* Left: Logo on mobile, Toggle Button on desktop */}
        <div className="flex items-center gap-4">
          <Link to="/" className="md:hidden">
            <img
              src={newLogo}
              alt="Cost2Cost Logo"
              className="h-8 object-contain"
            />
          </Link>
          {currentMode !== "business" && <DeliveryToggle />}
        </div>

        {/* Right: Menu Icon, UserProfile on mobile; Wallet and UserProfile on desktop */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-600 hover:text-gray-800"
          >
            <FaBars size={20} />
          </button>
          {userDetails?.userWalletImage && (
            <div className="hidden md:flex flex-col items-center">
              <img
                src={userDetails.userWalletImage}
                alt="Wallet"
                className="w-8 h-8 object-contain cursor-pointer"
              />
              <span className="text-xs text-gray-600">₹{userDetails?.userWalletBalance}</span>
            </div>
          )}
          <UserProfile />
        </div>
      </div>
    </header>
  );
};

export default BusinessHeader;
