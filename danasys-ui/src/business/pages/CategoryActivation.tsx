import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";

interface Category {
  id: number;
  categoryName: string;
  description: string;
  status: string;
  image?: string;
  theemColorCode?: string;
}

const CategoryActivation: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // Status dropdown states
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [userProfileId, setUserProfileId] = useState<number | null>(null);

  // ✅ Fetch Categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/allRegisteredProductCategory", {
        method: "GET",
        headers: { accept: "*/*" },
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details to get userProfileId
  const fetchUserDetails = async () => {
    try {
      const res = await fetch("/api/user/getUserDetails", {
        method: "GET",
        headers: { accept: "*/*" },
      });
      if (!res.ok) throw new Error("Failed to fetch user details");
      const data = await res.json();
      if (data.userProfileId) {
        setUserProfileId(data.userProfileId);
        return data.userProfileId;
      }
      throw new Error("userProfileId not found in response");
    } catch (err: any) {
      console.error("Error fetching user details:", err.message);
      return null;
    }
  };

  // Fetch business dashboard to get status array
  const fetchBusinessDashboard = async (profileId: number) => {
    try {
      const res = await fetch(`/api/user/loadBusinessDashboard/${profileId}`, {
        method: "GET",
        headers: { accept: "*/*" },
      });
      if (!res.ok) throw new Error("Failed to fetch business dashboard");
      const data = await res.json();
      if (data.status && Array.isArray(data.status)) {
        setStatusOptions(data.status);
      } else {
        console.warn("Status array not found in business dashboard response");
      }
    } catch (err: any) {
      console.error("Error fetching business dashboard:", err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
    // On component mount, fetch userProfileId and then fetch status options
    (async () => {
      const profileId = await fetchUserDetails();
      if (profileId) {
        await fetchBusinessDashboard(profileId);
      }
    })();
  }, []);

  // ✅ Save Updated Category
  const handleSave = async () => {
    if (!selectedCategory) return;
    try {
      const res = await fetch("/api/admin/updateCategory", {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedCategory),
      });

      if (!res.ok) throw new Error("Failed to update category");

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      alert(
        `Category updated successfully: ${
          typeof data === "string" ? data : data.message || selectedCategory.categoryName
        }`
      );

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(`Error updating category: ${err.message}`);
    }
  };



  return (
    <div className="p-6">
      {loading && <p className="text-gray-600">Loading categories...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && categories.length > 0 && (
        <div className="w-full">
          {/* Table Header */}
          <div className="grid grid-cols-4 font-semibold text-gray-700 px-5 py-3 bg-gray-100 rounded-t-xl border border-gray-200">
            <div className="text-left">Category Name</div>
            <div className="text-left">Description</div>
            <div className="text-left">Status</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="space-y-3 group">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="grid grid-cols-4 items-center px-5 py-4 bg-blue-50 mt-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300
                group-hover:opacity-40 hover:!opacity-100 hover:bg-blue-100 hover:scale-[1.03] hover:shadow-md"
              >
                <div className="text-gray-800">{cat.categoryName}</div>
                <div className="text-gray-600">{cat.description || "-"}</div>
                <div
                  className={`text-sm font-medium ${
                    cat.status === "ACTIVE" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {cat.status}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-full transition"
                  >
                    <FaEdit /> Update
                  </button>
                  {/* Toggle Status */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cat.status === "ACTIVE"}
                      onChange={async (e) => {
                        const isChecked = e.target.checked;
                        try {
                          const res = await fetch(
                            `/api/admin/approveCategory/${cat.id}/approve?isApprove=${isChecked}`,
                            {
                              method: "PUT",
                              headers: { accept: "*/*" },
                            }
                          );
                          const data = await res.text();
                          if (!res.ok) throw new Error(data);
                          alert(`${isChecked ? "Activated" : "Deactivated"} Successfully!`);
                          fetchCategories();
                        } catch (err: any) {
                          alert(err.message || `Error ${isChecked ? "activating" : "deactivating"} category`);
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <p className="text-gray-600">No categories found.</p>
      )}

      {/* ✅ Update Modal */}
      {isModalOpen && selectedCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Update Category</h2>

            <div className="space-y-3">
              <input
                type="text"
                value={selectedCategory.categoryName}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    categoryName: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                placeholder="Category Name"
              />
              <textarea
                value={selectedCategory.description}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    description: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                placeholder="Description"
              />
              <select
                value={selectedCategory.status}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    status: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {/* <input
                type="text"
                value={selectedCategory.image || ""}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    image: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
                placeholder="Image URL"
              /> */}
              {/* <input
                type="color"
                value={selectedCategory.theemColorCode || "#000000"}
                onChange={(e) =>
                  setSelectedCategory({
                    ...selectedCategory,
                    theemColorCode: e.target.value,
                  })
                }
                className="w-16 h-10 border rounded"
              /> */}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryActivation;
