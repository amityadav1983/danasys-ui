import { Link } from "react-router-dom";
import DeliveryToggle from "../../components/DeliveryToggle";
import newLogo from "../../assets/images/COST2COST.png";

const BusinessHeader = () => {
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

        {/* Toggle Button */}
        <div className="flex items-center">
          <DeliveryToggle />
        </div>
      </div>
    </header>
  );
};

export default BusinessHeader;
