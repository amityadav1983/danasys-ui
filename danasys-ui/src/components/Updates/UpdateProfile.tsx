import React, { useState } from "react";
import axios from "axios";
import { FiCamera } from "react-icons/fi";

interface UpdateProfileProps {
  onClose: () => void; // parent se popup close karne ke liye
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    contactInfo: "",
    email: "",
    referralCode: "",
    profilePic: null as File | null, // UI ke liye rakha hai (API me use nahi hoga)
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData({ ...formData, profilePic: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // JSON payload banaya
      const payload = {
        email: formData.email,
        fullName: formData.fullname,
        referralCode: formData.referralCode,
        contactNumber: formData.contactInfo,
      };

      const response = await axios.post(
        "http://localhost:8080/api/user/updateUserProfile",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setMessage("✅ Profile updated successfully!");
        setTimeout(() => {
          onClose(); // popup close
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[450px] w-[400px] bg-gray-50 flex flex-col items-center justify-center mx-auto my-10 rounded-xl shadow">
      {/* Profile Pic Upload (UI only) */}
      <div className="relative mb-5 pt-6">
        <div className="w-28 h-28 rounded-full overflow-hidden border shadow">
          {formData.profilePic ? (
            <img
              src={URL.createObjectURL(formData.profilePic)}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>
        <label
          htmlFor="profilePic"
          className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer shadow"
        >
          <FiCamera className="text-white" />
          <input
            id="profilePic"
            type="file"
            name="profilePic"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 bg-white p-5 rounded-xl shadow"
      >
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />

        <input
          type="text"
          name="contactInfo"
          placeholder="Contact Info"
          value={formData.contactInfo}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />

        <input
          type="text"
          name="referralCode"
          placeholder="Referral Code"
          value={formData.referralCode}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        {message && (
          <p
            className={`text-center text-sm mt-2 ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default UpdateProfile;
