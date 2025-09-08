import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateBusinessProfilePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = (location.state as any)?.profile;

  const [ownerName, setOwnerName] = useState(profile?.ownerName || "");
  const [storeName, setStoreName] = useState(profile?.storeName || "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!profile) {
    return <div className="pt-20 p-6">No profile data found.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append(
        "userBusinessProfile",
        JSON.stringify({
          id: profile.id,
          ownerName,
          storeName,
          businessAddresses: profile.businessAddresses || [],
        })
      );
      if (file) {
        formData.append("file", file);
      }

      const res = await fetch(
        "http://localhost:8080/api/user/updateUserBusinessProfile",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully!");
      navigate("/business/profile");
    } catch (err: any) {
      alert(err.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 p-6">
      <h1 className="text-2xl font-bold mb-6">Update Business Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {/* Owner Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Owner Name</label>
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Store Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Store Name</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate("/business/profile")}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBusinessProfilePage;
