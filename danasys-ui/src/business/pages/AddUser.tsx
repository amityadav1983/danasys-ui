import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import DeactivatedUsers from "./DeactivatedUsers";

const AddUser = () => {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"user" | "status">("user");

  const navigate = useNavigate();

  // 🔍 Search User
  const searchUser = async () => {
    if (!email.trim() || !mobile.trim()) {
      setError("Both email and mobile number are required");
      setUser(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/user/searchUser?userEmail=${encodeURIComponent(
          email
        )}&contactNumber=${encodeURIComponent(mobile)}`,
        {
          method: "GET",
          headers: { accept: "*/*" },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUser(data);
    } catch (err: any) {
      setError(err.message || "Failed to search user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Assign Role
  const handleRoleAssign = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/admin/assignDelegationRole`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          delegateUserId: user.id,
          role: "ROLE_SUPERADMIN",
          addRole: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      alert("Role assigned successfully!");
    } catch (err: any) {
      alert("Failed to assign role: " + err.message);
      console.error("Error assigning role:", err);
    }
  };

  return (
    <div className=" p-6">
      <h1 className="text-2xl font-bold mb-6 mt-20">User</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("user")}
          className={`px-4 py-2 font-medium ${
            activeTab === "user"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("status")}
          className={`px-4 py-2 font-medium ${
            activeTab === "status"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Deactivated Users
        </button>
      </div>

      {/* User Tab */}
      {activeTab === "user" && (
        <>
          {/* Search Section */}
        <div className="mb-6">
  <div className="flex flex-col md:flex-row gap-4 items-center">
    <input
      type="email"
      placeholder="Enter user email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
    />
    <input
      type="tel"
      placeholder="Enter mobile number"
      value={mobile}
      onChange={(e) => setMobile(e.target.value)}
      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
    />
    <button
      onClick={searchUser}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Search
    </button>
  </div>
</div>


          {/* Loader */}
          {loading && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-center text-gray-600">Searching...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-center text-red-600">{error}</p>
            </div>
          )}

          {/* Results Table */}
          {!loading && user && (
            <div className="w-full">
              {/* Table Header */} 
              <div className="grid grid-cols-3 font-semibold text-gray-700 px-5 py-3 bg-gray-100 rounded-t-xl border border-gray-200">
                <div className="text-left">User</div>
                <div className="text-left">Email / Contact</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="space-y-3 group">
                <div
                  className="grid grid-cols-3 items-center px-5 py-4 bg-blue-50 mt-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300
                  group-hover:opacity-40 hover:!opacity-100 hover:bg-blue-100 hover:scale-[1.06] hover:shadow-md"
                >
                  {/* User */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm text-blue-600 font-semibold">
                        {user.fullname?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {user.fullname || "Unknown User"}
                    </span>
                  </div>

                  {/* Email / Contact */}
                  <div className="text-gray-600 text-sm">
                    {user.email || "No email"} | {user.contactInfo || "No contact"}
                  </div>

{/* Actions */}
<div className="flex justify-end gap-2">
 

  {/* Assign Role */}
  <button
    onClick={handleRoleAssign}
    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 rounded-full transition"
  >
    <FaUserShield /> Assign Role
  </button>

   {/* Activate */}
  <button
    onClick={async () => {
      try {
        const res = await fetch(`/api/admin/user/${user.id}/activateUser`, {
          method: "PUT",
          headers: { accept: "*/*" },
        });
        if (!res.ok) throw new Error("Failed to activate user");
        const result = await res.text();
        alert(result);
      } catch (err: any) {
        alert(err.message || "Error activating user");
      }
    }}
    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-full transition"
  >
    <FaCheckCircle className="text-blue-600" /> Activate
  </button>

  {/* Deactivate */}
  <button
    onClick={async () => {
      try {
        const res = await fetch(`/api/admin/user/${user.id}/deActivateUser`, {
          method: "PUT",
          headers: { accept: "*/*" },
        });
        if (!res.ok) throw new Error("Failed to deactivate user");
        const result = await res.text();
        alert(result);
      } catch (err: any) {
        alert(err.message || "Error deactivating user");
      }
    }}
    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-full transition"
  >
    <FaTimesCircle className="text-red-600" /> Deactivate
  </button>
</div>
                </div>
              </div>
            </div>
          )}

          {/* No Result */}
          {!loading && !user && !error && (email || mobile) && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-center text-gray-600">No user found</p>
            </div>
          )}
        </>
      )}

      {/* Activate / Deactivate Tab */}
      {activeTab === "status" && (
        <DeactivatedUsers />
      )}
    </div>
  );
};

export default AddUser;
