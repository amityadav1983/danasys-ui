import React from "react";

interface BusinessProfile {
  id: number;
  ownerName: string;
  storeName: string;
  businessLogoPath?: string;
}

interface BusinessProfileSelectorProps {
  profiles: BusinessProfile[];
  selectedProfile: number | null;
  setSelectedProfile: (id: number | null) => void;
  loadingProfiles: boolean;
  error: string | null;
}

const BusinessProfileSelector: React.FC<BusinessProfileSelectorProps> = ({
  profiles,
  selectedProfile,
  setSelectedProfile,
  loadingProfiles,
  error,
}) => {
  return (
    <div className="w-full max-w-md">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Business Profile
      </label>
      {loadingProfiles && (
        <p className="text-gray-500">Loading profiles...</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {!loadingProfiles && profiles.length > 0 ? (
        <select
          value={selectedProfile ?? ""}
          onChange={(e) => setSelectedProfile(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            -- Choose a business profile --
          </option>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.storeName || profile.ownerName}
            </option>
          ))}
        </select>
      ) : (
        !loadingProfiles && <p>No profiles found.</p>
      )}
    </div>
  );
};

export default BusinessProfileSelector;
