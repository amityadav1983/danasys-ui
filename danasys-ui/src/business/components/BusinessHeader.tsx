import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DeliveryToggle from "../../components/DeliveryToggle";
import UserProfile from "../../components/UserProfile";
import newLogo from "../../assets/images/COST2COST.png";
import { authService } from "../../services/auth";
import { useAppSelector } from "../../hooks/useAppSelector";

const BusinessHeader = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const currentMode = useAppSelector((state) => state.mode.currentMode);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetailsData = await authService.getUserDetails();
        setUserDetails(userDetailsData);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img
              src={newLogo}
              alt="Cost2Cost Logo"
              className="h-12 object-contain"
            />
          </Link>
        </div>

        {/* Center: Toggle Button (hidden in business mode) */}
        <div className="flex items-center">
          {currentMode !== 'business' && <DeliveryToggle />}
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
