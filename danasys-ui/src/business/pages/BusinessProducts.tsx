import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BusinessProfileSelector from "../components/BusinessProfileSelector";
import BusinessProductList from "../components/BusinessProductList";
import BusinessProductForm from "../components/BusinessProductForm";

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

const BusinessProducts: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profiles, setProfiles] = useState<BusinessProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Add/Update form states
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Bulk selection states
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [editedProducts, setEditedProducts] = useState<Record<number, Product>>(
    {}
  );

  // User roles and search
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userName, setUserName] = useState("");

  // ✅ New: search triggered state
  const [searchTriggered, setSearchTriggered] = useState(false);

  const isMyProductActive = location.pathname === "/business/products";
  const isManageProductActive =
    location.pathname === "/business/manage-products";

  // Fetch Profiles for My Products
  useEffect(() => {
    const fetchUserAndProfiles = async () => {
      setLoadingProfiles(true);
      setError(null);
      try {
        const userRes = await fetch("/api/user/getUserDetails");
        if (!userRes.ok) throw new Error("Failed to fetch user details");
        const userData = await userRes.json();
        setUserRoles(userData.roles || []);

        // For ROLE_SUPERADMIN: Don't load profiles automatically, wait for search
        // For all other roles: Load profiles automatically
        if (!userRoles.includes("ROLE_SUPERADMIN")) {
          const userProfileId = userData.userProfileId;
          const res = await fetch(
            `/api/user/loadUserBusinessProfileById?userProfileId=${userProfileId}`
          );
          if (!res.ok) throw new Error("Failed to fetch business profiles");
          const data = await res.json();
          setProfiles(data);
          setSearchTriggered(true); // Non-SUPERADMIN roles ke liye default true
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoadingProfiles(false);
      }
    };
    fetchUserAndProfiles();
  }, []);

  // Fetch Profiles for ROLE_SUPERADMIN on userName change
  useEffect(() => {
    if (userRoles.includes("ROLE_SUPERADMIN") && userName.trim() && searchTriggered) {
      const fetchProfiles = async () => {
        setLoadingProfiles(true);
        setError(null);
        try {
          const res = await fetch(
            `/api/user/loadUserBusinessProfile?userName=${userName}`
          );
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
    }
  }, [userName, userRoles, searchTriggered]);

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
    setSelectedProduct(product);
    setShowForm(true);
  };

  // Add Product
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowForm(true);
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

      if (!res.ok)
        throw new Error(typeof data === "string" ? data : "Bulk update failed");

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
        {(userRoles.includes("ROLE_BUSINESS_USER_MGR") || userRoles.includes("ROLE_BUSINESS_USER")) && (
          <button
            onClick={() => navigate("/business/manage-products")}
            className={`px-4 py-2 font-medium ${
              isManageProductActive
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Product Manager
          </button>
        )}
      </div>

      {/* ✅ Show Form if open */}
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
          {(isMyProductActive || isManageProductActive) && (
            <div className="space-y-6">
              {userRoles.includes("ROLE_SUPERADMIN") && (
                <div className="flex items-center gap-4 mb-6">
                  <label className="font-medium">Search with Username</label>
                  <input
                    type="text"
                    placeholder="Enter Username"
                    value={userName}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUserName(value);

                      if (value.trim() === "") {
                        setSearchTriggered(false); // clear hone par dropdown hide
                        setProfiles([]);           // profiles bhi clear ho jaye
                        setSelectedProfile(null);  // selected profile reset
                      }
                    }}
                    className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    onClick={() => {
                      if (userName.trim() !== "") {
                        setSearchTriggered(true);   // valid search → dropdown dikhao
                      } else {
                        setSearchTriggered(false);  // empty → dropdown hide
                        setProfiles([]);
                        setSelectedProfile(null);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Search
                  </button>
                </div>
              )}

             {/* ✅ Business Profile Selector tabhi dikhega jab:
    1) ROLE_SUPERADMIN na ho, ya
    2) ROLE_SUPERADMIN ho aur searchTriggered true ho + userName empty na ho
*/}
{(!userRoles.includes("ROLE_SUPERADMIN") ||
  (userRoles.includes("ROLE_SUPERADMIN") && searchTriggered && userName.trim() !== "")) && (
  <BusinessProfileSelector
    profiles={profiles}
    selectedProfile={selectedProfile}
    setSelectedProfile={setSelectedProfile}
    loadingProfiles={loadingProfiles}
    error={error}
  />
)}

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
                  showSearch={userRoles.includes("ROLE_SUPERADMIN") || userRoles.includes("ROLE_SUPERADMIN_MGR")}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BusinessProducts;
