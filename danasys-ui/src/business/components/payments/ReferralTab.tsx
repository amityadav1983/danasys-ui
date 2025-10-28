import React, { useEffect, useState } from "react";
import { FaWallet, FaHistory } from "react-icons/fa";
import api from "../../../services/api";

interface TransactionDTO {
  amount: string;
  type: string;
  orderId: number;
  transactionDatel: string;
}

interface ReferralData {
  currentBalance: number;
  transferReqDTO: any[];
  transactionDTO: TransactionDTO[];
}

const ReferralTab: React.FC = () => {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  const [userName, setUserName] = useState("");
  const [searchedUserId, setSearchedUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/api/user/getUserDetails");
        setRoles(res.data.roles || []);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const userProfileId =
          searchedUserId || localStorage.getItem("userProfileId") || "1";

        const response = await fetch(
          `/api/payment/getClearedReferalPoint/${userProfileId}`,
          {
            method: "GET",
            headers: { accept: "*/*" },
          }
        );

        const data: ReferralData = await response.json();
        setReferralData(data);
      } catch (error) {
        console.error("Error fetching referral data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [searchedUserId]);

  const handleSearch = async () => {
    if (!userName.trim()) return;
    try {
      const res = await api.get(
        `/api/user/loadUserBusinessProfile?userName=${encodeURIComponent(
          userName
        )}`
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

  const isSuper =
    roles.includes("ROLE_SUPERADMIN") || roles.includes("ROLE_SUPERADMIN_MGR");

  return (
    <div className="p-1 md:p-6">
      {isSuper && (
        <div className="mb-6 flex w-full md:w-2/3 gap-2">
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

      <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading referral points...</p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-500 text-sm">Referral Points</p>
                <p className="text-3xl font-bold text-green-600">
                  {referralData?.currentBalance || 0}
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition">
                Redeem Points
              </button>
            </div>

            <hr className="my-4" />

            <div>
              <p className="flex items-center gap-2 text-gray-700 font-semibold mb-4">
                <FaHistory className="text-gray-500" /> Recent Referrals
              </p>

              {referralData?.transactionDTO?.length ? (
                <div className="w-full">
                  {/* Desktop Table */}
                  <div className="hidden md:grid grid-cols-4 font-semibold text-gray-700 px-5 py-3 bg-gray-100 rounded-t-xl border border-gray-200">
                    <div className="text-left">Amount</div>
                    <div className="text-left">Type</div>
                    <div className="text-left">Order ID</div>
                    <div className="text-center">Date</div>
                  </div>

                  {/* Responsive Cards (Mobile) */}
                  <div className="space-y-4 md:space-y-3 group">
                    {referralData.transactionDTO.map((transaction, index) => (
                      <div
                        key={index}
                        className="md:grid md:grid-cols-4 md:items-center px-5 py-4 bg-blue-50 mt-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 group-hover:opacity-40 hover:!opacity-100 hover:bg-blue-100 hover:scale-[1.05] hover:shadow-md flex flex-col md:flex-none gap-1"
                      >
                        {/* Amount */}
                        <div className="text-gray-800 font-medium flex justify-between w-full md:block">
                          <span className="font-semibold md:hidden">Amount:</span>
                          <span>{transaction.amount}</span>
                        </div>

                        {/* Type */}
                        <div className="text-gray-800 text-sm sm:text-base flex justify-between md:block break-words whitespace-pre-wrap max-w-full w-full">
                          <span className="font-semibold md:hidden shrink-0">Type:</span>
                          <span className="break-all text-right md:text-left w-full ml-2">
                            {transaction.type.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Order ID */}
                        <div className="text-gray-600 text-sm flex justify-between w-full md:block">
                          <span className="font-semibold md:hidden">Order ID:</span>
                          <span>{transaction.orderId}</span>
                        </div>

                        {/* Date */}
                        <div className="text-gray-600 text-sm flex justify-between w-full md:block">
                          <span className="font-semibold md:hidden">Date:</span>
                          <span>
                            {new Date(transaction.transactionDatel).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No referrals yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReferralTab;
