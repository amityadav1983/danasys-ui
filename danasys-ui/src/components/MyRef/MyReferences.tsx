import React from "react";
import { FaArrowLeft, FaUserFriends } from "react-icons/fa";

interface MyReferencesProps {
  onBack: () => void;
}

const MyReferences: React.FC<MyReferencesProps> = ({ onBack }) => {
  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 mb-4 hover:underline"
      >
        <FaArrowLeft /> Back
      </button>
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
        <FaUserFriends className="text-pink-600" /> My References
      </h2>
      <p className="text-gray-600">
        Here you can manage all your references. (Add your logic here)
      </p>
    </div>
  );
};

export default MyReferences;
