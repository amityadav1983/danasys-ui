import React, { useEffect, useState } from "react";
import { FaWallet, FaHistory } from "react-icons/fa";

const WalletTab: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(
          "/api/payment/getWalletBalance/1", // 👈 direct endpoint (relative)
          {
            method: "GET",
            headers: { accept: "*/*" },
          }
        );

        const data = await response.json(); // backend number return karega (e.g. 100)
        setBalance(data);
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FaWallet className="text-blue-600" /> Wallet
      </h2>

      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading wallet balance...</p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-500 text-sm">Current Balance</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{balance !== null ? balance.toFixed(2) : "0.00"}
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition">
                Add Money
              </button>
            </div>

            <hr className="my-4" />

            <div>
              <p className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FaHistory className="text-gray-500" /> Recent Transactions
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="p-3 bg-gray-50 rounded-lg">No transactions yet.</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletTab;
