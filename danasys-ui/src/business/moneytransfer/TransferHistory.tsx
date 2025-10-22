import React, { useEffect, useState } from "react";
import { authService, TransferReqDTO } from "../../services/auth";

const TransferHistory: React.FC = () => {
  const [transferHistory, setTransferHistory] = useState<TransferReqDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransferHistory = async () => {
      try {
        const userDetails = await authService.getUserDetails();
        const userProfileId = userDetails.userProfileId;
        const data = await authService.getTransferHistory(userProfileId);
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
    <div className="p-4 sm:p-6">
      <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6 border border-gray-100">
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading transfer history...</p>
        ) : transferHistory.length > 0 ? (
          <div className="w-full">
            {/* Table Header (Hidden on mobile) */}
            <div className="hidden sm:grid sm:grid-cols-4 font-semibold text-gray-700 px-5 py-3 bg-gray-100 rounded-t-xl border border-gray-200">
              <div className="text-left">Amount</div>
              <div className="text-left">To User</div>
              <div className="text-left">Bank</div>
              <div className="text-center">Status</div>
            </div>

            {/* Table Body */}
            <div className="space-y-3 group mt-2">
              {transferHistory.map((transfer, index) => (
                <div
                  key={index}
                  className="sm:grid sm:grid-cols-4 items-center px-5 py-4 bg-blue-50 mt-2 rounded-xl border border-gray-200 shadow-sm transition-all duration-300
                    group-hover:opacity-40 hover:!opacity-100 hover:bg-blue-100 hover:scale-[1.03] hover:shadow-md
                    flex flex-col sm:flex-none"
                >
                  {/* Mobile View Layout */}
                  <div className="flex flex-col sm:hidden w-full text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Amount:</span>
                      <span className="font-semibold text-gray-800">{transfer.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">To User:</span>
                      <span className="text-gray-800">{transfer.toUser}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Bank:</span>
                      <span className="text-gray-700">{transfer.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Status:</span>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-600">
                        {transfer.status}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block text-gray-800 font-medium">
                    {transfer.amount}
                  </div>
                  <div className="hidden sm:block text-gray-800">
                    {transfer.toUser}
                  </div>
                  <div className="hidden sm:block text-gray-600 text-sm">
                    {transfer.bankName}
                  </div>
                  <div className="hidden sm:block text-center">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-600">
                      {transfer.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No transfer history available.</p>
        )}
      </div>
    </div>
  );
};

export default TransferHistory;
