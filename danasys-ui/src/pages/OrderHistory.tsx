import React, { useEffect } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { OrderHistory as OrderHistoryType } from '../utils/types';
import { FaShoppingBag, FaCalendarAlt, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';
import { format } from 'date-fns';

const OrderHistory = () => {
  const orders = useAppSelector((state) => state.orders.orders);

  // Sample data for demonstration
  const sampleOrders: OrderHistoryType[] = [
    {
      orderId: 'ORD-001',
      date: '2024-01-15',
      items: [
        {
          product: {
            id: '1',
            title: 'Fresh Milk',
            subTitle: '1L Pack',
            image: '/public/categories/1.avif',
            price: 70,
            mrp: 75,
          },
          quantity: 2,
          price: 140,
        },
        {
          product: {
            id: '2',
            title: 'Brown Bread',
            subTitle: '400g',
            image: '/public/categories/2.avif',
            price: 45,
            mrp: 50,
          },
          quantity: 1,
          price: 45,
        },
      ],
      totalAmount: 185,
      status: 'delivered',
      deliveryAddress: '123 Main Street, Delhi',
      estimatedDelivery: '2024-01-16',
    },
    {
      orderId: 'ORD-002',
      date: '2024-01-10',
      items: [
        {
          product: {
            id: '3',
            title: 'Organic Eggs',
            subTitle: '12 pieces',
            image: '/public/categories/3.avif',
            price: 120,
            mrp: 130,
          },
          quantity: 1,
          price: 120,
        },
      ],
      totalAmount: 120,
      status: 'processing',
      deliveryAddress: '456 Park Avenue, Delhi',
      estimatedDelivery: '2024-01-12',
    },
  ];

  const getStatusColor = (status: OrderHistoryType['status']) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaShoppingBag className="mr-3 text-blue-600" />
              Order History
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Track all your past orders and deliveries
            </p>
          </div>

          <div className="p-6">
            {orders.length === 0 && (
              <div className="text-center py-12">
                <FaShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-4">Add items to your cart and place an order to see your order history here</p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Start Shopping
                </button>
              </div>
            )}

            <div className="space-y-6">
              {(orders.length > 0 ? orders : sampleOrders).map((order) => (
                <div key={order.orderId} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderId}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FaCalendarAlt className="mr-1" />
                          {formatDate(order.date)}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-16 h-16 rounded-md object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">{item.product.title}</h4>
                            <p className="text-sm text-gray-500">{item.product.subTitle}</p>
                            <p className="text-sm text-gray-900">
                              Qty: {item.quantity} × ₹{item.product.price}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaMapMarkerAlt className="mr-2" />
                          <span className="truncate">{order.deliveryAddress}</span>
                        </div>
                        <div className="flex items-center text-lg font-semibold text-gray-900">
                          <FaRupeeSign className="mr-1" />
                          {order.totalAmount}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
