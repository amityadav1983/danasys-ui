import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const SearchBox = () => {
  const { t } = useTranslation();

  return (
    <div className="_searchbox relative flex items-center bg-white rounded-md px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.6)] w-80 ml-10">
      <FiSearch
        className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400"
        size={20}
      />
      <input
        type="text"
        placeholder={t('search') || 'Search for products'}
        className="outline-none w-full text-[14px] pl-10"
      />
    </div>
  );
};

export default SearchBox;
