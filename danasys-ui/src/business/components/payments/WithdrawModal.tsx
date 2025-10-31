import React, { useState, useEffect } from "react";

interface BankAccount {
  id: number;
  bankName: string;
  accountNumber: number;
}

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: string, bankId: number, comment: string) => void;
  banks: BankAccount[];
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  onWithdraw,
  banks,
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState<number | "">("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (isOpen) {
      setWithdrawAmount("");
      setSelectedBank("");
      setComment("");
    }
  }, [isOpen]);

  const handleWithdraw = () => {
    if (selectedBank !== "") {
      onWithdraw(withdrawAmount, selectedBank as number, comment);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50 animate-fadeIn">
      <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl w-[90%] max-w-md p-6 md:p-8 transition-transform transform scale-100 animate-slideUp">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          💸 Withdraw Funds
        </h2>

        <div className="space-y-5">
          {/* Amount Input */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Amount
            </label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full border border-gray-300 bg-white/70 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter amount"
            />
          </div>

          {/* Bank Dropdown */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Select Bank
            </label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(Number(e.target.value) || "")}
              className="w-full border border-gray-300 bg-white/70 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Choose bank</option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  🏦 {bank.bankName} - {bank.accountNumber}
                </option>
              ))}
            </select>
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
              onClick={handleWithdraw}
              className="px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
            >
              Withdraw
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

export default WithdrawModal;
