import React, { useState } from 'react';
import WalletTab from '../components/payments/WalletTab';
import PendingWalletTab from '../components/payments/PendingWalletTab';
import ReferralTab from '../components/payments/ReferralTab';
import PendingReferralTab from '../components/payments/PendingReferralTab';

const BusinessPayments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('wallet');

  const tabs = [
    { id: 'wallet', label: 'Wallet', component: <WalletTab /> },
    { id: 'pending-wallet', label: 'Pending Wallet', component: <PendingWalletTab /> },
    { id: 'referral', label: 'Referral', component: <ReferralTab /> },
    { id: 'pending-referral', label: 'Pending Referral', component: <PendingReferralTab /> },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 mt-20">Payments</h1>
      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="tab-content">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default BusinessPayments;
