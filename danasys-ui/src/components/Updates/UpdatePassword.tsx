import React, { useState } from "react";
import axios from "axios";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

interface UpdatePasswordProps {
  onClose: () => void;
}

const UpdatePassword: React.FC<UpdatePasswordProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // basic frontend validation
    if (!formData.oldPassword) {
      setMessage("❌ Please enter your current password");
      return;
    }
    if (formData.newPassword.length < 6) {
      setMessage("❌ Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      };

      const response = await axios.post(
        "/api/user/updateUserPassword",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setMessage("✅ Password updated successfully!");
        setTimeout(() => onClose(), 1000);
      } else {
        setMessage(`❌ Unexpected response: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error updating password:", error);

      // show the actual backend error if available, otherwise provide helpful fallback
      let apiMessage = "Failed to update password";
      if (error.response) {
        const d = error.response.data;
        if (typeof d === "string") apiMessage = d;
        else if (d?.message) apiMessage = d.message;
        else if (d?.error) apiMessage = d.error;
        else apiMessage = `Status ${error.response.status} - ${error.response.statusText || ""}`;
      } else if (error.request) {
        apiMessage = "No response from server. Please check network/backend.";
      } else if (error.message) {
        apiMessage = error.message;
      }

      setMessage(`❌ ${apiMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[360px] w-[400px] bg-gray-50 flex flex-col items-center justify-center mx-auto my-10 rounded-xl shadow">
      {/* Header */}
      <div className="mb-6 pt-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <FaLock className="text-blue-600 text-2xl" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Update Password</h2>
        <p className="text-sm text-gray-600 mt-1">Secure your account with a new password</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 bg-white p-5 rounded-xl shadow">
        {/* Old Password */}
        <div className="relative">
          <input
            type={showOldPassword ? "text" : "password"}
            name="oldPassword"
            placeholder="Old Password"
            value={formData.oldPassword}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring focus:ring-blue-200"
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showOldPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring focus:ring-blue-200"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showNewPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {message && (
          <p className={`text-center text-sm mt-2 ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default UpdatePassword;