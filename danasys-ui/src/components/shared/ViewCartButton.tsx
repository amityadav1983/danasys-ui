import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { showCart } from '../../store/ui';

const ViewCartButton = () => {
  const { cartItems, totalQuantity, billAmount } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  // Don't show button if cart is empty
  if (totalQuantity === 0) {
    return null;
  }

  const handleViewCart = () => {
    dispatch(showCart());
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <button
        onClick={handleViewCart}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg font-medium transition-all duration-200 flex items-center gap-6 min-w-[320px]"
      >
        {/* Left Section - Cart Icon */}
        <div className="flex items-center">
          <FaShoppingCart className="text-white text-2xl" />
        </div>

        {/* Middle Section - Item Count and Price */}
        <div className="flex flex-col items-start">
          <span className="text-white text-sm font-medium">
            {totalQuantity} {totalQuantity === 1 ? 'Item' : 'Items'}
          </span>
          <span className="text-white text-sm font-bold">
            ₹ {billAmount}
          </span>
        </div>

        {/* Right Section - View Cart Text and Arrow */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-white text-lg font-semibold">View Cart</span>
          <svg 
            className="w-4 h-4 text-white" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default ViewCartButton;
