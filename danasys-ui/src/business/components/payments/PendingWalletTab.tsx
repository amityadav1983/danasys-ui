import React, { useEffect, useState } from "react";
import { FaWallet, FaHistory } from "react-icons/fa";

interface TransactionDTO {
  amount: string;
  type: string;
  orderId: number;
  transactionDatel: string;
}

interface PendingWalletData {
  currentBalance: number;
  transferReqDTO: any[]; // empty in example
  transactionDTO: TransactionDTO[];
}

const PendingWalletTab: React.FC = () => {
  const [walletData, setWalletData] = useState<PendingWalletData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        // Get userProfileId from localStorage, fallback to '1' if not found
        const userProfileId = localStorage.getItem('userProfileId') || '1';

        const response = await fetch(
          `/api/payment/getUnclearedWalletBalance/${userProfileId}`,
          {
            method: "GET",
            headers: { accept: "*/*" },
          }
        );

        const data: PendingWalletData = await response.json();
        setWalletData(data);
      } catch (error) {
        console.error("Error fetching pending wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  return (
    <div className="p-6">
      {/* <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FaWallet className="text-blue-600" /> Pending Wallet
      </h2> */}

      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading pending wallet balance...</p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-500 text-sm">Pending Balance</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{walletData?.currentBalance?.toFixed(2) || "0.00"}
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition">
                Transfer Wallet
              </button>
            </div>

            <hr className="my-4" />

            <div>
              <p className="flex items-center gap-2 text-gray-700 font-semibold mb-4">
                <FaHistory className="text-gray-500" /> Recent Transactions
              </p>
              {walletData?.transactionDTO?.length ? (
                <div className="w-full">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 font-semibold text-gray-700 px-5 py-3 bg-gray-100 rounded-t-xl border border-gray-200">
                    <div className="text-left">Amount</div>
                    <div className="text-left">Type</div>
                    <div className="text-left">Order ID</div>
                    <div className="text-center">Date</div>
                  </div>

                  {/* Table Body */}
                  <div className="space-y-3 group">
                    {walletData.transactionDTO.map((transaction, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-4 items-center px-5 py-4 bg-blue-50 mt-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300
                          group-hover:opacity-40 hover:!opacity-100 hover:bg-blue-100 hover:scale-[1.06] hover:shadow-md"
                      >
                        {/* Amount */}
                        <div className="text-gray-800 font-medium">
                          {transaction.amount}
                        </div>

                        {/* Type */}
<div className="text-gray-800 break-words pr-4">
  {transaction.type}
</div>

{/* Order ID */}
<div className="text-gray-600 text-sm pl-4">
  {transaction.orderId}
</div>


                        {/* Date */}
                        <div className="text-center">
                          {new Date(transaction.transactionDatel).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No transactions yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PendingWalletTab;
