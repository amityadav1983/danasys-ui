import React, { useState } from 'react';
import ActiveOrderTab from '../components/orders/ActiveOrderTab';
import TrackOrderTab from '../components/orders/TrackOrderTab';
import OrderHistoryTab from '../components/orders/OrderHistoryTab';
import MyOrderTab from '../components/orders/MyOrderTab';

const BusinessOrders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'track' | 'history' | 'myorder'>('active');

  const tabs = [
    { key: 'active', label: 'Active Order' },
    { key: 'track', label: 'Track Order' },
    { key: 'history', label: 'Order History' },
    { key: 'myorder', label: 'My Order' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'active':
        return <ActiveOrderTab />;
      case 'track':
        return <TrackOrderTab />;
      case 'history':
        return <OrderHistoryTab />;
      case 'myorder':
        return <MyOrderTab />;
      default:
        return <ActiveOrderTab />;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 mt-20">Orders</h1>
      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-4 font-medium ${
                activeTab === tab.key
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
        {renderTabContent()}
      </div>
    </div>
  );
};

export default BusinessOrders;
