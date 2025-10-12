import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ActiveOrderTab from '../components/orders/ActiveOrderTab';
import TrackOrderTab from '../components/orders/TrackOrderTab';
import OrderHistoryTab from '../components/orders/OrderHistoryTab';
import MyOrderTab from '../components/orders/MyOrderTab';

const BusinessOrders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'track' | 'history' | 'myorder'>('active');
  const [roles, setRoles] = useState<string[]>([]);

  const tabs = [
    { key: 'active', label: 'Active Order' },
    { key: 'track', label: 'Track Order' },
    { key: 'history', label: 'Order History' },
    { key: 'myorder', label: 'My Order' },
  ];

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get('/api/user/getUserDetails');
        setRoles(res.data.roles || []);
      } catch (err) {
        console.error('Error fetching roles:', err);
      }
    };
    fetchRoles();
  }, []);

  const filteredTabs = tabs.filter(tab => {
    if (tab.key === 'history' || tab.key === 'myorder') {
      return roles.includes('ROLE_BUSINESS_USER_MGR') || roles.includes('ROLE_BUSINESS_USER');
    }
    return true;
  });

  useEffect(() => {
    if (!filteredTabs.some(tab => tab.key === activeTab)) {
      setActiveTab('active');
    }
  }, [filteredTabs, activeTab]);

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
          {filteredTabs.map((tab) => (
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
