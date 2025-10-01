import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const initialFormState = {
  id: 0,
  ownerName: "",
  storeName: "",
  category: {
    id: 0,
    categoryName: "",
    description: "",
    status: "",
    image: "",
    theemColorCode: "",
  },
  businessAddresses: {
    id: 0,
    bankAccount: {
      id: 0,
      accountNumber: 0,
      bankAccountHolderName: "",
      bankName: "",
      bankBranch: "",
      bankIFSCCode: "",
      bankAccountType: "",
    },
    shopAddress: "",
  },
  businessLogo: null as File | null,
};

const UpdateBusinessProfileForm = ({
  onClose,
  profile,
  onSuccess,
}: {
  onClose: () => void;
  profile: any;
  onSuccess?: () => void;
}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ✅ Service Areas
  const [serviceAreas, setServiceAreas] = useState<any[]>([]);
  const [selectedServiceArea, setSelectedServiceArea] = useState("");
  const [customServiceArea, setCustomServiceArea] = useState({
    fullAddress: "",
    district: "",
    state: "",
    pinCode: "",
    shopAddress: "",
  });
  const [addedAddresses, setAddedAddresses] = useState<any[]>([]);
  const [shopAddressForSelected, setShopAddressForSelected] = useState("");

  // ✅ Categories
  const [categories, setCategories] = useState<any[]>([]);

  // New state for address fullAddress (e.g., "E2 702")
  const [addressFullAddressMap, setAddressFullAddressMap] = useState<{ [key: number]: string }>({});

  // ✅ Pre-fill when editing
  useEffect(() => {
    if (profile) {
      console.log('Profile data:', profile);
      const updatedFormData = {
        ...initialFormState,
        ...profile,
        businessLogo: null, // Keep as null for new uploads, existing logo will be shown via businessLogoPath
      };
      // Ensure bankAccount is prefilled from profile.bankAccount if available
      if (profile.bankAccount) {
        console.log('Setting bankAccount:', profile.bankAccount);
        updatedFormData.businessAddresses.bankAccount = {
          id: profile.bankAccount.id || 0,
          accountNumber: profile.bankAccount.accountNumber || 0,
          bankAccountHolderName: profile.bankAccount.accountHolderName || "",
          bankName: profile.bankAccount.bankName || "",
          bankBranch: profile.bankAccount.branch || "",
          bankIFSCCode: profile.bankAccount.bankIfscCode || "",
          bankAccountType: profile.bankAccount.bankAccountType || "",
        };
      }
      setFormData(updatedFormData);
      setAddedAddresses((profile.addresses || []).map((addr: any) => ({
        id: addr.id,
        fullAddress: addr.serviceArea?.fullAddress || '',
        district: addr.serviceArea?.district || '',
        state: addr.serviceArea?.state || '',
        pinCode: addr.serviceArea?.pinCode || '',
        shopAddress: addr.shopAddress || '',
        active: addr.active !== undefined ? addr.active : true,
      })));
      // Set the map for fullAddress (e.g., "E2 702")
      const fullAddressMap: { [key: number]: string } = {};
      (profile.addresses || []).forEach((addr: any) => {
        fullAddressMap[addr.id] = addr.fullAddress || '';
      });
      setAddressFullAddressMap(fullAddressMap);
    }
  }, [profile]);

  // ✅ Fetch service areas
  useEffect(() => {
    const fetchServiceAreas = async () => {
      try {
        const res = await fetch(`/api/user/serviceAreaList`);
        const data = await res.json();
        setServiceAreas(data.userServiceAreaList || []);
      } catch (err) {
        console.error("Failed to fetch service areas", err);
      }
    };
    fetchServiceAreas();
  }, []);

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "/api/admin/allRegisteredProductCategory"
        );
        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

 // inside handleChange
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  if (name === "category") {
    const selectedCat = categories.find((c) => c.categoryName === value);
    if (selectedCat) {
      setFormData((prev) => ({
        ...prev,
        category: selectedCat, // ✅ store full object
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        category: {
          id: 0,
          categoryName: "",
          description: "",
          status: "",
          image: "",
          theemColorCode: "",
        },
      }));
    }
    return;
  }

  if (name.includes(".")) {
    const keys = name.split(".");
    setFormData((prev) => {
      const updated = { ...prev };
      let current: any = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      const lastKey = keys[keys.length - 1];
      current[lastKey] = isNaN(Number(value)) ? value : Number(value);
      return updated;
    });
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }));
  }
};


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    // File validation
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        e.target.value = ""; // Reset the input
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file");
        e.target.value = ""; // Reset the input
        return;
      }
    }

    setFormData((prev) => ({ ...prev, businessLogo: file }));
  };

  const handleAddServiceArea = () => {
    if (selectedServiceArea === "other") {
      if (
        !customServiceArea.fullAddress ||
        !customServiceArea.district ||
        !customServiceArea.state ||
        !customServiceArea.pinCode
      )
        return alert("Please fill all custom service area fields");

      setAddedAddresses((prev) => [
        ...prev,
        { ...customServiceArea, id: Date.now(), type: "custom" },
      ]);
      setCustomServiceArea({
        fullAddress: "",
        district: "",
        state: "",
        pinCode: "",
        shopAddress: "",
      });
    } else if (selectedServiceArea) {
      if (!shopAddressForSelected)
        return alert("Please enter shop address for selected service area");

      const selected = serviceAreas.find(
        (a) => a.id === Number(selectedServiceArea)
      );
      if (selected) {
        setAddedAddresses((prev) => [
          ...prev,
          {
            ...selected,
            shopAddress: shopAddressForSelected,
            type: "existing",
          },
        ]);
      }
      setShopAddressForSelected("");
    }
    setSelectedServiceArea("");
  };

  const handleDeleteAddress = async (id: number | string) => {
    try {
      // Find the address and set active to false
      const addressToDelete = addedAddresses.find((addr) => addr.id === id);
      console.log("Before delete, active:", addressToDelete?.active);

      const updatedAddresses = addedAddresses.map((addr) =>
        addr.id === id ? { ...addr, active: false } : addr
      );

      const updatedAddress = updatedAddresses.find((addr) => addr.id === id);
      console.log("After delete, active:", updatedAddress?.active);

      // Prepare the payload
      const businessProfilePayload = {
        id: formData.id,
        ownerName: formData.ownerName,
        storeName: formData.storeName,
        category: formData.category,
        businessAddresses: updatedAddresses.map((area, index) => ({
          id: area.id || 0,
          active: area.active !== undefined ? area.active : true,
          shopAddress: area.shopAddress || "",
          fullAddress: addressFullAddressMap[area.id] || "",
          userServiceAreaDeatils: {
            id: area.id || 0,
            fullAddress: area.fullAddress,
            district: area.district,
            state: area.state,
            pinCode: area.pinCode,
          },
          default: index === 0,
        })),
        bankAccount: formData.businessAddresses.bankAccount,
      };

      const payload = new FormData();
      payload.append(
        "userBusinessProfile",
        new Blob([JSON.stringify(businessProfilePayload)], {
          type: "application/json",
        })
      );

      // Include file if exists, but since it's delete, maybe not necessary, but to be safe
      if (formData.businessLogo) {
        payload.append("file", formData.businessLogo);
      }

      const url = `/api/user/updateUserBusinessProfile`;
      const response = await fetch(url, {
        method: "POST",
        body: payload,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error ${response.status}: ${errText}`);
      }

      // On success, update the address to active: false in local state
      setAddedAddresses((prev) => prev.map((addr) => addr.id === id ? { ...addr, active: false } : addr));
    } catch (err: any) {
      console.error("Error deleting address:", err);
      setError(err.message || "Failed to delete address");
    }
  };

  const handleFullAddressChange = (id: number, value: string) => {
    setAddressFullAddressMap((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

// ✅ Update handler
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(false);

  try {
    // 🟢 JSON prepare
  const businessProfilePayload = {
  id: formData.id,
  ownerName: formData.ownerName,
  storeName: formData.storeName,
  category: formData.category,
  businessAddresses: addedAddresses.map((area, index) => ({
    id: area.id || 0,
    active: area.active !== undefined ? area.active : true,
    fullAddress: addressFullAddressMap[area.id] || "",
    addressDeatils: {
      addressLine1: area.shopAddress || "",     // 👈 shopAddress → addressLine1
      addressType: "HOME",                      // 👈 default fix (ya UI se input lo)
      userServiceAreaDeatils: {
        id: area.id || 0,
        fullAddress: area.fullAddress,
        district: area.district,
        state: area.state,
        pinCode: Number(area.pinCode),
      },
      default: index === 0,                     // 👈 wrapper ke andar shift
    }
  })),
  bankAccount: formData.businessAddresses.bankAccount,
};


    // 🟢 Debugging
    console.log(
      "🚀 Sending businessProfilePayload:",
      JSON.stringify(businessProfilePayload, null, 2)
    );

    // 🟢 FormData banao
    const payload = new FormData();
    payload.append(
      "userBusinessProfile",
      new Blob([JSON.stringify(businessProfilePayload)], {
        type: "application/json",
      })
    );

    if (formData.businessLogo) {
      console.log("📎 Uploading file:", {
        name: formData.businessLogo.name,
        size: formData.businessLogo.size,
        type: formData.businessLogo.type
      });
      payload.append("file", formData.businessLogo);
    } else {
      console.log("⚠️ No file selected for upload");
    }

    // 🟢 API call - Always POST for update
    const url = `/api/user/updateUserBusinessProfile`;
    const method = "POST";

    const response = await fetch(url, {
      method,
      body: payload,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Error ${response.status}: ${errText}`);
    }

    setSuccess(true);
    if (onSuccess) onSuccess();
    onClose();
  } catch (err: any) {
    console.error("❌ Error updating business profile:", err);
    setError(err.message || "Unknown error");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-8 w-full shadow-lg overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Update Business Profile
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Business Info */}
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <h3 className="font-semibold text-lg text-gray-700 flex-1">
                  Business Details
                </h3>
                <div className="relative w-20 h-20">
                  <label
                    htmlFor="businessLogo"
                    className="cursor-pointer block w-20 h-20 rounded-full overflow-hidden bg-white shadow-md border border-gray-200"
                    title="Upload Business Logo"
                  >
                    {formData.businessLogo ? (
                      <img
                        src={URL.createObjectURL(formData.businessLogo)}
                        alt="Business Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : profile?.businessLogoPath ? (
                      <img
                        src={profile.businessLogoPath}
                        alt="Business Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3h-1.586a1 1 0 00-.707.293l-1.414 1.414a1 1 0 01-.707.293H8a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    )}
                    <input
                      type="file"
                      id="businessLogo"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 shadow-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3h-1.586a1 1 0 00-.707.293l-1.414 1.414a1 1 0 01-.707.293H8a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </label>
                </div>
              </div>
              <div className="space-y-4">
                <InputField
                  label="Owner Name"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Store Name"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  required
                />

                {/* ✅ Category Dropdown */}
<label className="block text-sm">
  <span className="text-gray-600 font-medium">Category</span>
  <select
    name="category"
    value={formData.category?.categoryName || ""}
    onChange={handleChange}
    className="w-full border rounded px-3 py-2 mt-1"
  >
    <option value="">-- Select Category --</option>
    {categories.map((cat) => (
      <option key={cat.categoryName} value={cat.categoryName}>
        {cat.categoryName}
      </option>
    ))}
  </select>
</label>

                {/* Service Area Selection */}
                <label className="block text-sm">
                  <span className="text-gray-600 font-medium">Select </span>
                  <select
                    value={selectedServiceArea}
                    onChange={(e) => setSelectedServiceArea(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="">-- Select --</option>
                    {serviceAreas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.fullAddress} ({area.pinCode})
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </label>

                {selectedServiceArea &&
                  selectedServiceArea !== "other" && (
                    <InputField
                      label="Shop Address"
                      name="shopAddressForSelected"
                      value={shopAddressForSelected}
                      onChange={(e) =>
                        setShopAddressForSelected(e.target.value)
                      }
                    />
                  )}

                {selectedServiceArea === "other" && (
                  <div className="mt-4 space-y-3 p-3 border rounded-lg bg-gray-50">
                    <InputField
                      label="Full Address"
                      name="fullAddress"
                      value={customServiceArea.fullAddress}
                      onChange={(e) =>
                        setCustomServiceArea({
                          ...customServiceArea,
                          fullAddress: e.target.value,
                        })
                      }
                    />
                    <InputField
                      label="District"
                      name="district"
                      value={customServiceArea.district}
                      onChange={(e) =>
                        setCustomServiceArea({
                          ...customServiceArea,
                          district: e.target.value,
                        })
                      }
                    />
                    <InputField
                      label="State"
                      name="state"
                      value={customServiceArea.state}
                      onChange={(e) =>
                        setCustomServiceArea({
                          ...customServiceArea,
                          state: e.target.value,
                        })
                      }
                    />
                    <InputField
                      label="Pin Code"
                      name="pinCode"
                      value={customServiceArea.pinCode}
                      onChange={(e) =>
                        setCustomServiceArea({
                          ...customServiceArea,
                          pinCode: e.target.value,
                        })
                      }
                    />
                    <InputField
                      label="Shop Address"
                      name="shopAddress"
                      value={customServiceArea.shopAddress}
                      onChange={(e) =>
                        setCustomServiceArea({
                          ...customServiceArea,
                          shopAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                )}

                {selectedServiceArea && (
                  <button
                    type="button"
                    onClick={handleAddServiceArea}
                    className="mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Add Address
                  </button>
                )}

                {addedAddresses.length > 0 && (
                  <div className="mt-5">
                    <h4 className="text-gray-700 font-semibold mb-2">
                      Added Addresses
                    </h4>
                    <div className="border rounded-lg divide-y">
                     {addedAddresses.map((addr, index) => (
  <div
    key={addr.id}
    className={`flex items-center justify-between p-3 hover:bg-gray-50 transition
      ${addr.active === false ? "opacity-50 pointer-events-none" : ""}`}
  >
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <p className="font-medium text-gray-800">
          {addressFullAddressMap[addr.id] || addr.fullAddress}
        </p>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            index === 0
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {index === 0 ? "Primary" : "Secondary"}
        </span>
      </div>
      <p className="text-sm text-gray-500">
        {addr.district}, {addr.state} - {addr.pinCode}
      </p>
      <p className="text-sm text-blue-600">Shop: {addr.shopAddress}</p>
      {/* <div className="flex items-center gap-2">
        <span className="text-sm text-blue-600">Unit:</span>
        <input
          type="text"
          value={addressFullAddressMap[addr.id] || ""}
          onChange={(e) => handleFullAddressChange(addr.id, e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1 w-32"
          placeholder="e.g., E2 702"
        />
      </div> */}
      {/* {index === 0 && (
        <p className="text-xs text-green-600 mt-1 font-medium">
          ✓ Default address for business operations
        </p>
      )}
      {addr.active === false && (
        <p className="text-xs text-red-600 mt-1 font-medium">
          (Disabled)
        </p>
      )} */}
    </div>
    <div className="flex gap-2">
      <button
        type="button"
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => alert("Update functionality not implemented yet")}
        disabled={addr.active === false} // ❌ disable update btn if inactive
      >
        Update
      </button>
      <button
        type="button"
        onClick={() => handleDeleteAddress(addr.id)}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        disabled={addr.active === false} // ❌ disable delete btn if inactive
      >
        Delete
      </button>
    </div>
  </div>
))}

                    </div>
                    {/* <p className="text-xs text-gray-500 mt-2">
                      Note: First added address will be set as primary (default: true) and others as secondary (default: false)
                    </p> */}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Bank Info */}
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-4 text-gray-700">
                Bank Details
              </h3>
<div className="space-y-4">
  <InputField
    label="Account Number"
    name="businessAddresses.bankAccount.accountNumber"
    value={formData.businessAddresses.bankAccount.accountNumber}
    onChange={handleChange}
    type="number"
    required
  />
  <InputField
    label="Bank Account Holder Name"
    name="businessAddresses.bankAccount.bankAccountHolderName"
    value={formData.businessAddresses.bankAccount.bankAccountHolderName}
    onChange={handleChange}
  />
  <InputField
    label="Bank Name"
    name="businessAddresses.bankAccount.bankName"
    value={formData.businessAddresses.bankAccount.bankName}
    onChange={handleChange}
  />
  <InputField
    label="Bank Branch"
    name="businessAddresses.bankAccount.bankBranch"
    value={formData.businessAddresses.bankAccount.bankBranch}
    onChange={handleChange}
  />
  <InputField
    label="Bank IFSC Code"
    name="businessAddresses.bankAccount.bankIFSCCode"
    value={formData.businessAddresses.bankAccount.bankIFSCCode}
    onChange={handleChange}
  />

  {/* 👇 Bank Account Type dropdown with same styling as InputField */}
  <label className="block text-sm">
    <span className="text-gray-600 font-medium">Bank Account Type</span>
    <select
      name="businessAddresses.bankAccount.bankAccountType"
      value={formData.businessAddresses.bankAccount.bankAccountType}
      onChange={handleChange}
      className="w-full border border-gray-500 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    >
      <option value="">Select Account Type</option>
      <option value="CURRENT">Current</option>
      <option value="SAVING">Saving</option>
    </select>
  </label>
</div>


            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>

      {error && <p className="text-red-600 mt-3">{error}</p>}
      {success && (
        <p className="text-green-600 mt-3">
          Profile updated successfully!
        </p>
      )}
    </form>
  </div>
  );
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}) => (
  <label className="block text-sm">
    <span className="text-gray-600 font-medium">{label}</span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  </label>
);

export default UpdateBusinessProfileForm;
