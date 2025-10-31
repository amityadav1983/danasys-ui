import React, { useState, useEffect } from "react";
import api from "../../../services/api";

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfileId: string | null;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const AddMoneyModal: React.FC<AddMoneyModalProps> = ({
  isOpen,
  onClose,
  userProfileId,
}) => {
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setComment("");
    }
  }, [isOpen]);

  const handleAddMoney = async () => {
    if (!amount || !userProfileId || isProcessing) return;
    setIsProcessing(true);

    // Close modal first
    onClose();

    try {
      // 1. Create Razorpay order
      const createRes = await fetch(
        `/api/order/create-order?amount=${parseFloat(amount) * 1}`, // Amount in paisa
        {
          method: "POST",
          headers: { accept: "*/*" },
        }
      );

      if (!createRes.ok) throw new Error("Failed to create Razorpay order");
      const orderData = await createRes.json();
      console.log("Razorpay Order Response:", orderData);

      // 2. Open Razorpay Checkout
      const options: any = {
        key: "rzp_test_9djW8eAXNxoCGF", // Replace with your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Your Company",
        description: "Add Money to Wallet",
        order_id: orderData.id,
        handler: async function (response: any) {
          console.log("Payment successful:", response);

          // 3. Call addMoneyToWallet API
          try {
            const payload = {
              requestdUserProfileId: parseInt(userProfileId),
              amount: parseFloat(amount),
              transactionID: response.razorpay_payment_id,
              comments: comment,
            };

            const addMoneyRes = await api.post("/api/order/addMoneyToWallet", payload);
            console.log("Add Money Response:", addMoneyRes.data);

            // Reset fields
            setAmount("");
            setComment("");
            alert("Money added successfully!");
          } catch (error) {
            console.error("Error adding money:", error);
            alert("Failed to add money to wallet");
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: { color: "#0c30fe" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

      // Handle failure
      rzp1.on("payment.failed", (response: any) => {
        console.error("Payment Failed:", response.error);
        alert("Payment failed. Please try again.");
      });

      // Handle cancel (modal dismissed)
      rzp1.on("modal.ondismiss", () => {
        console.log("Payment modal dismissed (canceled)");
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Failed to initiate payment");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50 animate-fadeIn">
      <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl w-[90%] max-w-md p-6 md:p-8 transition-transform transform scale-100 animate-slideUp">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          💰 Add Money to Wallet
        </h2>

        <div className="space-y-5">
          {/* Amount Input */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 bg-white/70 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter amount"
            />
          </div>

          {/* Comment Input */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Comment
            </label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 bg-white/70 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter any note (optional)"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-600 bg-white hover:bg-gray-100 transition-all shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMoney}
              disabled={isProcessing || !amount}
              className="px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Add Money"}
            </button>
          </div>
        </div>

        {/* Close Button (top right) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AddMoneyModal;
