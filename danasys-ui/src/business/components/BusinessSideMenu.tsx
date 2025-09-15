import React, { useState, useEffect } from "react";
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
  FaNetworkWired, // ✅ New icon for My Connections
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setMode } from "../../store/mode";
import { authService } from "../../services/auth";

interface MenuItem {
  icon: any;
  label: string;
  to: string;
  buIconPath?: string;
}

const BusinessSideMenu: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [color, setColor] = useState("#228B22");
  const [loading, setLoading] = useState(true);

  const menuMap: Record<string, { icon: any; label: string; to: string }> = {
    "Product": { icon: FaBoxOpen, label: "Products", to: "/business/products" },
    "Business User": { icon: FaUserTie, label: "Business Profile", to: "/business/profile" },
    "Orders": { icon: FaShoppingCart, label: "Orders", to: "/business/orders" },
    "Payments": { icon: FaMoneyBillWave, label: "Payments", to: "/business/payments" },
    "Reports": { icon: FaChartBar, label: "Reports", to: "/business/reports" },
    "Compemy Profile": { icon: FaBuilding, label: "Company Profile", to: "/business/company-profile" },
    "Trend": { icon: FaChartLine, label: "Trends", to: "/business/trends" },
    "Anual report": { icon: FaFileAlt, label: "Annual Report", to: "/business/annual-report" },
    "Activation": { icon: FaCheckCircle, label: "Activation", to: "/business/activation" },
    "Communication": { icon: FaComments, label: "Communication", to: "/business/communication" },
    "Users": { icon: FaUsers, label: "Users", to: "/business/add-user" },
  };

  const hardcodedItems: MenuItem[] = [
    { icon: FaExchangeAlt, label: "Money Transfer", to: "/business/money-transfer" },
    { icon: FaNetworkWired, label: "My Connections", to: "/business/connections" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await authService.getUserDetails();
        const dashboard = await authService.loadBusinessDashboard(user.id);
        const dynamicItems = dashboard.menuItems
          .map((item) => {
            const config = menuMap[item.name];
            if (config) {
              return { ...config, buIconPath: item.buIconPath };
            }
            return null;
          })
          .filter(Boolean) as MenuItem[];
        setMenuItems([...dynamicItems, ...hardcodedItems]);
        setColor(dashboard.colorTheam);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        // Fallback to hardcoded
        setMenuItems([
          { icon: FaUserTie, label: "Business Profile", to: "/business/profile" },
          { icon: FaUsers, label: "Users", to: "/business/add-user" },
          { icon: FaCheckCircle, label: "Activation", to: "/business/activation" },
          { icon: FaBoxOpen, label: "Products", to: "/business/products" },
          { icon: FaShoppingCart, label: "Orders", to: "/business/orders" },
          { icon: FaMoneyBillWave, label: "Payments", to: "/business/payments" },
          { icon: FaExchangeAlt, label: "Money Transfer", to: "/business/money-transfer" },
          { icon: FaNetworkWired, label: "My Connections", to: "/business/connections" },
          { icon: FaChartBar, label: "Reports", to: "/business/reports" },
          { icon: FaBuilding, label: "Company Profile", to: "/business/company-profile" },
          { icon: FaChartLine, label: "Trends", to: "/business/trends" },
          { icon: FaFileAlt, label: "Annual Report", to: "/business/annual-report" },
          { icon: FaComments, label: "Communication", to: "/business/communication" },
        ]);
        setColor("#228B22");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOverviewClick = () => {
    dispatch(setMode("business"));
  };

  if (loading) {
    return (
      <aside className="text-white fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 flex flex-col justify-center items-center">
        <div>Loading...</div>
      </aside>
    );
  }

  return (
    <aside
      className="text-white fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 flex flex-col justify-between"
      style={{ backgroundColor: color }}
    >
      {/* ✅ Menu Items */}
      <nav className="flex-1 px-0 mt-6 overflow-y-auto scrollbar-hide mb-10">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            let isActive = false;
            if (item.label === "Overview") {
              isActive =
                location.pathname === "/business" ||
                location.pathname === "/business/";
            } else if (item.label === "Products") {
              isActive =
                location.pathname === item.to ||
                location.pathname === "/business/manage-products";
            } else {
              isActive = location.pathname === item.to;
            }
            return (
              <li key={index}>
                {item.label === "Overview" ? (
                  <Link
                    to={item.to}
                    onClick={
                      item.label === "Overview" ? handleOverviewClick : undefined
                    }
                    className={`flex items-center gap-3 px-4 py-3 transition-all duration-300 ${
                      isActive
                        ? "bg-white font-semibold shadow rounded-r-full"
                        : "text-white hover:bg-white/20 rounded-r-full"
                    }`}
                    style={isActive ? { color } : {}}
                  >
                    {item.buIconPath ? (
                      <img src={item.buIconPath} alt={item.label} className="w-4 h-4" />
                    ) : (
                      <item.icon className="text-lg" />
                    )}
                    <span className="text-base">{item.label}</span>
                  </Link>
                ) : (
                  <Link
                    to={item.to}
                    className={`flex items-center gap-3 px-4 py-3 transition-all duration-300 ${
                      isActive
                        ? "bg-white font-semibold ml-3 shadow rounded-tl-full rounded-bl-full"
                        : "text-white hover:bg-white/20 rounded-tl-full rounded-bl-full"
                    }`}
                    style={isActive ? { color } : {}}
                  >
                    {item.buIconPath ? (
                      <img src={item.buIconPath} alt={item.label} className="w-4 h-4" />
                    ) : (
                      <item.icon className="text-lg" />
                    )}
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
