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
  FaUserPlus,
  FaExchangeAlt,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const BusinessSideMenu = () => {
  const location = useLocation();

  const menuItems = [
    { icon: FaUserTie, label: "Business Profile", to: "/business/profile" },
    { icon: FaUserPlus, label: "Users", to: "/business/add-user" },
    { icon: FaCheckCircle, label: "Activation", to: "/business/activation" },
    { icon: FaBoxOpen, label: "Products", to: "/business/products" },
    { icon: FaShoppingCart, label: "Orders", to: "/business/orders" },
    { icon: FaMoneyBillWave, label: "Payments", to: "/business/payments" },
    { icon: FaChartBar, label: "Reports", to: "/business/reports" },
    { icon: FaBuilding, label: "Company Profile", to: "/business/company-profile" },
    { icon: FaChartLine, label: "Trends", to: "/business/trends" },
    { icon: FaFileAlt, label: "Annual Report", to: "/business/annual-report" },
    { icon: FaComments, label: "Communication", to: "/business/communication" },
    { icon: FaExchangeAlt, label: "Money Transfer", to: "/business/money-transfer" },
  ];

  return (
    <aside className="bg-gradient-to-b from-blue-400 to-blue-400 text-white fixed top-20 left-0 h-screen w-64 flex flex-col justify-between shadow-lg">
      {/* ✅ Menu Items */}
      <nav className="flex-1 px-0 mt-3 overflow-y-auto scrollbar-hide mb-10">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.to;
            return (
              <li key={index}>
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
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ✅ Footer Links */}
      <div className="px-6 py-4 flex items-center justify-center space-x-4 text-sm text-blue-200">
        <a href="#" className="hover:text-white">
          Facebook
        </a>
        <a href="#" className="hover:text-white">
          Twitter
        </a>
        <a href="#" className="hover:text-white">
          Google
        </a>
      </div>
    </aside>
  );
};

export default BusinessSideMenu;
