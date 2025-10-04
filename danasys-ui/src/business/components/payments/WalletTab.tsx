import React, { useEffect, useState } from "react";
import { FaWallet, FaHistory } from "react-icons/fa";

interface TransferReqDTO {
  id: number | null;
  amount: string;
  bankName: string;
  toUser: string;
  reqDate: string;
  reqRaisedBy: string;
  status: string;
  requestType: string;
}

interface TransactionDTO {
  // Assuming similar structure, but empty in example
}

interface WalletData {
  currentBalance: number;
  transferReqDTO: TransferReqDTO[];
  transactionDTO: TransactionDTO[];
}

const WalletTab: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        // Get userProfileId from localStorage, fallback to '1' if not found
        const userProfileId = localStorage.getItem('userProfileId') || '1';

        const response = await fetch(
          `/api/payment/getWalletBalance/${userProfileId}`,
          {
            method: "GET",
            headers: { accept: "*/*" },
          }
        );

        const data: WalletData = await response.json();
        setWalletData(data);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  return (
    <div className="p-6">
      {/* <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <FaWallet className="text-blue-600" /> Wallet
      </h2> */}

      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading wallet balance...</p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-500 text-sm">Current Balance</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{walletData?.currentBalance?.toFixed(2) || "0.00"}
                </p>
              </div>
              <div className="flex gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition">
                Add Money
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition">
                Withdrwal
              </button>
              </div>
            </div>

            <hr className="my-4" />

            <div>
              <p className="flex items-center gap-2 text-gray-700 font-semibold mb-4">
                <FaHistory className="text-gray-500" /> Recent Transactions
              </p>
              {walletData?.transferReqDTO?.length ? (
                <div className="w-full">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 font-semibold text-gray-700 px-5 py-3 bg-gray-100 rounded-t-xl border border-gray-200">
                    <div className="text-left">Amount</div>
                    <div className="text-left">To User</div>
                    <div className="text-left">Bank</div>
                    <div className="text-center">Status</div>
                  </div>

                  {/* Table Body */}
                  <div className="space-y-3 group">
                    {walletData.transferReqDTO.slice(0, visibleCount).map((transfer, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-4 items-center px-5 py-4 bg-blue-50 mt-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300
                          group-hover:opacity-40 hover:!opacity-100 hover:bg-blue-100 hover:scale-[1.06] hover:shadow-md"
                      >
                        {/* Amount */}
                        <div className="text-gray-800 font-medium">
                          {transfer.amount}
                        </div>

                        {/* To User */}
                        <div className="text-gray-800">
                          {transfer.toUser}
                        </div>

                        {/* Bank */}
                        <div className="text-gray-600 text-sm">
                          {transfer.bankName}
                        </div>

                        {/* Status */}
                        <div className="text-center">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            transfer.status === 'TRANSFER_DONE' ? 'bg-green-100 text-green-600' :
                            transfer.status === 'TRANSFER_DECLIENED' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {transfer.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {walletData.transferReqDTO.length > visibleCount && (
                    <button
                      onClick={() => setVisibleCount(prev => prev + 10)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition mt-4"
                    >
                      View More
                    </button>
                  )}
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

export default WalletTab;
