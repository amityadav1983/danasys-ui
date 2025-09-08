import React from "react";

const BusinessHome = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Business Dashboard</h1>
      <p className="mb-4 text-gray-600">
        Quick tools and insights for your stores. This view is optimized for merchants and store managers.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Today's Orders</h2>
          <p className="text-3xl font-bold">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Revenue</h2>
          <p className="text-3xl font-bold">$1,240</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Active Stores</h2>
          <p className="text-3xl font-bold">8</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Products for this category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { name: "Organic Apples", price: "$4.99" },
          { name: "Banana Bunch (6)", price: "$2.99" },
          { name: "Whole Wheat Bread", price: "$1.79" },
        ].map((product, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
            <div className="w-full h-32 bg-blue-100 rounded-md mb-4 flex items-center justify-center">
              <span className="text-blue-500 text-lg font-semibold">Image</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-purple-700 font-bold mb-4">{product.price}</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessHome;
