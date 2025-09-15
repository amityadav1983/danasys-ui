import React, { useEffect, useState } from "react";
import { authService } from "../../services/auth";

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

const TransferHistory: React.FC = () => {
  const [transferHistory, setTransferHistory] = useState<TransferReqDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransferHistory = async () => {
      try {
        const userProfileId = localStorage.getItem('userProfileId');
        if (!userProfileId) {
          console.error("User profile ID not found");
          setLoading(false);
          return;
        }
        const response = await fetch(`/api/payment/getTransferRequestHistory/${userProfileId}`, {
          method: "GET",
          headers: { accept: "*/*" },
        });
        const data: TransferReqDTO[] = await response.json();
        setTransferHistory(data);
      } catch (error) {
        console.error("Error fetching transfer history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransferHistory();
  }, []);

  return (
    <div className="p-6">
      {/* <h2 className="text-3xl font-bold mb-6 text-gray-800">Transfer History</h2> */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading transfer history...</p>
        ) : transferHistory.length > 0 ? (
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
              {transferHistory.map((transfer, index) => (
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
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-600">
                      {transfer.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No transfer history available.</p>
        )}
      </div>
    </div>
  );
};

export default TransferHistory;
