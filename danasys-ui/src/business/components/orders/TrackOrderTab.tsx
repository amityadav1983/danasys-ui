import React, { useState } from "react";
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

interface TrackOrder {
  id: number;
  orderStatus: string;
  products: Product[];
  orderDeliverTimeSlot: string;
  totalPrice: number;
  totalDiscount: number;
  deliveryAddress: string;
}



const TrackOrderTab: React.FC = () => {
  const [order, setOrder] = useState<TrackOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [orderId, setOrderId] = useState<string>("");

  const handleSearch = async () => {
    if (!orderId.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await api.get(`/api/order/orderTracker/${orderId}`);
      setOrder(res.data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 md:p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-2/3 gap-2">
  <label className="text-gray-700 font-medium whitespace-nowrap">
    Search with Order ID
  </label>
  <div className="flex w-full gap-2">
    <input
      type="text"
      placeholder="Enter Order ID"
      value={orderId}
      onChange={(e) => setOrderId(e.target.value)}
      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    />
    <button
      onClick={handleSearch}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Search
    </button>
  </div>
</div>

        </div>
      </div>

      {loading && <p className="text-gray-600">Loading order...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && order ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-3 md:p-6 hover:shadow-lg transition">
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
        </div>
      ) : (
        !loading && orderId && (
          <div className="bg-white p-4 md:p-6 rounded-xl shadow text-center text-gray-600">
            No order found with ID: {orderId}
          </div>
        )
      )}
    </div>
  );
};

export default TrackOrderTab;
