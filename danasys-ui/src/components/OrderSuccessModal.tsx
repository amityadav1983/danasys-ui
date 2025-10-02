import React from 'react';
import { FaCheckCircle, FaShoppingBag } from 'react-icons/fa';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { hide as hideModal } from '../store/modal';
import { useNavigate } from 'react-router-dom';

interface OrderSuccessData {
  orderId: string;
  totalAmount: number;
}

const OrderSuccessModal = ({ data }: { data: OrderSuccessData }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    dispatch(hideModal());
  };

  const handleViewOrders = () => {
    dispatch(hideModal());
    navigate('/orders');
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
      <div className="text-center">
        <FaCheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Order Placed Successfully!
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Your order has been placed and is being processed.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Order ID:</span>
            <span className="text-sm text-gray-900 font-mono">{data.orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total Amount:</span>
            <span className="text-lg font-bold text-green-600">₹{data.totalAmount}</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300"
          >
            Continue Shopping
          </button>
          <button
            onClick={handleViewOrders}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center justify-center"
          >
            <FaShoppingBag className="mr-2" size={14} />
            Order Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal; 