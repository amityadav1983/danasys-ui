import React, { useState } from 'react';
import PendingTransferRequest from '../moneytransfer/PendingTransferRequest';
import TransferHistory from '../moneytransfer/TransferHistory';

const BusinessMoneyTransfer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending-request');

  const tabs = [
    { id: 'pending-request', label: 'Pending Transfer Request', component: <PendingTransferRequest /> },
    { id: 'transfer-history', label: 'Transfer History', component: <TransferHistory /> },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 mt-20">Money Transfer</h1>
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

export default BusinessMoneyTransfer;
