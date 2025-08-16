import { useState, useEffect } from 'react';
import { FaRegUser, FaShoppingBag } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CartButton } from '../cart';
import LocationPicker from '../LocationPicker';
import DeliveryToggle from '../DeliveryToggle';
import LanguageSelector from '../LanguageSelector';
import LoginModal from '../LoginModal';
import UserProfile from '../UserProfile';
import newLogo from '../../assets/images/COST2COST.png';

const Header = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Grocery');
  const location = useLocation();

  // Get theme color for selected category
  const selectedCategoryData = categories.find((cat: any) => cat.categoryName === selectedCategory);
  const themeColor = selectedCategoryData?.theemColorCode || '#349FDE';

  useEffect(() => {
    // Get selected category from URL
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get('category');
    if (fromUrl) {
      setSelectedCategory(fromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    // Fetch categories for theme color
    fetch('/api/product/productCategoryList')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
      });
  }, []);

  return (
    <>
      <header 
        className="_nav px-2 sm:px-0"
        style={{
          background: `linear-gradient(180deg, ${themeColor}FF 0%, ${themeColor}FF 20%, ${themeColor}CC 40%, ${themeColor}99 60%, ${themeColor}66 80%, transparent 100%) !important`,
          minHeight: '120px'
        }}
      >
        <div className="_header sm:flex h-full bg-transparent">
          {/* Logo */}
          <div className="hidden sm:flex max-w-[150px] md:max-w-[178px] w-full cursor-pointer sm:hover:bg-gray-50/50 items-center justify-center border-r _border-light bg-transparent">
            <Link to={'/'}>
            <img 
  src={newLogo} 
  alt="Cost2Cost Logo" 
  className="h-16 md:h-20 object-contain" 
/>
            </Link>
          </div>

          {/* Location Picker */}
          <div className="w-full sm:w-[240px] xl:w-[320px] py-3 px-1 sm:p-0 _header_loc flex items-center sm:justify-center cursor-pointer sm:hover:bg-gray-50/50 bg-transparent">
            <LocationPicker />
          </div>
          {/* Delivery Toggle */}
<div className="px-3 flex items-center">
  <DeliveryToggle />
</div>

          {/* Spacer to push remaining items to the right */}
          <div className="flex-1"></div>

          {/* User Profile (replaces old buttons) */}
          <div className="py-2 flex h-full items-center mr-4 bg-transparent">
            <UserProfile />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
