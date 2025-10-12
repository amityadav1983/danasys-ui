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
  transactionStatus: string[];
}

const PendingTransferRequest: React.FC = () => {
  const [data, setData] = useState<PendingTransferData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedRows, setCheckedRows] = useState<number[]>([]);
  const [inputValues, setInputValues] = useState<Record<number, { txnId: string; remarks: string }>>({});
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
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

  const handleCheck = (index: number) => {
    setCheckedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: value },
    }));
  };

  const handleTransferAction = async (index: number) => {
    const selected = data?.transferReqDTO[index];
    const inputs = inputValues[index];

    if (!selected || !inputs?.txnId || !inputs?.remarks) {
      alert("⚠️ Please fill both Transaction ID and Remarks before transferring.");
      return;
    }

    setActionLoading(index);

    try {
      const res = await fetch("/api/order/transferPlatformToBankAccount", {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bankTransferRequestId: selected.id ?? 0,
          bankTransactionID: inputs.txnId,
          comments: inputs.remarks,
        }),
      });

      if (!res.ok) {
        throw new Error(`Transfer failed: ${res.statusText}`);
      }

      const result = await res.json();
      console.log("Transfer success:", result);

      alert(`✅ Transfer successful for ${selected.toUser}`);

      // Optional: refresh list after successful transfer
      const updatedList = data?.transferReqDTO.filter((_, i) => i !== index) || [];
      setData((prev) => (prev ? { ...prev, transferReqDTO: updatedList } : prev));
    } catch (error) {
      console.error("Error during transfer:", error);
      alert("❌ Transfer failed. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6">
      <div className=" ">
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading pending requests...</p>
        ) : data ? (
          <div className="w-full">
            {/* Balance Section */}
            <div className="mb-6 text-lg font-semibold text-gray-800 flex justify-between">
              <span>💰 Current Balance:</span>
              <span className="text-green-600">₹{data.currentBalance}</span>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-5 font-semibold text-gray-700 px-5 py-3 bg-gray-100 rounded-t-xl border border-gray-200">
              <div></div>
              <div className="text-left">Amount</div>
              <div className="text-left">To User</div>
              <div className="text-left">Bank</div>
              <div className="text-center">Status / Action</div>
            </div>

            {/* Table Body */}
            <div className="space-y-3 group">
              {data.transferReqDTO.map((request, index) => {
                const isChecked = checkedRows.includes(index);
                const isLoading = actionLoading === index;

                return (
                  <div
                    key={index}
                    className={`grid grid-cols-5 items-center px-5 py-4 mt-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300
                      bg-blue-50 hover:bg-blue-100 hover:scale-[1.02]`}
                  >
                    {/* Checkbox */}
                    <div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheck(index)}
                        className="w-5 h-5 text-blue-600 accent-blue-500 cursor-pointer"
                      />
                    </div>

                    {/* Amount */}
                    <div className="text-gray-800 font-medium">{request.amount}</div>

                    {/* To User */}
                    <div className="text-gray-800">{request.toUser}</div>

                    {/* Bank */}
                    <div className="text-gray-600 text-sm">{request.bankName}</div>

                    {/* Status / Action */}
                    <div className="text-center space-y-2">
                      {/* Dropdown */}
                      <select
                        className="px-2 py-1 border rounded-md text-sm focus:ring focus:ring-blue-200"
                        disabled={!isChecked}
                        value={request.status}
                        onChange={(e) => {
                          if (data) {
                            const updated = [...data.transferReqDTO];
                            updated[index].status = e.target.value;
                            setData({ ...data, transferReqDTO: updated });
                          }
                        }}
                      >
                        {data.transactionStatus.map((status, idx) => (
                          <option key={idx} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      {/* Inputs & Button */}
                      {isChecked && (
                        <div className="flex flex-col gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="Transaction ID"
                            value={inputValues[index]?.txnId || ""}
                            onChange={(e) =>
                              handleInputChange(index, "txnId", e.target.value)
                            }
                            className="border px-2 py-1 rounded-md text-sm focus:ring focus:ring-blue-200"
                          />
                          <input
                            type="text"
                            placeholder="Remarks"
                            value={inputValues[index]?.remarks || ""}
                            onChange={(e) =>
                              handleInputChange(index, "remarks", e.target.value)
                            }
                            className="border px-2 py-1 rounded-md text-sm focus:ring focus:ring-blue-200"
                          />
                          <button
                            onClick={() => handleTransferAction(index)}
                            disabled={isLoading}
                            className={`${
                              isLoading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            } text-white text-sm font-medium rounded-md py-1 transition`}
                          >
                            {isLoading ? "Processing..." : "Transfer"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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
