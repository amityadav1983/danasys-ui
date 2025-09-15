import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import BusinessProductForm from "../components/BusinessProductForm";
import BusinessProductList from "../components/BusinessProductList";

interface BusinessProfile {
  id: number;
  ownerName: string;
  storeName: string;
  businessLogoPath?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
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

  // ✅ Add/Update form states
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ✅ Bulk selection states
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [editedProducts, setEditedProducts] = useState<Record<number, Product>>(
    {}
  );

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

  // Handlers for Add, Update, Delete
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleUpdateProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

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
        data = JSON.parse(text);
      } catch {
        data = text;
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

      {showForm ? (
        <BusinessProductForm
            onClose={() => {
              setShowForm(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
            profileId={selectedProfile}
            onSuccess={() => {
              setShowForm(false);
              setSelectedProduct(null);
              if (selectedProfile) {
                // reload products
                fetch(`/api/product/userBusinessProductList/${selectedProfile}`)
                  .then((res) => res.json())
                  .then((data) => setProducts(data));
              }
            }}
          />
      ) : (
        <>
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
                <BusinessProductList
                  filteredProducts={filteredProducts}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleAddProduct={handleAddProduct}
                  selectedProducts={selectedProducts}
                  setSelectedProducts={setSelectedProducts}
                  editedProducts={editedProducts}
                  setEditedProducts={setEditedProducts}
                  handleInlineChange={handleInlineChange}
                  handleBulkUpdate={handleBulkUpdate}
                  handleUpdateProduct={handleUpdateProduct}
                  handleDeleteProduct={handleDeleteProduct}
                  loadingProducts={loadingProducts}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageProduct;
