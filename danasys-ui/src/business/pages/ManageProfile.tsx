import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageProfile = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Managed User Business Profiles
  const fetchManagedProfiles = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagedProfiles();
  }, []);

  return (
    <div className="p-6">
      {/* <h2 className="text-xl font-semibold mb-4">Manage Profile</h2> */}

      {/* Results */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && profiles.length > 0 && (
        <div className="w-full">
          {/* Table Header */}
          <div className="grid grid-cols-4 font-semibold text-gray-700 px-5 py-3 bg-gray-100 rounded-t-xl border border-gray-200">
            <div className="text-left">Logo</div>
            <div className="text-left">Owner Name</div>
            <div className="text-left">Store Name</div>
            <div className="text-center">Category</div>
          </div>

          {/* Table Body */}
          <div className="space-y-3 group">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="grid grid-cols-4 items-center px-5 py-4 bg-blue-50 mt-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300
                  group-hover:opacity-40 hover:!opacity-100 hover:bg-blue-100 hover:scale-[1.06] hover:shadow-md"
              >
                {/* Logo */}
                <div className="flex items-center gap-3">
                  <img
                    src={profile.businessLogoPath}
                    alt="Logo"
                    className="h-10 w-10 rounded-full border object-cover"
                  />
                </div>

                {/* Owner Name */}
                <div className="text-gray-800">
                  {profile.ownerName}
                </div>

                {/* Store Name */}
                <div className="text-gray-600 text-sm">
                  {profile.storeName || "—"}
                </div>

                {/* Category */}
                <div className="text-center">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-600">
                    {profile.category?.categoryName || "—"}
                  </span>
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

export default ManageProfile;
