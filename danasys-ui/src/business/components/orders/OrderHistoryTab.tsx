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

interface OrderHistory {
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

const OrderHistoryTab: React.FC = () => {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const [roles, setRoles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await api.get("/api/user/getUserDetails");
        const userRoles = res.data.roles || [];
        setRoles(userRoles);
        if (!userRoles.includes("ROLE_SUPERADMIN") && !userRoles.includes("ROLE_SUPERADMIN_MGR")) {
          setSelectedProfileId(res.data.userProfileId);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!selectedProfileId) return;
      setLoading(true);
      setError(null);
      try {
        const userProfileId = localStorage.getItem('userProfileId') || selectedProfileId.toString();

        const res = await api.get(`/api/order/orderHistory/${userProfileId}`);
        setOrders(res.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [selectedProfileId]);

  const handleDownload = (orderId: number) => {
    window.open(`/api/order/invoice/${orderId}/download?type=pdf`, '_blank');
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await api.get(
        `/api/user/loadUserBusinessProfile?userName=${encodeURIComponent(searchQuery)}`
      );
      setBusinessProfiles(res.data);
    } catch (err) {
      console.error("Error fetching profiles:", err);
    }
  };

  return (
    <div className="p-2 md:p-6">
      {(roles.includes("ROLE_SUPERADMIN") || roles.includes("ROLE_SUPERADMIN_MGR")) && (
        <div className="mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl">
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

            {businessProfiles.length > 0 && (
              <div className="w-full md:w-1/3">
                <select
                  value={selectedProfileId ?? ""}
                  onChange={(e) => setSelectedProfileId(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">-- Select Profile --</option>
                  {businessProfiles.map((profile) => (
                    <option key={profile.id} value={profile.ownerName}>
                      {profile.ownerName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {loading && <p className="text-gray-600">Loading order history...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && orders.length > 0 ? (
  <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto md:scrollbar-hide w-[110%] sm:w-[90%] md:max-w-4xl mx-auto ml-[-10px] sm:ml-0">
   {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-3 md:p-6 hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 sm:mb-0">
                  Order #{order.id}
                </h3>
                <span className="px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-blue-100 text-blue-600 w-fit">
                  {order.orderStatus}
                </span>
              </div>

              {/* Products */}
              <div className="space-y-2">
                {order.products.map((p) => (
                  <div
                    key={p.purchasedProductId}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 px-3 py-2 rounded-lg border"
                  >
                    <div className="text-sm">
                      <p className="font-medium text-gray-800">
                        Product #{p.purchasedProductId}
                      </p>
                      <p className="text-xs text-gray-500 mt-[1px]">
                        Qty: {p.quantity} | MRP: ₹{p.mrp} | Offer: ₹{p.offerPrice}
                      </p>
                    </div>
                    <span className="text-[10px] sm:text-xs mt-1 sm:mt-0 px-2 py-1 rounded-full bg-green-100 text-green-700 self-start sm:self-center">
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Details */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Delivery Slot: </span>
                  {new Date(order.orderDeliverTimeSlot).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Address: </span>
                  {order.deliveryAddress}
                </p>
                <p>
                  <span className="font-semibold">Total: </span>₹{order.totalPrice.toFixed(2)}
                </p>
                <p>
                  <span className="font-semibold">Discount: </span>₹{order.totalDiscount.toFixed(2)}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                <button
                  onClick={() => handleDownload(order.id)}
                  className="w-full sm:w-auto px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs sm:text-sm font-medium"
                >
                  Download Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        selectedProfileId && (
          <div className="bg-white p-4 md:p-6 rounded-xl shadow text-center text-gray-600">
            No order history for this profile.
          </div>
        )
      )}
    </div>
  );
};

export default OrderHistoryTab;
