import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa";
import { useState } from "react";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setOpen(false); // close after select
  };

  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <FaGlobe size={18} className="text-blue-600" />
        <span>
          {i18n.language === "en" ? "Language" : "भाषा"}
        </span>
        {/* <svg
          className={`w-3 h-3 ml-auto transform transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg> */}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            onClick={() => handleLanguageChange("en")}
            className={`block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
              i18n.language === "en"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700"
            }`}
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange("hi")}
            className={`block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${
              i18n.language === "hi"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700"
            }`}
          >
            हिंदी
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
