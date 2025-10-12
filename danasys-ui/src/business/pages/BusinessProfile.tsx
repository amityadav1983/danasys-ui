import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddBusinessProfileForm from "../components/AddBusinessProfileForm";
import UpdateBusinessProfileForm from "../components/UpdateBusinessProfileForm";
import ManageProfile from "./ManageProfile";
import MyManager from "./MyManager";
import { authService } from "../../services/auth";

const searchRoles = ["ROLE_SUPERADMIN", "ROLE_SUPERADMIN_MGR"];
const directLoadRoles = ["ROLE_BUSINESS_USER_MGR", "ROLE_BUSINESS_USER", "ROLE_USER"];

const BusinessProfile = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"my" | "manage" | "manager">("my");
  const [userRoles, setUserRoles] = useState<string[]>([]);

  // Fetch user details on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await authService.getUserDetails() as any;
        const roles = user.roles || [];
        console.log('User roles:', roles);
        setUserRoles(roles);
        if (roles.some((role: string) => directLoadRoles.includes(role))) {
          console.log('User has direct load roles, fetching user profile details...');
          // For direct load roles, get user profile details first
          const profileResponse = await fetch('/api/user/getUserDetails');
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const userProfileId = profileData.userProfileId;
            console.log('User profile ID:', userProfileId);
            fetchProfilesById(userProfileId);
          } else {
            console.error('Failed to get user profile details');
          }
        } else {
          console.log('User does not have direct load roles');
        }
      } catch (err) {
        console.error('Failed to fetch user details:', err);
      }
    };
    fetchUserDetails();
  }, []);



  // Fetch Business Profiles by userName (for search roles)
  const fetchProfiles = async (searchName: string) => {
    console.log('fetchProfiles called with searchName:', searchName);
    setLoading(true);
    setError(null);
    try {
      const url = `/api/user/loadUserBusinessProfile?userName=${encodeURIComponent(searchName)}`;
      console.log('Fetching from URL:', url);
      const response = await fetch(url);
      console.log('Response status:', response.status);
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
      console.log('Fetched data:', data);
      setProfiles(data);
      if (data.length === 0 && searchName.trim() !== '') {
        setError("No user found");
      } else {
        setError(null);
      }
    } catch (err: any) {
      console.error('Error in fetchProfiles:', err);
      setError(err.message || "Failed to fetch profiles");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Business Profiles by userProfileId (for direct load roles)
  const fetchProfilesById = async (userProfileId: number) => {
    console.log('fetchProfilesById called with userProfileId:', userProfileId);
    setLoading(true);
    setError(null);
    try {
      const url = `/api/user/loadUserBusinessProfileById?userProfileId=${userProfileId}`;
      console.log('Fetching from URL:', url);
      const response = await fetch(url);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setProfiles(data);
      setError(null);
    } catch (err: any) {
      console.error('Error in fetchProfilesById:', err);
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
      if (userRoles.some((role: string) => directLoadRoles.includes(role))) {
        // For direct load roles, refresh using userProfileId
        const profileResponse = await fetch('/api/user/getUserDetails');
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          fetchProfilesById(profileData.userProfileId);
        }
      } else {
        fetchProfiles(userName); // For search roles, refresh with current search
      }
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
          onSuccess={async () => {
            if (userRoles.some((role: string) => directLoadRoles.includes(role))) {
              // For direct load roles, refresh using userProfileId
              const profileResponse = await fetch('/api/user/getUserDetails');
              if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                fetchProfilesById(profileData.userProfileId);
              }
            } else {
              fetchProfiles(userName); // For search roles, refresh with current search
            }
          }}
        />
      ) : (
        <AddBusinessProfileForm
          onClose={() => {
            setShowForm(false);
            setSelectedProfile(null);
          }}
          onSuccess={async () => {
            if (userRoles.some((role: string) => directLoadRoles.includes(role))) {
              // For direct load roles, refresh using userProfileId
              const profileResponse = await fetch('/api/user/getUserDetails');
              if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                fetchProfilesById(profileData.userProfileId);
              }
            } else {
              fetchProfiles(userName); // For search roles, refresh with current search
            }
          }}
        />
      )
    ) : (
      <>
        {/* Tabs */}
        <div className="flex items-center justify-between border-b mb-6">
          <div className="flex mr-4">
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

          {/* Add button for all users who can add profiles, except in Manager of Profile tab */}
          {(userRoles.some((role: string) => searchRoles.includes(role)) ||
            userRoles.some((role: string) => directLoadRoles.includes(role))) &&
            activeTab !== "manage" && (
            <button
              className="bg-blue-600 text-white rounded-md px-3 py-2 flex items-center self-start hover:bg-blue-700 transition-colors"
              aria-label="Add new item"
              onClick={() => setShowForm(true)}
            >
              <FaPlus className="mr-2" />
              Add
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === "my" && (
          <>
          {/* Search for search roles */}
          {userRoles.some((role: string) => searchRoles.includes(role)) && (
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

        {activeTab === "manage" && (
          <>
            {/* Show search bar only if user has required roles */}
            {userRoles.some((role: string) => searchRoles.includes(role)) && (
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
              </div>
            )}
            <ManageProfile />
          </>
        )}

        {activeTab === "manager" && (
          <>
            {/* Show search bar only if user has required roles */}
            {userRoles.some((role: string) => searchRoles.includes(role)) && (
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
              </div>
            )}
            <MyManager />
          </>
        )}
      </>
    )}
  </div>
);

};

export default BusinessProfile;
