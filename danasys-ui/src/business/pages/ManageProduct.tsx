import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ManageProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab based on current path
  const isMyProductActive = location.pathname === "/business/products";
  const isManageProductActive = location.pathname === "/business/manage-products";

  return (
    <div className="p-6 pt-20 bg-white">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => navigate("/business/products")}
          className={`px-4 py-2 font-medium ${
            isMyProductActive
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          My Product
        </button>
        <button
          onClick={() => navigate("/business/manage-products")}
          className={`px-4 py-2 font-medium ${
            isManageProductActive
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Manage Product
        </button>
      </div>

      {/* Tab Content */}
      {isManageProductActive && (
        <div className="p-6 text-gray-600">
          <p>Manage Product content will go here...</p>
          {/* Add your Manage Product content here */}
        </div>
      )}
    </div>
  );
};

export default ManageProduct;
