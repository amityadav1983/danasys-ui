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

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [reasons, setReasons] = useState<Record<number, string>>({});
  const [images, setImages] = useState<Record<number, File | null>>({});

  const [productStatuses, setProductStatuses] = useState<Record<number, string>>({});
  const [productComments, setProductComments] = useState<Record<number, string>>({});

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
        const res = await api.get(`/api/order/fetchActiveOrder/${userProfileId}`);
        setOrders(res.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [selectedProfileId]);

  const handleCheckboxChange = (orderId: number) => {
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
  };

  const handleReasonChange = (orderId: number, value: string) => {
    setReasons((prev) => ({
      ...prev,
      [orderId]: value,
    }));
  };

  const handleFileChange = (orderId: number, file: File | null) => {
    setImages((prev) => ({
      ...prev,
      [orderId]: file,
    }));
  };

  const handleProductStatusChange = (productId: number, status: string) => {
    setProductStatuses((prev) => ({
      ...prev,
      [productId]: status,
    }));
  };

  const handleProductCommentChange = (productId: number, comment: string) => {
    setProductComments((prev) => ({
      ...prev,
      [productId]: comment,
    }));
  };

  const handleUpdateStatus = async (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const items = order.products.map(p => {
      const status = productStatuses[p.purchasedProductId] || "DELIVERED";
      const comments = productComments[p.purchasedProductId] || "";
      return {
        purchasedProductId: p.purchasedProductId,
        status,
        comments,
        starRating: 0,
      };
    });

    const payload = {
      updateOrderStatusRequest: {
        orderId,
        items,
        platformFees: 0,
      },
    };

    try {
      await api.post("/api/order/updateOrderStatusByBU", payload);
      alert("Status updated successfully");
      // Reset for all products in this order
      const resetStatuses = { ...productStatuses };
      const resetComments = { ...productComments };
      order.products.forEach(p => {
        resetStatuses[p.purchasedProductId] = "";
        resetComments[p.purchasedProductId] = "";
      });
      setProductStatuses(resetStatuses);
      setProductComments(resetComments);
    } catch (err: any) {
      alert("Failed to update status: " + (err.message || "Something went wrong"));
    }
  };



  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

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

      {loading && <p className="text-gray-600">Loading active orders...</p>}
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
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedOrderId === order.id}
                    onChange={() => handleCheckboxChange(order.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <h3 className="text-base md:text-lg font-semibold text-gray-800">
                    Order #{order.id}
                  </h3>
                </div>
                <span className="px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-full bg-blue-100 text-blue-600 w-fit">
                  {order.orderStatus}
                </span>
              </div>

              {/* Products */}
              <div className="space-y-2">
                {order.products.map((p) => (
                  <div
                    key={p.purchasedProductId}
                    className="bg-gray-50 px-3 py-2 rounded-lg border"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          Product #{p.purchasedProductId}
                        </p>
                        <p className="text-xs text-gray-500 mt-[1px]">
                          Qty: {p.quantity} | MRP: ₹{p.mrp} | Offer: ₹{p.offerPrice}
                        </p>
                       {selectedOrderId === order.id && (
  <div className="mt-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm transition-all">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {/* Dropdown */}
      <select
        value={productStatuses[p.purchasedProductId] || "DELIVERED"}
        onChange={(e) =>
          handleProductStatusChange(p.purchasedProductId, e.target.value)
        }
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white shadow-sm w-full sm:w-48"
      >
        <option value="">Select Status</option>
        <option value="IN_PROGRESS">Order Placed</option>
        <option value="DELIVERED">Delivered</option>
        <option value="OUT_OF_STOCK">Out of Stock</option>
        <option value="CANCELED">Canceled</option>
      </select>

      {/* Input for Remarks */}
      <input
        type="text"
        placeholder="Enter remarks..."
        value={productComments[p.purchasedProductId] || ""}
        onChange={(e) =>
          handleProductCommentChange(p.purchasedProductId, e.target.value)
        }
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white shadow-sm"
      />
    </div>
  </div>
)}

                      </div>
                      <span className="text-[10px] sm:text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 self-start">
                        {p.status}
                      </span>
                    </div>
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

              {/* Update Button */}
              {selectedOrderId === order.id && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleUpdateStatus(order.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-medium hover:opacity-90 shadow-md transition"
                  >
                    <span>Update</span>
                  </button>
                </div>
              )}

              {/* Footer Actions */}
              {/* <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => handleReturn(order.id)}
                  disabled={
                    !Object.keys(selectedOrders).some((id) => selectedOrders[+id])
                  }
                  className={`px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-medium ${
                    Object.keys(selectedOrders).some((id) => selectedOrders[+id])
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FaUndoAlt /> Return Order
                </button>
                <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm font-medium">
                  View Details
                </button>
                <button
                  onClick={() => handleDownload(order.id)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  Download Invoice
                </button>
              </div> */}
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
