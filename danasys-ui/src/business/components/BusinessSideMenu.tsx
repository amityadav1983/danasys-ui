import {
  FaUserTie,
  FaBoxOpen,
  FaShoppingCart,
  FaMoneyBillWave,
  FaChartBar,
  FaBuilding,
  FaChartLine,
  FaCheckCircle,
  FaFileAlt,
  FaComments,
  FaUsers,
  FaExchangeAlt,
  FaHome,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setMode } from "../../store/mode";

const BusinessSideMenu = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const menuItems = [
    // { icon: FaHome, label: "Overview", to: "/business" },
    { icon: FaUserTie, label: "Business Profile", to: "/business/profile" },
    { icon: FaUsers, label: "Users", to: "/business/add-user" },
    { icon: FaCheckCircle, label: "Activation", to: "/business/activation" },
    { icon: FaBoxOpen, label: "Products", to: "/business/products" },
    { icon: FaShoppingCart, label: "Orders", to: "/business/orders" },
    { icon: FaMoneyBillWave, label: "Payments", to: "/business/payments" },
        { icon: FaExchangeAlt, label: "Money Transfer", to: "/business/money-transfer" },
    { icon: FaChartBar, label: "Reports", to: "/business/reports" },
    { icon: FaBuilding, label: "Company Profile", to: "/business/company-profile" },
    { icon: FaChartLine, label: "Trends", to: "/business/trends" },
    { icon: FaFileAlt, label: "Annual Report", to: "/business/annual-report" },
    { icon: FaComments, label: "Communication", to: "/business/communication" },
  ];

  const handleOverviewClick = () => {
    dispatch(setMode('business'));
  };

  return (
    <aside className="bg-gradient-to-b from-blue-400 to-blue-400 text-white fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 flex flex-col justify-between">
      {/* ✅ Menu Items */}
      <nav className="flex-1 px-0 mt-6 overflow-y-auto scrollbar-hide mb-10">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            let isActive = false;
            if (item.label === "Overview") {
              isActive = location.pathname === "/business" || location.pathname === "/business/";
            } else {
              isActive = location.pathname === item.to;
            }
            return (
              <li key={index}>
                {item.label === "Overview" ? (
                 <Link
  to={item.to}
  onClick={item.label === "Overview" ? handleOverviewClick : undefined}
  className={`flex items-center gap-3 px-4 py-3 transition-all duration-300 ${
    isActive
      ? "bg-white text-blue-700 font-semibold shadow rounded-r-full"
      : "text-blue-100 hover:bg-blue-700/40 rounded-r-full"
  }`}
>
  <item.icon className="text-lg" />
  <span className="text-base">{item.label}</span>
</Link>

                ) : (
                  <Link
                    to={item.to}
                    className={`flex items-center gap-3 px-4 py-3 transition-all duration-300 ${
                      isActive
                        ? "bg-white text-blue-700 font-semibold ml-3 shadow rounded-tl-full rounded-bl-full"
                        : "text-blue-100 hover:bg-blue-700/40 rounded-tl-full rounded-bl-full"
                    }`}
                  >
                    <item.icon className="text-lg" />
                    <span className="text-base">{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

    </aside>
  );
};

export default BusinessSideMenu;
