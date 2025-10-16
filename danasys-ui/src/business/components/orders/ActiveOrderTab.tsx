import React, { useEffect, useState } from "react";
import api from "../../../services/api";

interface Product {
  purchasedProductId: number;
  product: any;
  returnDateLimit: string;
  status: string;
  quantity: number;
  offerPrice: number;
  mrp: number;
}

interface ActiveOrder {
  id: number;
  orderStatus: string;
  products: Product[];
  orderDeliverTimeSlot: string;
  totalPrice: number;
  totalDiscount: number;
  deliveryAddress: string;
}

interface BusinessProfile {
  id: number;
  ownerName: string;
  userName: string;
}

const ActiveOrderTab: React.FC = () => {
  const [orders, setOrders] = useState<ActiveOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [roles, setRoles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

  // 🔹 Fetch user roles on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await api.get("/api/user/getUserDetails");
        const userRoles = res.data.roles || [];
        setRoles(userRoles);
        // For non-superadmin roles, directly set profileId and fetch orders
        if (!userRoles.includes("ROLE_SUPERADMIN") && !userRoles.includes("ROLE_SUPERADMIN_MGR")) {
          setSelectedProfileId(res.data.userProfileId);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    fetchUserDetails();
  }, []);

  // 🔹 Fetch orders when profile selected
  useEffect(() => {
    const fetchOrders = async () => {
      if (!selectedProfileId) return;
      setLoading(true);
      setError(null);
      try {
        // Get userProfileId from localStorage, fallback to selectedProfileId if not found
        const userProfileId = localStorage.getItem('userProfileId') || selectedProfileId.toString();

        const res = await api.get(
          `/api/order/fetchActiveOrder/${userProfileId}`
        );
        setOrders(res.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [selectedProfileId]);

  // 🔹 Search handler (for non-user roles)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await api.get(
        `/api/user/loadUserBusinessProfile?userName=${encodeURIComponent(
          searchQuery
        )}`
      );
      setBusinessProfiles(res.data);
    } catch (err) {
      console.error("Error fetching profiles:", err);
    }
  };

  return (
    <div className="p-2 md:p-6">
      {/* <h2 className="text-2xl font-bold mb-6 text-gray-800">Active Orders</h2> */}

      {/* 🔹 Search for ROLE_SUPERADMIN and ROLE_SUPERADMIN_MGR */}
      {(roles.includes("ROLE_SUPERADMIN") || roles.includes("ROLE_SUPERADMIN_MGR")) && (
        <div className="mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl">
            {/* Search Input + Button */}
            <div className="flex w-full md:w-2/3 gap-2">
              <input
                type="text"
                placeholder="Enter Email / Username"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>

            {/* Dropdown after Search */}
            {businessProfiles.length > 0 && (
              <div className="w-full md:w-1/3">
                <select
                  value={selectedProfileId ?? ""}
                  onChange={(e) => setSelectedProfileId(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">-- Select Profile --</option>
                  {businessProfiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.ownerName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && <p className="text-gray-600">Loading active orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Orders List */}
      {!loading && orders.length > 0 ? (
        <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto md:scrollbar-hide max-w-4xl mx-auto">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 hover:shadow-xl transition max-w-full"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Order #{order.id}
                </h3>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
                  {order.orderStatus}
                </span>
              </div>

              {/* Products */}
              <div className="space-y-3">
                {order.products.map((p) => (
                  <div
                    key={p.purchasedProductId}
                    className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        Product #{p.purchasedProductId}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {p.quantity} | MRP: ₹{p.mrp} | Offer: ₹
                        {p.offerPrice}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Details */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Delivery Slot: </span>
                  {new Date(order.orderDeliverTimeSlot).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Delivery Address: </span>
                  {order.deliveryAddress}
                </p>
                <p>
                  <span className="font-semibold">Total Price: </span>₹
                  {order.totalPrice.toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Discount: </span>₹
                  {order.totalDiscount.toFixed(2)}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col md:flex-row justify-end gap-3">
                <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-sm font-medium">
                  Track Order
                </button>
                <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium">
                  Cancel Order
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        selectedProfileId && (
          <div className="bg-white p-4 md:p-6 rounded-xl shadow text-center text-gray-600">
            No active orders for this profile.
          </div>
        )
      )}
    </div>
  );
};

export default ActiveOrderTab;
