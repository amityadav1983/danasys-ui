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
  price: number;        // ✅ Added MRP
  offerPrice: number;
  category: string;
  image: string;
  quantity: number;
  description?: string;
  moreAbout?: string;
  status?: string;
  version?: number;
  starRating?: number;
  userBusinessProfileId?: number;
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

  // Add/Update Modal
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

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Bulk selection states
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [editedProducts, setEditedProducts] = useState<Record<number, Product>>(
    {}
  );

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

  // Fetch Products
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

  // Delete Product
  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/product/removeProduct/${productId}`, {
        method: "DELETE",
        headers: { Accept: "*/*" },
      });

      const responseText = await res.text();
      alert(responseText);

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (err: any) {
      alert(err.message || "Error deleting product");
    }
  };

  // Update Product (Single)
  const handleUpdateProduct = (product: Product) => {
    setIsUpdateMode(true);
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      price: String(product.price),
      offerPrice: String(product.offerPrice),
      category: product.category,
      quantity: String(product.quantity),
      description: product.description || "",
      moreAbout: product.moreAbout || "",
      starRating: String(product.starRating || ""),
    });
    setShowAddModal(true);
  };

  // Add Product
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

  // Submit Add/Update
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return alert("Please select a profile first");
    if (!file && !isUpdateMode) return alert("Please upload an image");

    setSubmitting(true);
    try {
      const data = new FormData();
      if (file) data.append("file", file);

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
      alert(JSON.stringify(responseJson));

      if (!res.ok) throw new Error("Failed to save product");

      if (isUpdateMode) {
        setProducts((prev) =>
  prev.map((p) =>
    selectedProducts.includes(p.id)
      ? {
          ...p,
          ...editedProducts[p.id],
          offerPrice: Number(editedProducts[p.id].offerPrice),
          price: Number(editedProducts[p.id].price),
          quantity: Number(editedProducts[p.id].quantity),
          starRating: Number(editedProducts[p.id].starRating), // 👈 fix here
        }
      : p
  )
);

      } else {
        setProducts((prev) => [...prev, responseJson]);
      }

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

  // ✅ Handle Checkbox Select
  const toggleSelectProduct = (product: Product) => {
    if (selectedProducts.includes(product.id)) {
      setSelectedProducts((prev) => prev.filter((id) => id !== product.id));
      const { [product.id]: _, ...rest } = editedProducts;
      setEditedProducts(rest);
    } else {
      setSelectedProducts((prev) => [...prev, product.id]);
      setEditedProducts((prev) => ({ ...prev, [product.id]: { ...product } }));
    }
  };

  // ✅ Handle Inline Edit
  const handleInlineChange = (
    productId: number,
    field: keyof Product,
    value: string | number
  ) => {
    setEditedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

 // ✅ Bulk Update API
const handleBulkUpdate = async () => {
  if (!selectedProfile || selectedProducts.length < 2) return;
  try {
    const body = selectedProducts.map((id) => editedProducts[id]);
    const res = await fetch(
      `/api/product/bulkUpdateProducts/${selectedProfile}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const text = await res.text();

    let data: any;
    try {
      data = JSON.parse(text); // agar JSON mila toh parse
    } catch {
      data = text; // agar plain text hai toh as-is rakho
    }

    if (!res.ok) throw new Error(typeof data === "string" ? data : "Bulk update failed");

    alert(typeof data === "string" ? data : "Bulk update successful");

    setProducts((prev) =>
      prev.map((p) =>
        selectedProducts.includes(p.id) ? editedProducts[p.id] : p
      )
    );

    setSelectedProducts([]);
    setEditedProducts({});
  } catch (err: any) {
    alert(err.message || "Bulk update failed");
  }
};


  // Filter products
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 mt-20">Products</h1>

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
              {/* Search + Add */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2 w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Search by name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition">
                    Search
                  </button>
                </div>
                <button
                  onClick={handleAddProduct}
                  className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  + Add Product
                </button>
              </div>

              {/* Table */}
              {!loadingProducts && filteredProducts.length > 0 ? (
                <div className="w-full relative">
                  {/* Header */}
                  <div className="grid grid-cols-6 font-semibold text-gray-700 px-5 py-3 bg-gray-100 rounded-t-xl border border-gray-200">
                    <div></div>
                    <div className="text-left">Image / Name</div>
                    <div className="text-left">MRP</div>
                    <div className="text-left">Offer Price</div>
                    <div className="text-left">Quantity</div>
                    <div className="text-right">Actions</div>
                  </div>

                  {/* Rows */}
                  <div className="space-y-3">
                    {filteredProducts.map((product) => {
                      const isSelected = selectedProducts.includes(product.id);
                      const editable = editedProducts[product.id] || product;
                      return (
                        <div
                          key={product.id}
                          className="grid grid-cols-6 items-center px-5 py-4 bg-blue-50 rounded-xl border border-gray-200 shadow-sm"
                        >
                          {/* Checkbox */}
                          <div>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectProduct(product)}
                            />
                          </div>

                          {/* Image + Name */}
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt="Product"
                              className="h-10 w-10 rounded-full border object-cover"
                            />
                            <span className="font-medium text-gray-800">
                              {product.name}
                            </span>
                          </div>

                          {/* MRP */}
                          <div>
                            {isSelected ? (
                              <input
                                type="number"
                                value={editable.price}
                                onChange={(e) =>
                                  handleInlineChange(
                                    product.id,
                                    "price",
                                    Number(e.target.value)
                                  )
                                }
                                className="border rounded px-2 py-1 w-20"
                              />
                            ) : (
                              <span>₹{product.price}</span>
                            )}
                          </div>

                          {/* Offer Price */}
                          <div>
                            {isSelected ? (
                              <input
                                type="number"
                                value={editable.offerPrice}
                                onChange={(e) =>
                                  handleInlineChange(
                                    product.id,
                                    "offerPrice",
                                    Number(e.target.value)
                                  )
                                }
                                className="border rounded px-2 py-1 w-20"
                              />
                            ) : (
                              <span>₹{product.offerPrice}</span>
                            )}
                          </div>

                          {/* Quantity */}
                          <div>
                            {isSelected ? (
                              <input
                                type="number"
                                value={editable.quantity}
                                onChange={(e) =>
                                  handleInlineChange(
                                    product.id,
                                    "quantity",
                                    Number(e.target.value)
                                  )
                                }
                                className="border rounded px-2 py-1 w-20"
                              />
                            ) : (
                              <span>{product.quantity}</span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleUpdateProduct(product)}
                              disabled={selectedProducts.length > 1}
                              className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full transition ${
                                selectedProducts.length > 1
                                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  : "text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                              }`}
                            >
                              <FaEdit /> Update
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-full transition"
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ✅ Bulk Update Button */}
                  {selectedProducts.length > 1 && (
                    <div className="fixed bottom-6 right-6">
                      <button
                        onClick={handleBulkUpdate}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
                      >
                        Bulk Update ({selectedProducts.length})
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                !loadingProducts && <p>No products found.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add/Update Modal */}
      {showAddModal && (
        <div className="absolute inset-0 bg-gray-50 z-40 flex flex-col overflow-y-auto">
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
          <div className="flex-1 p-6">
            <form
              onSubmit={handleSubmitProduct}
              id="product-form"
              className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2"
                  required
                />
                <input
                  type="number"
                  placeholder="MRP"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Offer Price"
                  value={formData.offerPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, offerPrice: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Star Rating"
                  value={formData.starRating}
                  onChange={(e) =>
                    setFormData({ ...formData, starRating: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2 col-span-2"
                  rows={2}
                />
                <textarea
                  placeholder="More About Product"
                  value={formData.moreAbout}
                  onChange={(e) =>
                    setFormData({ ...formData, moreAbout: e.target.value })
                  }
                  className="border rounded-lg px-4 py-2 col-span-2"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </form>
          </div>
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-4 shadow-md">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="product-form"
              disabled={submitting}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {submitting
                ? isUpdateMode
                  ? "Updating..."
                  : "Adding..."
                : isUpdateMode
                ? "Update"
                : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessProducts;
