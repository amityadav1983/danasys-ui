import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const initialFormState = {
  id: 0,
  ownerName: "",
  storeName: "",
  category: {
    id: 0,
    categoryName: "Grocery",
    description: "",
    status: "ACTIVE",
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

const BusinessProfileForm = ({
  onClose,
  profile,
  onSuccess,
}: {
  onClose: () => void;
  profile?: any;
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

  // ✅ Pre-fill when editing
  useEffect(() => {
    if (profile) {
      setFormData({
        ...initialFormState,
        ...profile,
        businessLogo: null, // logo file ko dobara select karna padega
      });
      setAddedAddresses(profile.addresses || []);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

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

  const handleDeleteAddress = (id: number | string) => {
    setAddedAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  // ✅ Save / Update handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = new FormData();
      payload.append("ownerName", formData.ownerName);
      payload.append("storeName", formData.storeName);
      payload.append("category.categoryName", formData.category.categoryName);
      payload.append(
        "businessAddresses.shopAddress",
        formData.businessAddresses.shopAddress
      );

      addedAddresses.forEach((area, index) => {
        if (area.type === "custom") {
          payload.append(
            `userServiceAreaDeatils[${index}].fullAddress`,
            area.fullAddress
          );
          payload.append(
            `userServiceAreaDeatils[${index}].district`,
            area.district
          );
          payload.append(`userServiceAreaDeatils[${index}].state`, area.state);
          payload.append(
            `userServiceAreaDeatils[${index}].pinCode`,
            area.pinCode
          );
          payload.append(
            `userServiceAreaDeatils[${index}].shopAddress`,
            area.shopAddress
          );
        } else {
          payload.append(`userServiceAreaDeatils[${index}].id`, area.id);
          payload.append(
            `userServiceAreaDeatils[${index}].shopAddress`,
            area.shopAddress
          );
        }
      });

      if (formData.businessLogo) {
        payload.append("businessLogo", formData.businessLogo);
      }

      let url = "/api/user/createUserBusinessProfile";
      let method = "POST";

      if (profile && profile.id) {
        url = `/api/user/updateUserBusinessProfile/${profile.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        body: payload,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setSuccess(true);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
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
          {profile ? "Update Business Profile" : "Create Business Profile"}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Business Info */}
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-4 text-gray-700">
                Business Details
              </h3>
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
                      {addedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {addr.fullAddress}
                            </p>
                            <p className="text-sm text-gray-500">
                              {addr.district}, {addr.state} - {addr.pinCode}
                            </p>
                            <p className="text-sm text-blue-600">
                              Shop: {addr.shopAddress}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
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
                  label="Bank Account Holder Name"
                  name="businessAddresses.bankAccount.bankAccountHolderName"
                  value={
                    formData.businessAddresses.bankAccount
                      .bankAccountHolderName
                  }
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
                <InputField
                  label="Bank Account Type"
                  name="businessAddresses.bankAccount.bankAccountType"
                  value={
                    formData.businessAddresses.bankAccount.bankAccountType
                  }
                  onChange={handleChange}
                />
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
            {loading
              ? "Saving..."
              : profile
              ? "Update"
              : "Save"}
          </button>
        </div>

        {error && <p className="text-red-600 mt-3">{error}</p>}
        {success && (
          <p className="text-green-600 mt-3">
            {profile
              ? "Profile updated successfully!"
              : "Profile created successfully!"}
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
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) => (
  <label className="block text-sm">
    <span className="text-gray-600 font-medium">{label}</span>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  </label>
);

export default BusinessProfileForm;
