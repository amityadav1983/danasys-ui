import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { FaUndoAlt } from "react-icons/fa";

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

const OrderHistoryTab: React.FC = () => {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedProducts, setSelectedProducts] = useState<Record<number, boolean>>({});
  const [reasons, setReasons] = useState<Record<number, string>>({});
  const [images, setImages] = useState<Record<number, File | null>>({});

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get userProfileId from localStorage, fallback to '1' if not found
        const userProfileId = localStorage.getItem('userProfileId') || '1';

        const res = await api.get(`/api/order/orderHistory/${userProfileId}`);
        setOrders(res.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCheckboxChange = (productId: number) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleReasonChange = (productId: number, value: string) => {
    setReasons((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleFileChange = (productId: number, file: File | null) => {
    setImages((prev) => ({
      ...prev,
      [productId]: file,
    }));
  };

  const handleReturn = (orderId: number) => {
    const selected = Object.keys(selectedProducts).filter((id) => selectedProducts[+id]);
    console.log("Returning products from order:", orderId, selected);
    // yaha API call kar sakte ho
  };

  return (
    <div className="p-6">
      {/* <h2 className="text-2xl font-bold mb-6 text-gray-800">Order History</h2> */}

      {loading && <p className="text-gray-600">Loading order history...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition"
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
                {order.products.map((p) => {
                  const isSelected = selectedProducts[p.purchasedProductId] || false;
                  return (
                    <div
                      key={p.purchasedProductId}
                      className="flex flex-col md:flex-row md:justify-between md:items-start bg-gray-50 px-4 py-3 rounded-lg border gap-3"
                    >
                      {/* Checkbox + Info */}
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleCheckboxChange(p.purchasedProductId)}
                          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            Product #{p.purchasedProductId}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {p.quantity} | MRP: ₹{p.mrp} | Offer: ₹{p.offerPrice}
                          </p>
                        </div>
                      </div>

                      {/* Hidden/Shown Fields */}
                      {isSelected && (
                        <div className="flex flex-wrap items-center gap-3">
                          {/* Upload Image */}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`upload-${p.purchasedProductId}`}
                            onChange={(e) =>
                              handleFileChange(
                                p.purchasedProductId,
                                e.target.files ? e.target.files[0] : null
                              )
                            }
                          />
                          <label
                            htmlFor={`upload-${p.purchasedProductId}`}
                            className="px-3 py-1 border rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-gray-100"
                          >
                            Upload Image
                          </label>

                          {/* Reason */}
                          <input
                            type="text"
                            placeholder="Reason to return"
                            value={reasons[p.purchasedProductId] || ""}
                            onChange={(e) =>
                              handleReasonChange(p.purchasedProductId, e.target.value)
                            }
                            className="border rounded-lg px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-blue-200"
                          />

                          {/* Status */}
                          <select
                            className="border rounded-lg px-3 py-1 text-sm text-gray-700 focus:outline-none"
                            defaultValue={p.status}
                          >
                            <option value="ORDER_PLACED">ORDER_PLACED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="RETURN_REQUESTED">RETURN_REQUESTED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
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

              {/* Footer Actions */}
              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => handleReturn(order.id)}
                  disabled={
                    !Object.keys(selectedProducts).some((id) => selectedProducts[+id])
                  }
                  className={`px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-medium ${
                    Object.keys(selectedProducts).some((id) => selectedProducts[+id])
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FaUndoAlt /> Return Order
                </button>
                <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm font-medium">
                  View Details
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                  Download Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
            No order history available.
          </div>
        )
      )}
    </div>
  );
};

export default OrderHistoryTab;
