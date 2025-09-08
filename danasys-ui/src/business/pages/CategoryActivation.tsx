import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaEdit } from "react-icons/fa";

const CategoryActivation: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Update Category
  const handleUpdate = async (cat: any) => {
    try {
      const res = await fetch("/api/admin/updateCategory", {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: cat.id,
          categoryName: cat.categoryName,
          description: cat.description,
          status: cat.status,
          image: cat.image || "string",
          theemColorCode: cat.theemColorCode || "#000000",
        }),
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
          typeof data === "string" ? data : data.message || cat.categoryName
        }`
      );

      fetchCategories();
    } catch (err: any) {
      alert(`Error updating category: ${err.message}`);
    }
  };

  // ✅ Activate Category
  const handleActivate = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/approveCategory/${id}/approve`, {
        method: "PUT",
        headers: { accept: "*/*" },
      });

      if (!res.ok) throw new Error("Failed to activate category");

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      alert(
        `Category activated: ${
          typeof data === "string" ? data : data.message || id
        }`
      );

      fetchCategories();
    } catch (err: any) {
      alert(`Error activating category: ${err.message}`);
    }
  };

  // ✅ Deactivate Category
  const handleDeactivate = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/removeCategory/${id}/remove`, {
        method: "PUT",
        headers: { accept: "*/*" },
      });

      if (!res.ok) throw new Error("Failed to deactivate category");

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      alert(
        `Category deactivated: ${
          typeof data === "string" ? data : data.message || id
        }`
      );

      fetchCategories();
    } catch (err: any) {
      alert(`Error deactivating category: ${err.message}`);
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
            {categories.map((cat, index) => (
              <div
                key={cat.id ?? `category-${index}`}
                className="grid grid-cols-4 items-center px-5 py-4 bg-white mt-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300
                group-hover:opacity-40 hover:!opacity-100 hover:bg-blue-50 hover:scale-[1.03] hover:shadow-md"
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
                    onClick={() => handleUpdate(cat)}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-full transition"
                  >
                    <FaEdit /> Update
                  </button>
                  <button
                    onClick={() => handleActivate(cat.id)}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 rounded-full transition"
                  >
                    <FaCheckCircle /> Activate
                  </button>
                  <button
                    onClick={() => handleDeactivate(cat.id)}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-full transition"
                  >
                    <FaTimesCircle /> Deactivate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <p className="text-gray-600">No categories found.</p>
      )}
    </div>
  );
};

export default CategoryActivation;
