import React, { useState, useEffect, useRef } from "react";
import { MdLocationPin } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { useTranslation } from "react-i18next";
import api from "../services/api"; // apna path confirm kar lena

interface UserAddress {
  id: number;
  address: string;
  default: boolean;
}

const LocationPicker = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState<{ id?: number; address?: string }>(
    {}
  );
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch addresses function (baar-baar reuse hoga)
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get<UserAddress[]>("/api/user/loadUserAddresses");
      const data = res.data;

      if (Array.isArray(data) && data.length > 0) {
        setAddresses(data);
        const defaultAddress = data.find((addr) => addr.default) || data[0];
        setLocation({
          id: defaultAddress.id,
          address: defaultAddress.address,
        });
      } else {
        setAddresses([]);
        setLocation({});
      }
    } catch (err: any) {
      console.error("Error fetching user addresses:", err);
      setError(err.message || "Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses(); // 🔹 First load
  }, []);

  // ✅ Dropdown toggle + refresh addresses
  const toggleDropdown = async () => {
    if (!showDropdown) {
      await fetchAddresses(); // 🔹 Jab open hoga tab latest list le aao
    }
    setShowDropdown((prev) => !prev);
  };

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Make Default API call
  const handleMakeDefault = async (id: number) => {
    try {
      const res = await api.put(`/api/user/setUserDefaultAddress/${id}`);
      alert(res.data);

      await fetchAddresses(); // 🔹 Update list immediately
    } catch (err: any) {
      console.error("Error setting default:", err);
      alert(err.response?.data || "Failed to set default address");
    } finally {
      setShowDropdown(false);
    }
  };

  // ✅ Delete API call
  const handleDelete = async (id: number) => {
    try {
      const res = await api.put(`/api/user/removeUserAddress/${id}`);
      alert(res.data);

      await fetchAddresses(); // 🔹 Delete ke baad fresh list reload
    } catch (err: any) {
      console.error("Error deleting address:", err);
      alert(err.response?.data || "Failed to delete address");
    }
  };

  const shortAddress = location.address
    ? location.address.split(",")[0] + ""
    : "";

  if (loading && !showDropdown) {
    return (
      <div className="flex items-center gap-2">
        <MdLocationPin className="text-blue-500 text-xl" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2">
        <MdLocationPin className="text-blue-500 text-xl" />
        <span className="text-sm text-red-500">Error loading address</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {!location.address ? (
        <span className="font-medium _text-default">
          {t("selectLocation", "Select Location")}
        </span>
      ) : (
        <div className="flex flex-col">
          <p className="font-semibold text-lg leading-tight flex items-center gap-1">
            <MdLocationPin className="text-blue-500 text-3xl" />
            {t("deliveryInMinutes", "Address")}
          </p>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <span
              className="text-sm _text-default max-w-[200px] ml-8 truncate"
              title={shortAddress}
            >
              {shortAddress}
            </span>
            <IoIosArrowDown
              className={`text-gray-500 text-lg transition-transform duration-200 ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 min-w-[320px] max-h-[300px] overflow-y-auto">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-3 mb-2 rounded-lg border ${
                    location?.id === addr.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <MdLocationPin className="text-blue-500 text-xl mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Address{" "}
                        {location?.id === addr.id && (
                          <span className="ml-2 text-xs text-green-600 font-medium">
                            ✅ Selected
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {addr.address}
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 justify-end mt-2">
                    {location?.id === addr.id ? null : (
                      <>
                        <button
                          onClick={() => handleMakeDefault(addr.id)}
                          className="px-3 py-1 text-xs rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition"
                        >
                          Make Default
                        </button>
                        <button
                          onClick={() => handleDelete(addr.id)}
                          className="px-3 py-1 text-xs rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
