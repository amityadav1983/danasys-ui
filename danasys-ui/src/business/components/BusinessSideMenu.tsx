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
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(true);

  const menuMap: Record<string, { icon: any; label: string; to: string }> = {
    "Dashboard": { icon: FaHome, label: "Dashboard", to: "/business" },
    "Business User": { icon: FaUserTie, label: "Business Profile", to: "/business/profile" },
    "Users": { icon: FaUsers, label: "Users", to: "/business/add-user" },
      "Activation": { icon: FaCheckCircle, label: "Activation", to: "/business/activation" },
    "Product": { icon: FaBoxOpen, label: "Products", to: "/business/products" },
    "Orders": { icon: FaShoppingCart, label: "Orders", to: "/business/orders" },
    "Payments": { icon: FaMoneyBillWave, label: "Payments", to: "/business/payments" },
     "Money Transfer": { icon: FaExchangeAlt, label: "Money Transfer", to: "/business/money-transfer" },
     "Connections": { icon: FaNetworkWired, label: "My Connections", to: "/business/connections" },
    "Reports": { icon: FaChartBar, label: "Reports", to: "/business/reports" },
    "Compemy Profile": { icon: FaBuilding, label: "Company Profile", to: "/business/company-profile" },
    "Trend": { icon: FaChartLine, label: "Trends", to: "/business/trends" },
    "Anual report": { icon: FaFileAlt, label: "Annual Report", to: "/business/annual-report" },
    "Communication": { icon: FaComments, label: "Communication", to: "/business/communication" },
  };

  const hardcodedItems: MenuItem[] = [
    { icon: FaExchangeAlt, label: "Money Transfer", to: "/business/money-transfer" },
    { icon: FaNetworkWired, label: "My Connections", to: "/business/connections" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await authService.getUserDetails();
        const userRoles = (user as any).roles || [];
        const isSuperAdmin = userRoles.some((role: string) => ["ROLE_SUPERADMIN", "ROLE_SUPERADMIN_MGR"].includes(role));
        const dashboard = await authService.loadBusinessDashboard(user.userProfileId);
        console.log("Dashboard response:", dashboard);
        const dynamicItems = dashboard.buIconDetails
          .map((item) => {
            const config = menuMap[item.name];
            if (config && (item.name !== "Activation" || isSuperAdmin)) {
              return { ...config, buIconPath: item.buIconPath };
            }
            return null;
          })
          .filter(Boolean) as MenuItem[];
        console.log("Dynamic menu items:", dynamicItems);
        const order = [
          "Dashboard",
          "Business Profile",
          "Users",
          ...(isSuperAdmin ? ["Activation"] : []),
          "Products",
          "Orders",
          "Payments",
          "Money Transfer",
          "My Connections",
          "Reports",
          "Company Profile",
          "Trends",
          "Annual Report",
          "Communication",
        ];
        let combinedItems = [...dynamicItems, ...hardcodedItems];
        // Ensure Dashboard is included
        if (!combinedItems.find(item => item.label === "Dashboard")) {
          combinedItems = [{ icon: FaHome, label: "Dashboard", to: "/business" }, ...combinedItems];
        }
        combinedItems.sort((a, b) => {
          return order.indexOf(a.label) - order.indexOf(b.label);
        });
        setMenuItems(combinedItems);
        setColor(dashboard.colorTheam);
        console.log("Set color:", dashboard.colorTheam);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        // Fallback to hardcoded
        try {
          const user = await authService.getUserDetails();
          const userRoles = (user as any).roles || [];
          const isSuperAdmin = userRoles.some((role: string) => ["ROLE_SUPERADMIN", "ROLE_SUPERADMIN_MGR"].includes(role));
          const fallbackItems = [
            { icon: FaHome, label: "Dashboard", to: "/business" },
            { icon: FaUserTie, label: "Business Profile", to: "/business/profile" },
            { icon: FaUsers, label: "Users", to: "/business/add-user" },
            ...(isSuperAdmin ? [{ icon: FaCheckCircle, label: "Activation", to: "/business/activation" }] : []),
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
          ];
          setMenuItems(fallbackItems);
        } catch (fallbackError) {
          console.error("Error in fallback:", fallbackError);
          // Ultimate fallback without Activation
          setMenuItems([
            { icon: FaHome, label: "Dashboard", to: "/business" },
            { icon: FaUserTie, label: "Business Profile", to: "/business/profile" },
            { icon: FaUsers, label: "Users", to: "/business/add-user" },
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
        }
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
            if (item.label === "Dashboard") {
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
                {item.label === "Dashboard" ? (
                  <Link
                    to={item.to}
                    onClick={
                      item.label === "Dashboard" ? handleOverviewClick : undefined
                    }
                    className={`flex items-center gap-3 px-4 py-3 transition-all duration-300 ${
                      isActive
                        ? "bg-white font-semibold ml-3 shadow rounded-tl-full rounded-bl-full"
                        : "text-white hover:bg-white/20 rounded-tl-full rounded-bl-full"
                    }`}
                    style={isActive ? { color } : {}}
                  >
                    {item.buIconPath ? (
                      <img src={item.buIconPath} alt={item.label} className="w-8 h-8" />
                    ) : (
                      <item.icon className="text-xl text-black" />
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
                      <img src={item.buIconPath} alt={item.label} className="w-6 h-6" />
                    ) : (
                      <item.icon className="text-xl text-black" />
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
