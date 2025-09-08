import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaEdit } from "react-icons/fa";
import CategoryActivation from "./CategoryActivation";

const Activation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"service" | "category">("service");
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Service Areas
  const fetchServiceAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/allRegisteredServiceAreas", {
        method: "GET",
        headers: { accept: "*/*" },
      });
      if (!response.ok) throw new Error("Failed to fetch service areas");
      const data = await response.json();
      setAreas(data);
    } catch (err: any) {
      setError(err.message || "Error fetching service areas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "service") {
      fetchServiceAreas();
    }
  }, [activeTab]);

// Activate Area
const handleActivate = async (id: number) => {
  try {
    const res = await fetch(`/api/admin/approveServiceArea/${id}/approve`, {
      method: "PUT",
      headers: { accept: "*/*" },
    });

    const data = await res.json(); // ✅ response ko parse karna
    if (!res.ok) throw new Error(data.message || "Failed to activate area");

    console.log("Activate Response:", data);
    alert(JSON.stringify(data, null, 2)); // ✅ pura response alert me
    fetchServiceAreas();
  } catch (err: any) {
    alert(err.message || "Error activating area");
  }
};

// Deactivate Area
// Deactivate Area
const handleDeactivate = async (id: number) => {
  try {
    const res = await fetch(`/api/admin/removeServiceArea/${id}/remove`, {
      method: "PUT",
      headers: { accept: "*/*" },
    });

    const data = await res.text(); // ✅ plain text response
    if (!res.ok) throw new Error(data);

    console.log("Deactivate Response:", data);
    alert(data); // ✅ text alert
    fetchServiceAreas();
  } catch (err: any) {
    alert(err.message || "Error deactivating area");
  }
};

// Update Area
const handleUpdate = async (id: number) => {
  try {
    const res = await fetch(`/api/admin/updateServiceArea`, {
      method: "POST", // ✅ backend expects POST, not PUT
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      body: JSON.stringify({
        id: id,
        fullAddress: "Updated Address", 
        pinCode: 123456, // backend expects number, not string
        district: "Updated District",
        state: "Updated State", // backend requires state
        status: "ACTIVE",
        productCategories: [], // backend requires array, even if empty
      }),
    });

    if (!res.ok) throw new Error("Failed to update area");
    alert("Service area updated!");
    fetchServiceAreas();
  } catch (err: any) {
    alert(err.message || "Error updating area");
  }
};



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Activation</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("service")}
          className={`px-4 py-2 font-medium ${
            activeTab === "service"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Service Area Activation
        </button>
        <button
          onClick={() => setActiveTab("category")}
          className={`px-4 py-2 font-medium ${
            activeTab === "category"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Category Activation
        </button>
      </div>

      {/* Service Area Tab */}
      {activeTab === "service" && (
        <div className=" p-6">
          {loading && <p className="text-gray-600">Loading service areas...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && areas.length > 0 && (
            <div className="w-full">
              {/* Table Header */}
              <div className="grid grid-cols-5 font-semibold text-gray-700 px-5 py-3 bg-gray-100 rounded-t-xl border border-gray-200">
                <div className="text-left">Full Address</div>
                <div className="text-left">Pin Code</div>
                <div className="text-left">District</div>
                <div className="text-left">Status</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="space-y-3 group">
                {areas.map((a) => (
                  <div
                    key={a.id}
                    className="grid grid-cols-5 items-center px-5 py-4 bg-white mt-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300
                group-hover:opacity-40 hover:!opacity-100 hover:bg-blue-50 hover:scale-[1.03] hover:shadow-md"
                  >
                    <div className="text-gray-800">{a.fullAddress}</div>
                    <div className="text-gray-600">{a.pinCode}</div>
                    <div className="text-gray-600">{a.district}</div>
                    <div
                      className={`text-sm font-medium ${
                        a.status === "ACTIVE" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {a.status}
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleUpdate(a.id)}
                        className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-full transition"
                      >
                        <FaEdit /> Update
                      </button>
                      <button
                        onClick={() => handleActivate(a.id)}
                        className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 rounded-full transition"
                      >
                        <FaCheckCircle /> Activate
                      </button>
                      <button
                        onClick={() => handleDeactivate(a.id)}
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

          {!loading && !error && areas.length === 0 && (
            <p className="text-gray-600">No service areas found.</p>
          )}
        </div>
      )}

      {/* Category Activation Tab */}
      {activeTab === "category" && <CategoryActivation />}
    </div>
  );
};

export default Activation;
