import React, { useState } from 'react';
import WalletTab from '../components/payments/WalletTab';
import PendingWalletTab from '../components/payments/PendingWalletTab';
import ReferralTab from '../components/payments/ReferralTab';
import PendingReferralTab from '../components/payments/PendingReferralTab';

const BusinessPayments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [showMore, setShowMore] = useState(false);
  const [tabOrder, setTabOrder] = useState<string[]>([
    'wallet',
    'pending-wallet',
    'referral',
    'pending-referral',
  ]);

  const tabs = [
    { id: 'wallet', label: 'Wallet', component: <WalletTab /> },
    { id: 'pending-wallet', label: 'Pending Wallet', component: <PendingWalletTab /> },
    { id: 'referral', label: 'Referral', component: <ReferralTab /> },
    { id: 'pending-referral', label: 'Pending Referral', component: <PendingReferralTab /> },
  ];

  // ✅ Keep tab order consistent for mobile
  const orderedTabs = tabs.sort(
    (a, b) => tabOrder.indexOf(a.id) - tabOrder.indexOf(b.id)
  );

  const visibleTabs = orderedTabs.slice(0, 2);
  const moreTabs = orderedTabs.slice(2);

  const handleMoreTabClick = (tabId: string) => {
    const newOrder = [...tabOrder];
    const selectedIndex = newOrder.indexOf(tabId);
    const first = newOrder[0];
    const second = newOrder[1];
    newOrder[0] = tabId;
    newOrder[1] = first;
    newOrder[selectedIndex] = second;
    setTabOrder(newOrder);
    setActiveTab(tabId);
    setShowMore(false);
  };

  return (
    <div className="px-4 md:px-6 py-6 pl-0 md:pl-6">
      {/* ✅ Page Title */}
      <h1 className="text-2xl font-bold mb-6 mt-20">Payments</h1>

      {/* ✅ Tabs Section */}
      <div className="mb-6">
        {/* ✅ Desktop Tabs */}
        <div className="hidden md:flex space-x-4 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 font-medium transition-all duration-200 ${
                activeTab === tab.id
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
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-5 font-medium transition-all duration-200 ${
                  activeTab === tab.id
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

          {/* ✅ Animated Dropdown for More Tabs */}
          <div
            className={`absolute right-0 mt-1 w-44 rounded-xl border border-gray-200 bg-white/90 backdrop-blur-md shadow-lg transform transition-all duration-300 ease-in-out origin-top-right ${
              showMore
                ? 'opacity-100 translate-y-0 scale-100 visible'
                : 'opacity-0 -translate-y-2 scale-95 invisible'
            }`}
          >
            {moreTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleMoreTabClick(tab.id)}
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
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default BusinessPayments;
