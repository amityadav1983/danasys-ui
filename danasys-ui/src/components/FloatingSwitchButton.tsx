import React from "react";
import { FaShoppingBag, FaShoppingCart } from "react-icons/fa";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { setMode } from "../store/mode";
import { showCart } from "../store/ui";

const FloatingSwitchButton = () => {
  const dispatch = useAppDispatch();
  const currentMode = useAppSelector((state) => state.mode.currentMode);
  const { totalQuantity } = useAppSelector((state) => state.cart);

  const handleSwitchToBusiness = () => {
    console.log('Switch to Business button clicked');
    console.log('Current mode before switch:', currentMode);
    dispatch(setMode('business'));
    console.log('Mode switched to business');
  };

  const handleCartClick = () => {
    dispatch(showCart());
  };

  return (
    <>
      {/* Switch to Business Button - Show when in user mode */}
      {currentMode === 'user' && (
        <div className="fixed bottom-6 right-6 z-[999999] pointer-events-none">
          <button
            onClick={handleSwitchToBusiness}
            className="pointer-events-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-4 border-white"
            style={{ zIndex: 999999 }}
          >
            <div className="flex items-center gap-2">
              <FaShoppingBag size={18} />
              <span className="text-sm font-bold">Switch to Business</span>
            </div>
          </button>
        </div>
      )}

      {/* Cart Button - Shows when there are items in cart */}
      {totalQuantity > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[999998]">
          <button
            onClick={handleCartClick}
            className="pointer-events-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg font-medium transition-all duration-200 flex items-center gap-6 min-w-[320px]"
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
                View Cart
              </span>
            </div>

            {/* Right Section - Arrow */}
            <div className="flex items-center gap-2 ml-auto">
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
      )}
    </>
  );
};

export default FloatingSwitchButton;
