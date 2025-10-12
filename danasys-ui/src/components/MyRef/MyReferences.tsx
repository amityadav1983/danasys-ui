import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaUserFriends } from "react-icons/fa";
import { authService, UserDetails } from "../../services/auth";

interface MyReferencesProps {
  onBack: () => void;
}

const MyReferences: React.FC<MyReferencesProps> = ({ onBack }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const details = await authService.getUserDetails();
        setUserDetails(details);
      } catch (err) {
        setError("Failed to load user details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 mb-4 hover:underline"
      >
        <FaArrowLeft /> Back
      </button>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
        <FaUserFriends className="text-pink-600" /> My QR
      </h2>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : userDetails?.myQRCode ? (
        <div className="flex flex-col items-center">
          <p className="text-gray-600 mb-4">Scan QR Code</p>
          <img
            src={userDetails.myQRCode}
            alt="My QR Code"
            className="max-w-xs max-h-xs object-contain border rounded-lg shadow-md"
          />
        </div>
      ) : (
        <p className="text-gray-600">QR Code not available.</p>
      )}
    </div>
  );
};

export default MyReferences;
