import React, { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  onClose: () => void;
}

interface ServiceArea {
  id: number;
  name: string;
  pinCode: number;
}

interface UserServiceArea {
  id: number;
  fullAddress: string;
  pinCode: number;
  status: string;
  district: string;
  state: string;
}

interface ServiceAreaListResponse {
  userServiceAreaList: UserServiceArea[];
}

const UpdateAddress: React.FC<Props> = ({ onClose }) => {
  const [houseFlatNo, setHouseFlatNo] = useState<string>("");
  const [fullAddress, setFullAddress] = useState<string>("");
  const [pinCode, setPinCode] = useState<number>(0);
  const [district, setDistrict] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchServiceAreas = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ServiceAreaListResponse>(
          "/api/user/serviceAreaList",
          { headers: { accept: "*/*" } }
        );
        setServiceAreas(
          (response.data.userServiceAreaList || []).map((area) => ({
            id: area.id,
            name: area.fullAddress,
            pinCode: area.pinCode,
          }))
        );
        setLoading(false);
      } catch (err) {
        console.error("Error fetching service areas:", err);
        setError("Failed to load service areas");
        setLoading(false);
      }
    };

    fetchServiceAreas();
  }, []);

  const handleSubmit = async () => {
    try {
      let payload: any = {
        addressLine1: "",
        addressType: "HOME",
        userServiceAreaDeatils: {
          id: 0,
          fullAddress: "",
          district: "",
          state: "",
          pinCode: 0,
        },
        default: true,
      };

      if (selectedArea === "Other") {
        if (!fullAddress.trim()) {
          alert("Please enter your full address.");
          return;
        }
        if (!pinCode) {
          alert("Please enter your pin code.");
          return;
        }
        if (!district.trim()) {
          alert("Please enter your district.");
          return;
        }
        if (!state.trim()) {
          alert("Please enter your state.");
          return;
        }

        payload = {
          addressLine1: fullAddress,
          addressType: "HOME",
          userServiceAreaDeatils: {
            id: 0,
            fullAddress,
            district,
            state,
            pinCode,
          },
          default: true,
        };
      } else if (selectedArea) {
        if (!houseFlatNo.trim()) {
          alert("Please enter your House/Flat No.");
          return;
        }

        const area = serviceAreas.find((a) => a.name === selectedArea);
        if (!area) {
          alert("Selected service area not found.");
          return;
        }

        payload = {
          addressLine1: houseFlatNo,
          addressType: "HOME",
          userServiceAreaDeatils: {
            id: area.id,
            fullAddress: area.name,
            district: district || "",
            state: state || "",
            pinCode: area.pinCode,
          },
          default: true,
        };
      } else {
        alert("Please select an address option.");
        return;
      }

      const response = await axios.post(
        "/api/user/linkServiceArea",
        payload,
        {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);
      alert("Address saved successfully!");
      onClose();
    } catch (err) {
      console.error("Error saving address:", err);
      alert("Failed to save address. Please try again.");
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg overflow-y-auto border border-gray-100 no-scrollbar"
      style={{ maxHeight: "85vh" }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Update Address
      </h2>

      {loading && (
        <p className="text-gray-500 text-center py-4">
          Loading service areas...
        </p>
      )}
      {error && <p className="text-red-500 text-center py-4">{error}</p>}

      {!loading && !error && (
        <div className="space-y-6">
          {/* Service Areas */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4">
            <h3 className="text-md font-semibold text-gray-700">
              Select Service Area
            </h3>
            {serviceAreas.map((area) => (
              <div
                key={area.id}
                className={`rounded-lg border p-3 transition-colors ${
                  selectedArea === area.name
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="serviceArea"
                    value={area.name}
                    checked={selectedArea === area.name}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="block font-medium text-gray-800">
                      {area.name}
                    </span>
                    <span className="block text-sm text-gray-500">
                      Pin Code: {area.pinCode}
                    </span>
                  </div>
                </label>

                {selectedArea === area.name && (
                  <div className="mt-3 ml-7">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      House/Flat No
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your House/Flat No"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={houseFlatNo}
                      onChange={(e) => setHouseFlatNo(e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Other Address */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <h3 className="text-md font-semibold text-gray-700 mb-3">
              Other Address
            </h3>
            <label className="flex items-center space-x-3 cursor-pointer border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
              <input
                type="radio"
                name="serviceArea"
                value="Other"
                checked={selectedArea === "Other"}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-gray-800">
                Enter a different address
              </span>
            </label>

            {selectedArea === "Other" && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full address"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pin Code
                  </label>
                  <input
                    type="number"
                    placeholder="Enter pin code"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={pinCode || ""}
                    onChange={(e) => setPinCode(Number(e.target.value))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      placeholder="Enter district"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      placeholder="Enter state"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer buttons */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition"
        >
          Save Address
        </button>
      </div>
    </div>
  );
};

export default UpdateAddress;
