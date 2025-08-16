import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
        <FaGlobe size={20} className="-ml-3" />
        <span>{i18n.language === 'en' ? 'Language' : 'हिंदी'}</span>
      </button>
      
      <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <button
          onClick={() => handleLanguageChange('en')}
          className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
            i18n.language === 'en' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
          }`}
        >
          English
        </button>
        <button
          onClick={() => handleLanguageChange('hi')}
          className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
            i18n.language === 'hi' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
          }`}
        >
          हिंदी
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
