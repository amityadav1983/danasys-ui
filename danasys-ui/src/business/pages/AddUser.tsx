import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import DeactivatedUsers from "./DeactivatedUsers";

const AddUser = () => {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<"user" | "status">("user");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [userProfileId, setUserProfileId] = useState<number | null>(null);

  const navigate = useNavigate();

  // Fetch user details and roles on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetailsResponse = await fetch('/api/user/getUserDetails', {
          method: 'GET',
          headers: { accept: '*/*' },
        });
        if (!userDetailsResponse.ok) {
          throw new Error('Failed to fetch user details');
        }
        const userData = await userDetailsResponse.json();
        setUserProfileId(userData.userProfileId);

        const dashboardResponse = await fetch(`/api/user/loadBusinessDashboard/${userData.userProfileId}`, {
          method: 'GET',
          headers: { accept: '*/*' },
        });
        if (!dashboardResponse.ok) {
          throw new Error('Failed to fetch dashboard');
        }
        const dashData = await dashboardResponse.json();
        setRoles(dashData.roles);
      } catch (err: any) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  // 🔍 Search User
  const searchUser = async () => {
    if (!email.trim() && !mobile.trim()) {
      setError("Please enter either email or mobile number");
      setUser(null);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (email.trim()) params.append("userEmail", email.trim());
      if (mobile.trim()) params.append("contactNumber", mobile.trim());

      const response = await fetch(`/api/user/searchUser?${params.toString()}`, {
        method: "GET",
        headers: { accept: "*/*" },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUser(data);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.message || "Failed to search user");
      setUser(null);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Assign Role
  const handleRoleAssign = () => {
    if (!user) return;
    setShowRoleModal(true);
  };

  const assignRole = async () => {
    if (!selectedRole) return;
    try {
      const response = await fetch(`/api/admin/assignDelegationRole`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          delegateUserId: user.id,
          role: selectedRole,
          addRole: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      alert("Role assigned successfully!");
      setShowRoleModal(false);
      setSelectedRole("");
    } catch (err: any) {
      alert("Failed to assign role: " + err.message);
      console.error("Error assigning role:", err);
    }
  };

  return (
    <div className="p-6">
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  setHasSearched(false);
                  setUser(null);
                  setError(null);
                }}
                disabled={!!mobile}
                className={`border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 ${
                  mobile ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              <input
                type="tel"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  setHasSearched(false);
                  setUser(null);
                  setError(null);
                }}
                disabled={!!email}
                className={`border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 ${
                  email ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
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
          {loading && (email || mobile) && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-center text-gray-600">Searching...</p>
            </div>
          )}

          {/* Error */}
          {error && (email || mobile) && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-center text-red-600">{error}</p>
            </div>
          )}

          {/* Results Table */}
          {!loading && user && (email || mobile) && (
            <div className="w-full">
              {/* Table Header */}
              <div className="grid grid-cols-4 font-semibold text-gray-700 px-5 py-3 bg-gray-100 rounded-t-xl border border-gray-200">
                <div className="text-left">User</div>
                <div className="text-left">Email / Contact</div>
                <div className="text-left">Status</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="space-y-3 group">
                <div
                  className="grid grid-cols-4 items-center px-5 py-4 bg-blue-50 mt-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300
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
                    {user.email || "No email"} |{" "}
                    {user.contactInfo || "No contact"}
                  </div>

                  {/* Status */}
                  <div className="text-gray-600 text-sm">
                    {user.status || "Unknown"}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    {/* Assign Role */}
                    <button
                      onClick={handleRoleAssign}
                      className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition whitespace-nowrap"
                    >
                      <FaUserShield /> Assign Role
                    </button>

                    {/* Toggle Status */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={user.status?.toLowerCase() === 'active'}
                        onChange={async (e) => {
                          const isChecked = e.target.checked;
                          try {
                            const res = await fetch(
                              `/api/admin/user/${user.id}/${isChecked ? 'activateUser' : 'deActivateUser'}`,
                              {
                                method: "PUT",
                                headers: { accept: "*/*" },
                              }
                            );
                            if (!res.ok) throw new Error(`Failed to ${isChecked ? 'activate' : 'deactivate'} user`);
                            const result = await res.text();
                            alert(result);
                            // Update status
                            setUser({ ...user, status: isChecked ? 'active' : 'inactive' });
                          } catch (err: any) {
                            alert(err.message || `Error ${isChecked ? 'activating' : 'deactivating'} user`);
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Result */}
          {!loading && !user && !error && hasSearched && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-center text-gray-600">No user found</p>
            </div>
          )}
        </>
      )}

      {/* Activate / Deactivate Tab */}
      {activeTab === "status" && <DeactivatedUsers />}

      {/* Role Assignment Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Assign Role</h2>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-full mb-4"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedRole("");
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={assignRole}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;
