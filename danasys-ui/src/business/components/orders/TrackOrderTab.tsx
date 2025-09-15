import React, { useState } from "react";
import api from "../../../services/api";

interface Product {
  purchasedProductId: number;
  product: any; // abhi null aa raha hai API se
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
  const [searchId, setSearchId] = useState<string>("");

  const fetchOrder = async () => {
    if (!searchId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/order/orderTracker/${searchId}`);
      setOrder(res.data);
    } catch (err: any) {
      setOrder(null);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* <h2 className="text-2xl font-bold mb-6 text-gray-800">Track Orders</h2> */}

      {/* 🔹 Search Bar */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
        <button
          onClick={fetchOrder}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* Loading State */}
      {loading && <p className="text-gray-600">Loading tracked order...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Order Display */}
      {!loading && order ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
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
                    Qty: {p.quantity} | MRP: ₹{p.mrp} | Offer: ₹{p.offerPrice}
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
          <div className="mt-6 flex justify-end gap-3">
            <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium">
              View Details
            </button>
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium">
              Contact Support
            </button>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
            No order to track at the moment.
          </div>
        )
      )}
    </div>
  );
};

export default TrackOrderTab;
