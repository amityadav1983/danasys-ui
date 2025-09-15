import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DeliveryToggle from "../../components/DeliveryToggle";
import UserProfile from "../../components/UserProfile";
import newLogo from "../../assets/images/white-logo (2).png";
import { authService } from "../../services/auth";
import { useAppSelector } from "../../hooks/useAppSelector";

const BusinessHeader = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [color, setColor] = useState("#228B22");
  const currentMode = useAppSelector((state) => state.mode.currentMode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetailsData = await authService.getUserDetails();
        setUserDetails(userDetailsData);
        const dashboard = await authService.loadBusinessDashboard(userDetailsData.id);
        setColor(dashboard.colorTheam);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-20">
      {/* 🔹 Sidebar Background Extension */}
      <div
        className="w-64 flex items-center justify-center"
        style={{ background: `linear-gradient(to bottom, ${color}, ${color})` }}
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
        {/* Center: Toggle Button (hidden in business mode) */}
        <div>
          {currentMode !== "business" && <DeliveryToggle />}
        </div>

        {/* Right: Wallet and UserProfile */}
        <div className="flex items-center gap-4">
          {userDetails?.userWalletImage && (
            <img
              src={userDetails.userWalletImage}
              alt="Wallet"
              className="w-8 h-8 object-contain cursor-pointer"
            />
          )}
          <UserProfile />
        </div>
      </div>
    </header>
  );
};

export default BusinessHeader;
