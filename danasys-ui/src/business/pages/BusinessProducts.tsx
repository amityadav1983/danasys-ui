import React, { useEffect, useState } from "react";
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

const BusinessProducts: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Add/Update Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    offerPrice: "",
    category: "",
    quantity: "",
    description: "",
    moreAbout: "",
    starRating: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 🔎 Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Tabs
  const isMyProductActive = location.pathname === "/business/products";
  const isManageProductActive =
    location.pathname === "/business/manage-products";

  // Fetch Profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoadingProfiles(true);
      setError(null);
      try {
        const res = await fetch(`/api/user/loadUserBusinessProfile?userName=`);
        if (!res.ok) throw new Error("Failed to fetch business profiles");
        const data = await res.json();
        setProfiles(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoadingProfiles(false);
      }
    };
    fetchProfiles();
  }, []);

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

  // ----------------- Delete Product -----------------
  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/product/removeProduct/${productId}`, {
        method: "DELETE",
        headers: { Accept: "*/*" },
      });

      const responseText = await res.text(); // raw response
      console.log("Delete API Response:", responseText);
      alert(responseText);

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (err: any) {
      alert(err.message || "Error deleting product");
    }
  };

  // ----------------- Update Product -----------------
  const handleUpdateProduct = (product: Product) => {
    setIsUpdateMode(true);
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      price: String(product.offerPrice), // adjust if you have real price
      offerPrice: String(product.offerPrice),
      category: product.category,
      quantity: "0",
      description: "",
      moreAbout: "",
      starRating: "",
    });
    setShowAddModal(true);
  };

  // ----------------- Add Product -----------------
  const handleAddProduct = () => {
    setIsUpdateMode(false);
    setEditingProductId(null);
    setFormData({
      name: "",
      price: "",
      offerPrice: "",
      category: "",
      quantity: "",
      description: "",
      moreAbout: "",
      starRating: "",
    });
    setFile(null);
    setShowAddModal(true);
  };

  // ----------------- Submit (Add / Update) -----------------
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return alert("Please select a profile first");
    if (!file && !isUpdateMode) return alert("Please upload an image");

    setSubmitting(true);
    try {
      const data = new FormData();
      if (file) data.append("file", file);

      // Shared fields
      data.append("id", String(isUpdateMode ? editingProductId : 0));
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("offerPrice", formData.offerPrice);
      data.append("category", formData.category);
      data.append("quantity", formData.quantity);
      data.append("description", formData.description);
      data.append("image", file ? file.name : "");
      data.append("moreAbout", formData.moreAbout);
      data.append("userBusinessProfileId", String(selectedProfile));
      data.append("status", "ACTIVE");
      data.append("version", "0");
      data.append("starRating", formData.starRating);

      const url = isUpdateMode
        ? `/api/product/updateProduct`
        : `/api/product/addProduct`;

      const res = await fetch(url, {
        method: "POST",
        body: data,
      });

      const responseJson = await res.json();
      console.log(
        `${isUpdateMode ? "Update" : "Add"} API Response:`,
        responseJson
      );
      alert(JSON.stringify(responseJson));

      if (!res.ok) throw new Error("Failed to save product");

      if (isUpdateMode) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProductId
              ? { ...p, ...formData, offerPrice: Number(formData.offerPrice) }
              : p
          )
        );
      } else {
        setProducts((prev) => [...prev, responseJson]);
      }

      // Reset
      setShowAddModal(false);
      setFormData({
        name: "",
        price: "",
        offerPrice: "",
        category: "",
        quantity: "",
        description: "",
        moreAbout: "",
        starRating: "",
      });
      setFile(null);
      setIsUpdateMode(false);
      setEditingProductId(null);
    } catch (err: any) {
      alert(err.message || "Error saving product");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔎 Filter products
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 pt-20">
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
      {isMyProductActive && (
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
              {/* Search Bar + Add Product Button */}
              <div className="flex justify-between items-center mb-4">
                {/* Search */}
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
                          {/* Add */}
                          <button
                            onClick={handleAddProduct}
                            className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 rounded-full transition"
                          >
                            <FaPlus /> Add
                          </button>
                          {/* Update */}
                          <button
                            onClick={() => handleUpdateProduct(product)}
                            className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-full transition"
                          >
                            <FaEdit /> Update
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
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

      {/* Add / Update Product Form (Modal full screen) */}
      {showAddModal && (
        <div className="absolute inset-0 bg-gray-50 z-40 flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
            <h2 className="text-xl font-bold text-gray-800">
              {isUpdateMode ? "Update Product" : "Add New Product"}
            </h2>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-gray-600 hover:text-red-500 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-6">
            <form
              onSubmit={handleSubmitProduct}
              id="product-form"
              className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6 space-y-6"
            >
              {/* Input fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="border rounded-lg px-4 py-2 w-full"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  className="border rounded-lg px-4 py-2 w-full"
                />
                <input
                  type="number"
                  placeholder="Offer Price"
                  value={formData.offerPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, offerPrice: e.target.value })
                  }
                  required
                  className="border rounded-lg px-4 py-2 w-full"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                  className="border rounded-lg px-4 py-2 w-full"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                  className="border rounded-lg px-4 py-2 w-full"
                />
                <input
                  type="number"
                  placeholder="Star Rating"
                  value={formData.starRating}
                  onChange={(e) =>
                    setFormData({ ...formData, starRating: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2 w-full"
                />
              </div>

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border rounded-lg px-4 py-2 w-full"
              />
              <textarea
                placeholder="More About"
                value={formData.moreAbout}
                onChange={(e) =>
                  setFormData({ ...formData, moreAbout: e.target.value })
                }
                className="border rounded-lg px-4 py-2 w-full"
              />

              {/* File Upload */}
              <div>
                <label className="block mb-2 font-medium">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="border rounded-lg px-4 py-2 w-full"
                  required={!isUpdateMode}
                />
              </div>
            </form>
          </div>

          {/* Sticky Footer */}
          <div className="px-6 py-4 bg-white shadow flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button

              type="submit"
              form="product-form"
              disabled={submitting}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {submitting
                ? isUpdateMode
                  ? "Updating..."
                  : "Adding..."
                : isUpdateMode
                ? "Update Product"
                : "Add Product"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessProducts;
