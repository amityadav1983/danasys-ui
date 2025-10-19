import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ActiveOrderTab from '../components/orders/ActiveOrderTab';
import TrackOrderTab from '../components/orders/TrackOrderTab';
import OrderHistoryTab from '../components/orders/OrderHistoryTab';
import MyOrderTab from '../components/orders/MyOrderTab';

const BusinessOrders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'track' | 'history' | 'myorder'>('active');
  const [roles, setRoles] = useState<string[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [tabOrder, setTabOrder] = useState<string[]>(['active', 'track', 'history', 'myorder']);

  const tabs = [
    { key: 'active', label: 'Active Order' },
    { key: 'track', label: 'Track Order' },
    { key: 'history', label: 'Order History' },
    // { key: 'myorder', label: 'My Order' },
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

  const orderedTabs = filteredTabs.sort((a, b) => tabOrder.indexOf(a.key) - tabOrder.indexOf(b.key));

  const visibleTabs = orderedTabs.slice(0, 2);
  const moreTabs = orderedTabs.slice(2);

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
    <div className="px-6 py-6 pl-0 pr-6 md:pl-6">
      <h1 className="text-2xl font-bold mb-6 mt-20">Orders</h1>

      <div className="mb-6">
        {/* ✅ Desktop Tabs */}
        <div className="hidden md:flex space-x-4 border-b">
          {filteredTabs.map((tab) => (
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

          {/* ✅ Animated Dropdown */}
          <div
            className={`absolute right-0 mt-1 w-40 rounded-xl border border-gray-200 bg-white/90 backdrop-blur-md shadow-lg transform transition-all duration-300 ease-in-out origin-top-right ${
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
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default BusinessOrders;
