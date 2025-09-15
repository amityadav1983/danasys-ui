import React, { useEffect, useState } from "react";

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

interface PendingTransferData {
  currentBalance: number;
  transferReqDTO: TransferReqDTO[];
  transactionDTO: any[];
}

const PendingTransferRequest: React.FC = () => {
  const [data, setData] = useState<PendingTransferData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        // No userProfileId needed here as per user instruction
        const response = await fetch("/api/payment/getAllPendingTransferRequest", {
          method: "GET",
          headers: { accept: "*/*" },
        });
        const data: PendingTransferData = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching pending transfer requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  return (
    <div className="p-6">
      {/* <h2 className="text-3xl font-bold mb-6 text-gray-800">Pending Transfer Requests</h2> */}
      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading pending requests...</p>
        ) : data?.transferReqDTO?.length ? (
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
              {data.transferReqDTO.map((request, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 items-center px-5 py-4 bg-blue-50 mt-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300
                    group-hover:opacity-40 hover:!opacity-100 hover:bg-blue-100 hover:scale-[1.06] hover:shadow-md"
                >
                  {/* Amount */}
                  <div className="text-gray-800 font-medium">
                    {request.amount}
                  </div>

                  {/* To User */}
                  <div className="text-gray-800">
                    {request.toUser}
                  </div>

                  {/* Bank */}
                  <div className="text-gray-600 text-sm">
                    {request.bankName}
                  </div>

                  {/* Status */}
                  <div className="text-center">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-600">
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No pending transfer requests.</p>
        )}
      </div>
    </div>
  );
};

export default PendingTransferRequest;
