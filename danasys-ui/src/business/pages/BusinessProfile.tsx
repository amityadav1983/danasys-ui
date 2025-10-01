import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddBusinessProfileForm from "../components/AddBusinessProfileForm";
import UpdateBusinessProfileForm from "../components/UpdateBusinessProfileForm";
import ManageProfile from "./ManageProfile";
import { authService } from "../../services/auth";

const BusinessProfile = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"my" | "manage" | "manager">("my");
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch user details on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await authService.getUserDetails() as any;
        setUserRole(user.role || null);
        if (user.role === 'user') {
          fetchProfiles(''); // Fetch all profiles for user role
        }
      } catch (err) {
        console.error('Failed to fetch user details:', err);
      }
    };
    fetchUserDetails();
  }, []);



  // Fetch Business Profiles
  const fetchProfiles = async (searchName: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/user/loadUserBusinessProfile?userName=${encodeURIComponent(
          searchName
        )}`
      );
      if (!response.ok) {
        if (response.status === 400) {
          setError("No user found");
          setProfiles([]);
          setLoading(false);
          return;
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }
      const data = await response.json();
      setProfiles(data);
      if (data.length === 0 && searchName.trim() !== '') {
        setError("No user found");
      } else {
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch profiles");
    } finally {
      setLoading(false);
    }
  };

  // Add / Update handler
 // Add / Update handler
const handleUpdate = (profile: any) => {
  setSelectedProfile(profile); // Keep addresses for pre-filling in update form
  setShowForm(true);
};


  // Delete profile API
  const handleDelete = async (profileId: number) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;

    try {
      const res = await fetch(
        `/api/user/removeUserBusinessProfile/${profileId}`,
        {
          method: "PUT",
          headers: {
            Accept: "*/*",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to remove profile");
      }

      alert("Profile removed successfully!");
      userRole === 'user' ? fetchProfiles('') : fetchProfiles(userName); // Refresh after delete
    } catch (err: any) {
      alert(err.message || "Error removing profile");
    }
  };

 return (
  <div className="p-6 bg-white h-screen overflow-auto">
    <h1 className="text-2xl font-bold mb-6 mt-20">Business Profiles</h1>

    {/* Agar form open hai to sirf form show hoga */}
    {showForm ? (
      selectedProfile ? (
        <UpdateBusinessProfileForm
          onClose={() => {
            setShowForm(false);
            setSelectedProfile(null);
          }}
          profile={selectedProfile}
          onSuccess={() => userRole === 'user' ? fetchProfiles('') : fetchProfiles(userName)}
        />
      ) : (
        <AddBusinessProfileForm
          onClose={() => {
            setShowForm(false);
            setSelectedProfile(null);
          }}
          onSuccess={() => userRole === 'user' ? fetchProfiles('') : fetchProfiles(userName)}
        />
      )
    ) : (
      <>
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab("my")}
            className={`px-4 py-2 font-medium ${
              activeTab === "my"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-4 py-2 font-medium ${
              activeTab === "manage"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Profile Manager
          </button>
          <button
            onClick={() => setActiveTab("manager")}
            className={`px-4 py-2 font-medium ${
              activeTab === "manager"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            My Manager
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "my" && (
          <>
            {/* Search + Add - Hide if role is 'user' */}
            {userRole !== 'user' && (
              <div className="flex items-center gap-4 mb-6">
                <label className="font-medium">Search with Email / Mobile</label>
                <input
                  type="text"
                  placeholder="Enter Email or Mobile"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    setError(null);
                  }}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  className="bg-green-600 text-white rounded-md px-4 py-2 flex items-center hover:bg-green-700 transition-colors"
                  aria-label="Search"
                  onClick={() => fetchProfiles(userName)}
                >
                  Search
                </button>

                <button
                  className="bg-blue-600 text-white rounded-md px-4 py-2 ml-auto flex items-center hover:bg-blue-700 transition-colors"
                  aria-label="Add new item"
                  onClick={() => setShowForm(true)}
                >
                  <FaPlus className="mr-2" />
                  Add
                </button>
              </div>
            )}

            {/* Add button for user role */}
            {userRole === 'user' && (
              <div className="flex justify-end mb-6">
                <button
                  className="bg-blue-600 text-white rounded-md px-4 py-2 flex items-center hover:bg-blue-700 transition-colors"
                  aria-label="Add new item"
                  onClick={() => setShowForm(true)}
                >
                  <FaPlus className="mr-2" />
                  Add
                </button>
              </div>
            )}

            {/* Results */}
            {loading && <p>Loading...</p>}
            {error && <p className="text-gray-500 bg-gray-100 p-2 rounded">{error}</p>}

            {!loading && profiles.length > 0 && (
              <div className="w-full">
                {/* Table Header */}
                <div className="grid grid-cols-4 font-semibold text-gray-700 px-5 py-3 bg-gray-100 rounded-t-xl border border-gray-200">
                  <div className="text-left">Logo / Owner</div>
                  <div className="text-left">Address</div>
                  <div className="text-center">Category</div>
                  <div className="text-right">Actions</div>
                </div>

                {/* Table Body */}
                <div className="space-y-3 group">
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="grid grid-cols-4 items-center px-5 py-4 bg-blue-50 mt-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300
                        group-hover:opacity-40 hover:!opacity-100 hover:bg-blue-100 hover:scale-[1.04] hover:shadow-md"
                    >
                      {/* Logo + Owner */}
                      <div className="flex items-center gap-3">
                        <img
                          src={profile.businessLogoPath}
                          alt="Logo"
                          className="h-10 w-10 rounded-full border object-cover"
                        />
                        <span className="font-medium text-gray-800">
                          {profile.ownerName}
                        </span>
                      </div>

                      {/* Address */}
                      <div className="text-gray-600 text-sm">
                        {profile.addresses?.[0] ? (
                          <>
                            {profile.addresses[0].fullAddress}
                            {profile.addresses[0].serviceArea?.fullAddress && (
                              <> | {profile.addresses[0].serviceArea.fullAddress.split(',')[0].trim()}</>
                            )}
                          </>
                        ) : "—"}
                      </div>

                      {/* Category */}
                      <div className="text-center">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
                          {profile.category?.categoryName || "—"}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleUpdate(profile)}
                          className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-full transition"
                        >
                          <FaEdit /> Update
                        </button>
                        <button
                          onClick={() => handleDelete(profile.id)}
                          className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-full transition"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "manage" && <ManageProfile />}
      </>
    )}
  </div>
);

};

export default BusinessProfile;
