import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaEdit } from "react-icons/fa";
import CategoryActivation from "./CategoryActivation";

interface ServiceArea {
  id: number;
  fullAddress: string;
  pinCode: number;
  district: string;
  state: string;
  status: string;
}

const Activation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"service" | "category">("service");
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);
  const [formData, setFormData] = useState<ServiceArea | null>(null);

  // Status dropdown states
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [userProfileId, setUserProfileId] = useState<number | null>(null);

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

  // On component mount, fetch userProfileId and then fetch status options
  React.useEffect(() => {
    (async () => {
      const profileId = await fetchUserDetails();
      if (profileId) {
        await fetchBusinessDashboard(profileId);
      }
    })();
  }, []);

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

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to activate area");

      alert("Activated Successfully!");
      fetchServiceAreas();
    } catch (err: any) {
      alert(err.message || "Error activating area");
    }
  };

  // Deactivate Area
  const handleDeactivate = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/removeServiceArea/${id}/remove`, {
        method: "PUT",
        headers: { accept: "*/*" },
      });

      const data = await res.text();
      if (!res.ok) throw new Error(data);

      alert("Deactivated Successfully!");
      fetchServiceAreas();
    } catch (err: any) {
      alert(err.message || "Error deactivating area");
    }
  };

  // Open Update Modal
  const openUpdateModal = (area: ServiceArea) => {
    setSelectedArea(area);
    setFormData({ ...area }); // prefill with existing values
    setShowModal(true);
  };

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Save Update
  const handleSaveUpdate = async () => {
    if (!formData) return;

    try {
      const res = await fetch(`/api/admin/updateServiceArea`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          ...formData,
          pinCode: Number(formData.pinCode), // ensure number
          productCategories: [], // required by backend
        }),
      });

      if (!res.ok) throw new Error("Failed to update area");

      alert("Service area updated!");
      setShowModal(false);
      setSelectedArea(null);
      fetchServiceAreas();
    } catch (err: any) {
      alert(err.message || "Error updating area");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mt-20 mb-4">Activation</h1>

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
          Service Area
        </button>
        <button
          onClick={() => setActiveTab("category")}
          className={`px-4 py-2 font-medium ${
            activeTab === "category"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Category
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
                    className="grid grid-cols-5 items-center px-5 py-4 bg-blue-50 mt-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300
                group-hover:opacity-40 hover:!opacity-100 hover:bg-blue-100 hover:scale-[1.03] hover:shadow-md"
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
                        onClick={() => openUpdateModal(a)}
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

      {/* Update Modal */}
      {showModal && formData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Update Service Area</h2>

            <div className="space-y-3">
              <input
                type="text"
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleChange}
                placeholder="Full Address"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="number"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="Pin Code"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="District"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUpdate}
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

export default Activation;
