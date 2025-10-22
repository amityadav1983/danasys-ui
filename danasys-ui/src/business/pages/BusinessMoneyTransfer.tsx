import React, { useState } from 'react';
import PendingTransferRequest from '../moneytransfer/PendingTransferRequest';
import TransferHistory from '../moneytransfer/TransferHistory';

const BusinessMoneyTransfer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending-request' | 'transfer-history'>('pending-request');
  const [showMore, setShowMore] = useState(false);
  const [tabOrder, setTabOrder] = useState<string[]>(['pending-request', 'transfer-history']);

  const tabs = [
    { key: 'pending-request', label: 'Pending Transfer Request', component: <PendingTransferRequest /> },
    { key: 'transfer-history', label: 'Transfer History', component: <TransferHistory /> },
  ];

  const visibleTabs = tabs.slice(0, 2);
  const moreTabs = tabs.slice(2);

  const handleMoreTabClick = (tabKey: string) => {
    const newOrder = [...tabOrder];
    const selectedIndex = newOrder.indexOf(tabKey);
    const first = newOrder[0];
    const second = newOrder[1];
    newOrder[0] = tabKey;
    newOrder[1] = first;
    newOrder[selectedIndex] = second;
    setTabOrder(newOrder);
    setActiveTab(tabKey as any);
    setShowMore(false);
  };

  return (
    <div className="px-6 py-6 pl-0 pr-6 md:pl-6">
      <h1 className="text-2xl font-bold mb-6 mt-20">Money Transfer</h1>

      <div className="mb-6">
        {/* ✅ Desktop Tabs */}
        <div className="hidden md:flex space-x-4 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-4 font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ✅ Mobile Tabs */}
        <div className="md:hidden relative">
          <div className="flex space-x-4 border-b">
            {visibleTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-5 font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-500 hover:text-blue-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
            {moreTabs.length > 0 && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="py-2 px-4 font-medium text-gray-500 hover:text-blue-500 transition-all duration-200"
              >
                More ▾
              </button>
            )}
          </div>

          {/* ✅ Dropdown for Mobile */}
          <div
            className={`absolute right-0 mt-1 w-48 rounded-xl border border-gray-200 bg-white/90 backdrop-blur-md shadow-lg transform transition-all duration-300 ease-in-out origin-top-right ${
              showMore
                ? 'opacity-100 translate-y-0 scale-100 visible'
                : 'opacity-0 -translate-y-2 scale-95 invisible'
            }`}
          >
            {moreTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleMoreTabClick(tab.key)}
                className="block w-full text-left py-2 px-4 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Tab Content */}
      <div className="tab-content">
        {tabs.find((tab) => tab.key === activeTab)?.component}
      </div>
    </div>
  );
};

export default BusinessMoneyTransfer;
