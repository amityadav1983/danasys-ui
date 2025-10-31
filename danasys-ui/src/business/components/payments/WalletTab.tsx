import React, { useEffect, useState } from "react";
import { FaWallet, FaHistory } from "react-icons/fa";
import api from "../../../services/api";
import AddMoneyModal from "./AddMoneyModal";
import WithdrawModal from "./WithdrawModal";

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
  amount: string;
  type: string;
  orderId: string;
  date: string;
}

interface WalletData {
  currentBalance: number;
  transferReqDTO: TransferReqDTO[];
  transactionDTO: TransactionDTO[];
}

interface BankAccount {
  id: number;
  bankName: string;
  accountNumber: number;
}

const WalletTab: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [roles, setRoles] = useState<string[]>([]);
  const [userName, setUserName] = useState("");
  const [searchedUserId, setSearchedUserId] = useState<string | null>(null);
  const [userProfileId, setUserProfileId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState("");

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);

  const [banks, setBanks] = useState<BankAccount[]>([]);

  // Helper function to format status
  const formatStatus = (status: string) => status.replace(/_/g, " ");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/api/user/getUserDetails");
        setRoles(res.data.roles || []);
        setUserProfileId(res.data.userProfileId?.toString() || null);
        setCurrentUserName(res.data.email || "");
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const profileId =
          searchedUserId || localStorage.getItem("userProfileId") || userProfileId || "101";

        const response = await fetch(`/api/payment/getWalletBalance/${profileId}`, {
          method: "GET",
          headers: { accept: "*/*" },
        });

        const data: WalletData = await response.json();
        setWalletData(data);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBanks = async () => {
      try {
        const res = await api.get(
          `/api/user/loadUserBusinessProfile?userName=${encodeURIComponent(currentUserName || "test")}`
        );
        if (res.data && res.data.length > 0) {
          const bankAccounts = res.data.map((profile: any) => ({
            id: profile.bankAccount.id,
            bankName: profile.bankAccount.bankName,
            accountNumber: profile.bankAccount.accountNumber,
          }));
          setBanks(bankAccounts);
        }
      } catch (err) {
        console.error("Error fetching banks:", err);
      }
    };

    if (userProfileId !== null || searchedUserId !== null) {
      fetchWalletData();
      fetchBanks();
    }
  }, [searchedUserId, userProfileId, userName, currentUserName]);

  const handleSearch = async () => {
    if (!userName.trim()) return;
    try {
      const res = await api.get(
        `/api/user/loadUserBusinessProfile?userName=${encodeURIComponent(userName)}`
      );
      if (res.data && res.data.length > 0) {
        setSearchedUserId(res.data[0].userProfileId.toString());
      } else {
        alert("User not found");
      }
    } catch (err) {
      console.error("Error searching user:", err);
      alert("Error searching user");
    }
  };

  const isSuper = roles.includes("ROLE_SUPERADMIN") || roles.includes("ROLE_SUPERADMIN_MGR");

  const handleWithdraw = async (amount: string, bankId: number, comment: string) => {
    try {
      const payload = {
        requestdUserProfileId: parseInt(userProfileId || "0"),
        bankId: bankId,
        amount: parseFloat(amount),
        transactionID: "string", // Placeholder, generate if needed
        comments: comment,
      };

      const response = await api.post("/api/order/transferWalletToBankAccount", payload);
      console.log("Withdrawal successful:", response.data);
      alert("Withdrawal request submitted successfully!");
      // Optionally refresh wallet data
      // fetchWalletData();
    } catch (error) {
      console.error("Error during withdrawal:", error);
      alert("Failed to process withdrawal. Please try again.");
    }
  };

  return (
    <div className="p-1 md:p-6">
      {isSuper && (
        <div className="mb-6 flex flex-col sm:flex-row w-full md:w-2/3 gap-3">
          <input
            type="text"
            placeholder="Enter Email or Mobile"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      )}

      <div className="bg-white shadow-md rounded-2xl p-4 md:p-6 border border-gray-100">
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading wallet balance...</p>
        ) : (
          <>
            {/* ✅ Balance Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Current Balance</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{walletData?.currentBalance?.toFixed(2) || "0.00"}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowAddMoneyModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition w-full sm:w-auto"
                >
                  Add Money
                </button>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition w-full sm:w-auto"
                >
                  Withdraw
                </button>
              </div>
            </div>

            {/* ✅ Add Money Modal */}
            <AddMoneyModal
              isOpen={showAddMoneyModal}
              onClose={() => setShowAddMoneyModal(false)}
              userProfileId={userProfileId}
            />

            {/* ✅ Withdraw Modal */}
            <WithdrawModal
              isOpen={showWithdrawModal}
              onClose={() => setShowWithdrawModal(false)}
              onWithdraw={handleWithdraw}
              banks={banks}
            />


            {/* ✅ Transaction List (same as before) */}
            <hr className="my-4" />
            <div>
              <p className="flex items-center gap-2 text-gray-700 font-semibold mb-4">
                <FaHistory className="text-gray-500" /> Recent Transactions
              </p>

              {walletData?.transferReqDTO?.length ? (
                <div className="w-full">
                  <div className="hidden md:grid grid-cols-4 font-semibold text-gray-700 px-5 py-3 bg-gray-100 rounded-t-xl border border-gray-200">
                    <div className="text-left">Amount</div>
                    <div className="text-left">To User</div>
                    <div className="text-left">Bank</div>
                    <div className="text-center">Status</div>
                  </div>

                  <div className="space-y-3 group">
                    {walletData.transferReqDTO
                      .slice(0, visibleCount)
                      .map((transfer, index) => (
                        <div
                          key={index}
                          className="grid md:grid-cols-4 grid-cols-1 md:items-center px-1 md:px-5 py-4 bg-blue-50 mt-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 group-hover:opacity-40 hover:!opacity-100 hover:bg-blue-100 hover:scale-[1.03] hover:shadow-md"
                        >
                          <div className="hidden md:block text-gray-800 font-medium">
                            {transfer.amount}
                          </div>
                          <div className="hidden md:block text-gray-800">
                            {transfer.toUser}
                          </div>
                          <div className="hidden md:block text-gray-600 text-sm">
                            {transfer.bankName}
                          </div>
                          <div className="hidden md:flex justify-center">
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                transfer.status === "TRANSFER_DONE"
                                  ? "bg-green-100 text-green-600"
                                  : transfer.status === "TRANSFER_DECLIENED"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-yellow-100 text-yellow-600"
                              }`}
                            >
                              {formatStatus(transfer.status)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>

                  {walletData.transferReqDTO.length > visibleCount && (
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 10)}
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
