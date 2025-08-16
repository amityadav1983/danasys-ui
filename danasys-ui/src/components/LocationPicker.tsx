import React, { useState, useEffect } from 'react';
import { MdLocationPin } from 'react-icons/md';
import { IoIosArrowDown } from 'react-icons/io';
import { useTranslation } from 'react-i18next';

const LocationPicker = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetch('/api/user/getUserDetails')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (data.address) {
          setLocation({
            address: data.address,
            deliveryTime: '10 minutes'
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user details:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  if (loading) {
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
    <div className="relative">
      {!location.address ? (
        <span className="font-medium _text-default">{t('selectLocation', 'Select Location')}</span>
      ) : (
        <div className="flex flex-col">
          <p className="font-semibold text-lg leading-tight flex items-center gap-1">
            <MdLocationPin className="text-blue-500 text-3xl" />
            {t('deliveryInMinutes', 'Delivery in 10 minutes')}
          </p>
          <div className="flex items-center gap-2 cursor-pointer" onClick={toggleDropdown}>
            <span className="text-sm _text-default max-w-[200px] truncate" title={location.address}>
              {location.address}
            </span>
            <IoIosArrowDown 
              className={`text-gray-500 text-lg transition-transform duration-200 ${
                showDropdown ? 'rotate-180' : ''
              }`} 
            />
          </div>
          
          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 min-w-[300px]">
              <div className="flex items-start gap-2">
                <MdLocationPin className="text-blue-500 text-xl mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">Delivery Address</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{location.address}</p>
                  <p className="text-xs text-gray-500 mt-2">Delivery in 10 minutes</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
