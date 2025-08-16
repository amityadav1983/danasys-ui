import { useState } from "react";
import { FaBriefcase, FaShoppingCart } from "react-icons/fa"; // 👈 Cart icon use kiya

const DeliveryToggle = () => {
  const [isWork, setIsWork] = useState(false); // Default Shopping

  return (
    <div className="flex items-center justify-center">
      <div
        className={`relative w-24 h-12 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
          isWork ? "bg-gray-200" : "bg-blue-100"
        }`}
        onClick={() => setIsWork(!isWork)}
      >
        {/* Circle Slider */}
        <div
          className={`absolute w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300 ${
            isWork ? "translate-x-0" : "translate-x-12"
          }`}
        >
          {isWork ? (
            <FaBriefcase className="text-black text-lg" />
          ) : (
            <FaShoppingCart className="text-black text-lg" /> // 👈 Buyer feel
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryToggle;
