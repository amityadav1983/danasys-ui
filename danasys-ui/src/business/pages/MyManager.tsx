import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const MyManager = () => {
  const [userProfileId, setUserProfileId] = useState<number | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch UserProfileId and then Managed Profiles
  const fetchManagedProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: get userProfileId
      const userRes = await fetch("/api/user/getUserDetails");
      if (!userRes.ok) throw new Error("Failed to fetch user details");
      const userData = await userRes.json();
      const userProfileIdFromApi = userData.userProfileId;
      setUserProfileId(userProfileIdFromApi);

      // Step 2: fetch managed profiles with userProfileId
      const response = await fetch(
        `/api/user/getUserBusinessProfileMangers/${userProfileIdFromApi}?userProfileId=${userProfileIdFromApi}`,
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagedProfiles();
  }, []);

  // ✅ Handler for "No More Manager"
  const handleRemoveManager = async () => {
    if (!userProfileId) {
      setError('User profile ID not available');
      return;
    }
    setError(null);
    try {
      const response = await fetch(`/api/user/removeBusinessManager/${userProfileId}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to remove manager: ${response.statusText}`);
      }
      // Success, refetch the managed profiles
      await fetchManagedProfiles();
    } catch (err: any) {
      setError(err.message || 'Failed to remove manager');
    }
  };

  return (
    <div className="p-6 md:p-6 p-2">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && profiles.length > 0 && (
        <div className="w-full">
          {/* Desktop Table Header */}
          <div className="hidden md:grid md:grid-cols-5 font-semibold text-gray-700 px-5 py-3 bg-gray-100 rounded-t-xl border border-gray-200">
            <div className="text-left">Profile</div>
            <div className="text-left">Manager Name</div>
            <div className="text-left">Store Name</div>
            <div className="text-center">Contact</div>
            <div className="text-center">Action</div>
          </div>

          {/* Desktop Table Body */}
          <div className="hidden md:block space-y-3 group">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="grid grid-cols-5 items-center px-5 py-4 bg-blue-50 mt-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300
                  group-hover:opacity-40 hover:!opacity-100 hover:bg-blue-100 hover:scale-[1.06] hover:shadow-md"
              >
                {/* Logo */}
                <div className="flex items-center gap-3">
                  <img
                    src={profile.userProfilePicture}
                    alt="Logo"
                    className="h-10 w-10 rounded-full border object-cover"
                  />
                </div>

                {/* Owner Name */}
                <div className="text-gray-800">{profile.fullname}</div>

                {/* Store Name */}
                <div className="text-gray-600 text-sm">
                  {profile.storeName || "—"}
                </div>

                {/* Category */}
                <div className="text-center">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
                    {profile.contactInfo || "—"}
                  </span>
                </div>

                {/* Action */}
                <div className="flex justify-center">
                  <button
                    onClick={() => handleRemoveManager()}
                    className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  >
                    <FaTrash size={14} />
                    <span className="text-xs font-medium">No More Manager</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-3">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-blue-50 rounded-xl border border-gray-200 shadow-sm p-4 transition-all duration-300 hover:bg-blue-100 hover:scale-[1.02] hover:shadow-md w-11/12 min-h-32"
              >
                {/* Top Row: Profile Pic + Manager Name | Contact */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.userProfilePicture}
                      alt="Profile"
                      className="h-12 w-12 rounded-full border object-cover"
                    />
                    <span className="font-medium text-gray-800">
                      {profile.fullname}
                    </span>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
                    {profile.contactInfo || "—"}
                  </span>
                </div>

                {/* Store Name (bold) */}
                <div className="font-bold text-gray-700 mb-3">
                  {profile.storeName || "—"}
                </div>

                {/* Action Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => handleRemoveManager()}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  >
                    <FaTrash size={16} />
                    <span className="text-sm font-medium">No More Manager</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && profiles.length === 0 && !error && (
        <p>No managed profiles found.</p>
      )}
    </div>
  );
};

export default MyManager;
