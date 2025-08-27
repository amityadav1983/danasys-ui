import { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LocationPicker from '../LocationPicker';
import DeliveryToggle from '../DeliveryToggle';
import UserProfile from '../UserProfile';
import newLogo from '../../assets/images/COST2COST.png';
import { authService } from '../../services/auth';
import { productService } from '../../services/product';
import { useSearch } from '../../contexts/SearchContext';

const Header = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Grocery');
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { searchQuery, setSearchQuery, filteredProducts, setFilteredProducts } = useSearch();

  const categoriesRef = useRef<HTMLDivElement | null>(null);

  const selectedCategoryData = categories.find((cat: any) => cat.categoryName === selectedCategory);
  const themeColor = selectedCategoryData?.theemColorCode || '#349FDE';

  // 👇 IntersectionObserver to detect when categories pass
  useEffect(() => {
    if (!categoriesRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowSearch(false); // categories visible -> hide search
        } else {
          setShowSearch(true); // categories passed -> show search
        }
      },
      { threshold: 0 }
    );

    observer.observe(categoriesRef.current);

    return () => {
      if (categoriesRef.current) observer.unobserve(categoriesRef.current);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get('category');
    if (fromUrl) {
      setSelectedCategory(fromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetailsData = await authService.getUserDetails();
        setUserDetails(userDetailsData);
        const serviceAreaId = userDetailsData.serviceAreaId;

        if (!serviceAreaId) return;

        const categoriesData = await productService.getCategories(serviceAreaId);
        setCategories(categoriesData);

        if (categoriesData.length > 0 && categoriesData[0].linkedBusinessProfile.length > 0) {
          const businessProfileId = categoriesData[0].linkedBusinessProfile[0].id;
          const productsData = await productService.getProductsByBusinessProfile(businessProfileId);
          setProducts(productsData.products);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleSelectProduct = (productId: number) => {
    setSearchQuery('');
    setFilteredProducts([]);
    const element = document.getElementById(`product-${productId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <>
      <header 
        className="_nav px-2 sm:px-0 fixed top-0 left-0 right-0 z-50 bg-white"
        style={{
          background: 'var(--header-gradient) !important'
        }}
      >
        
        <div className="min-h-[100px] sm:min-h-[120px] flex flex-col justify-center">
          {/* ✅ Mobile Header */}
          <div className="flex w-full items-center justify-between sm:hidden">
            {/* Left → Delivery Address */}
            <div className="cursor-pointer">
              <LocationPicker />
            </div>

            {/* Right → User Profile */}
            <UserProfile/>
          </div>

          {/* ✅ Desktop Header */}
          <div className="hidden sm:flex h-full bg-transparent relative">
            {/* Logo */}
            <div className="hidden sm:flex max-w-[150px] md:max-w-[178px] w-full cursor-pointer items-center justify-center ml-4 bg-transparent">
              <Link to={'/'}>
                <img src={newLogo} alt="Cost2Cost Logo" className="h-16 md:h-20 object-contain" />
              </Link>
            </div>

            {/* Location Picker */}
            <div className="w-full sm:w-[240px] xl:w-[320px] py-3 px-1 sm:p-0 flex items-center sm:justify-center cursor-pointer bg-transparent">
              <LocationPicker />
            </div>

            {/* Delivery Toggle - hide on mobile */}
            <div className="px-3 items-center hidden sm:flex">
              <DeliveryToggle />
            </div>

            {/* Wallet Image - hide on mobile */}
            {userDetails?.userWalletImage && (
              <div className="px-3 items-center hidden sm:flex">
                <img 
                  src={userDetails.userWalletImage} 
                  alt="Wallet" 
                  className="w-8 h-8 object-contain cursor-pointer"
                />
              </div>
            )}

            {/* Search Bar - hide on mobile */}
            <div className="flex-1 justify-center items-center relative hidden sm:flex">
              <div
                className={`transition-all duration-300 ease-in-out ${
                  showSearch ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
              >
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-[250px] md:w-[300px] h-10 px-4 py-2 pl-10 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90 backdrop-blur-sm"
                  />
                  <FiSearch 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                    size={18} 
                  />
                </div>

                {filteredProducts.length > 0 && (
                  <ul className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-md max-h-60 overflow-y-auto z-50">
                    {filteredProducts.map((product) => (
                      <li
                        key={product.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={() => handleSelectProduct(product.id)}
                      >
                        <img src={product.image} alt={product.name} className="w-8 h-8 object-contain" />
                        <span>{product.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* User Profile */}
            <div className="py-2 flex h-full items-center mr-4 bg-transparent">
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      {/* Spacer div */}
      <div className="h-[80px] sm:h-[120px] mb-1 sm:mb-0"></div> 

      {/* 👇 Categories Section (tracked for mobile scroll) */}
      <div ref={categoriesRef} className="sm:mt-4">
        {/* Yaha aap apna categories wala UI render karte ho */}
      </div>

      {/* ✅ Mobile Sticky Search - appears only after categories scroll */}
      {showSearch && (
        <div className="sm:hidden sticky top-[80px] z-40 bg-white px-2 py-2 shadow">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>

          {filteredProducts.length > 0 && (
            <ul className="absolute mt-2 w-full bg-white shadow-lg rounded-md max-h-60 overflow-y-auto z-50">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  onClick={() => handleSelectProduct(product.id)}
                >
                  <img src={product.image} alt={product.name} className="w-8 h-8 object-contain" />
                  <span>{product.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default Header;