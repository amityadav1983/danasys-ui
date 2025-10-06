import React, { useEffect, useState } from "react";

const DeactivatedUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch deactivated users
  const fetchDeactivatedUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/getAllDeactivedUsers", {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeactivatedUsers();
  }, []);

  return (
    <div className="w-full">
      {/* <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Deactivated Users
      </h2> */}

      {loading && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-center text-gray-600">Loading users...</p>
        </div>
      )}

      {error && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-center text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="w-full">
          {/* Table Header */}
          <div className="grid grid-cols-4 font-semibold text-gray-700 px-5 py-3 bg-gray-100 rounded-t-xl border border-gray-200">
            <div className="text-left">User</div>
            <div className="text-left">Email</div>
            <div className="text-left">Status</div>
            <div className="text-left">Actions</div>
          </div>

          {/* Table Body */}
          <div className="space-y-3 group">
            {users.map((u) => (
              <div
                key={u.id}
                className="grid grid-cols-4 items-center px-5 py-4 bg-red-50 mt-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300
                group-hover:opacity-40 hover:!opacity-100 hover:bg-red-100 hover:scale-[1.03] hover:shadow-md"
              >
                {/* User */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm text-red-600 font-semibold">
                      {u.fullname?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {u.fullname || "Unknown User"}
                  </span>
                </div>

                {/* Email */}
                <div className="text-gray-600 text-sm">{u.email || "No email"}</div>

                {/* Status */}
                <div className="text-sm font-medium text-red-600">{u.status}</div>

                {/* Actions - Toggle Button */}
                <div className="text-right">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={u.status?.toLowerCase() === "active"}
                      onChange={async (e) => {
                        const isChecked = e.target.checked;
                        try {
                          const res = await fetch(
                            `/api/admin/user/${u.id}/${isChecked ? "activateUser" : "deActivateUser"}`,
                            {
                              method: "PUT",
                              headers: { accept: "*/*" },
                            }
                          );
                          if (!res.ok) throw new Error(`Failed to ${isChecked ? "activate" : "deactivate"} user`);
                          const result = await res.text();
                          alert(result);
                          // Update user status locally
                          setUsers((prevUsers) =>
                            prevUsers.map((user) =>
                              user.id === u.id ? { ...user, status: isChecked ? "active" : "inactive" } : user
                            )
                          );
                        } catch (err: any) {
                          alert(err.message || `Error ${isChecked ? "activating" : "deactivating"} user`);
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-center text-gray-600">No deactivated users found</p>
        </div>
      )}
    </div>
  );
};

export default DeactivatedUsers;
