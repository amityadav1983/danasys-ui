import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

interface BusinessProfile {
  id: number;
  ownerName: string;
  storeName: string;
  businessLogoPath?: string;
}

interface Product {
  id: number;
  name: string;
  offerPrice: number;
  category: string;
  image: string;
}

const ManageProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab based on current path
  const isMyProductActive = location.pathname === "/business/products";
  const isManageProductActive = location.pathname === "/business/manage-products";

  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔎 Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Managed Profiles
  useEffect(() => {
    const fetchManagedProfiles = async () => {
      setLoadingProfiles(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/user/getManagedUserBusinessProfiles`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setProfiles(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch managed profiles");
      } finally {
        setLoadingProfiles(false);
      }
    };
    if (isManageProductActive) {
      fetchManagedProfiles();
    }
  }, [isManageProductActive]);

  // Fetch Products when profile changes
  useEffect(() => {
    if (!selectedProfile) return;

    const fetchProducts = async () => {
      setLoadingProducts(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/product/userBusinessProductList/${selectedProfile}`
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [selectedProfile]);

  // 🔎 Filter products
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="space-y-6">
          {/* Dropdown */}
          <div className="w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Business Profile
            </label>

            {loadingProfiles && (
              <p className="text-gray-500">Loading profiles...</p>
            )}
            {error && <p className="text-red-500">{error}</p>}

            {!loadingProfiles && profiles.length > 0 ? (
              <select
                value={selectedProfile ?? ""}
                onChange={(e) => setSelectedProfile(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  -- Choose a business profile --
                </option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.storeName || profile.ownerName}
                  </option>
                ))}
              </select>
            ) : (
              !loadingProfiles && <p>No profiles found.</p>
            )}
          </div>

          {/* Product List */}
          {selectedProfile && (
            <div>
              {/* Search Bar */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2 w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Search by name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Products */}
              {!loadingProducts && filteredProducts.length > 0 ? (
                <div className="w-full">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 font-semibold text-gray-700 px-5 py-3 bg-gray-100 rounded-t-xl border border-gray-200">
                    <div className="text-left">Image / Name</div>
                    <div className="text-left">Offer Price</div>
                    <div className="text-center">Category</div>
                    <div className="text-right">Actions</div>
                  </div>

                  {/* Table Body */}
                  <div className="space-y-3 group">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="grid grid-cols-4 items-center px-5 py-4 bg-blue-50 mt-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300
                          group-hover:opacity-40 hover:!opacity-100 hover:bg-blue-100 hover:scale-[1.02] hover:shadow-md"
                      >
                        {/* Image + Name */}
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt="Product"
                            className="h-10 w-10 rounded-full border object-cover"
                          />
                          <span className="font-medium text-gray-800">
                            {product.name.replace(/\.[^/.]+$/, "")}
                          </span>
                        </div>

                        {/* Offer Price */}
                        <div className="text-gray-800 font-bold">
                          ₹{product.offerPrice}
                        </div>

                        {/* Category */}
                        <div className="text-center">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
                            {product.category || "—"}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2">
                          <button
                            className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 rounded-full transition"
                          >
                            <FaPlus /> Add
                          </button>
                          <button
                            className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-full transition"
                          >
                            <FaEdit /> Update
                          </button>
                          <button
                            className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-full transition"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                !loadingProducts && <p>No products found.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageProduct;
