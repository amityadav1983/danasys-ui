import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LocationPicker from "../LocationPicker";
import UserProfile from "../UserProfile";
import SearchSuggestions from "../SearchSuggestions";
import newLogo from "../../assets/images/COST2COST.png";
import { authService } from "../../services/auth";
import { productService } from "../../services/product";
import { useSearch } from "../../contexts/SearchContext";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Header = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Grocery");
  const [products, setProducts] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [headerGradient, setHeaderGradient] = useState("var(--header-gradient)");
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const { searchQuery, setSearchQuery, filteredProducts, setFilteredProducts, suggestions } =
    useSearch();

  const [isScrolled, setIsScrolled] = useState(false);

  // Rotating placeholder
  const placeholders = ["Egg", "Milk", "Bread", "Apple", "Orange", "Juice"];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  const [isHeroPast, setIsHeroPast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const heroAreaElement = document.querySelector("section.mt-4");
    if (!heroAreaElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsHeroPast(!entries[0].isIntersecting);
      },
      { threshold: 0, rootMargin: "-50px 0px 0px 0px" }
    );

    observer.observe(heroAreaElement);
    return () => observer.unobserve(heroAreaElement);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get("category");
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

        if (
          categoriesData.length > 0 &&
          categoriesData[0].linkedBusinessProfile.length > 0
        ) {
          const businessProfileId =
            categoriesData[0].linkedBusinessProfile[0].id;
          const productsData =
            await productService.getProductsByBusinessProfile(businessProfileId);
          setProducts(productsData.products);
          setFilteredProducts(productsData.products);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Update header gradient based on selected category
  useEffect(() => {
    if (categories.length > 0) {
      const currentCat = categories.find(c => c.categoryName === selectedCategory) || categories[0];
      if (currentCat && currentCat.theemColorCode) {
        const color = currentCat.theemColorCode;
        const rgba0 = hexToRgba(color, 0.8);
        const rgba20 = hexToRgba(color, 0.4);
        const rgba40 = hexToRgba(color, 0.2);
        const rgba60 = hexToRgba(color, 0.2);
        const gradient = `linear-gradient(180deg, ${rgba0} 0%, ${rgba20} 20%, ${rgba40} 40%, ${rgba60} 60%, rgba(255,255,255,0) 100%)`;
        setHeaderGradient(gradient);
      }
    }
  }, [categories, selectedCategory]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleSelectProduct = (product: any) => {
    setSearchQuery(product.name);
    setFilteredProducts([product]);
  };

  return (
    <>
      {/* Gradient background behind header */}
      <div
        className="absolute top-0 left-0 right-0 h-[450px] sm:h-[650px] pointer-events-none"
        style={{ background: headerGradient }}
      />

      {/* ✅ Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
        style={{
          background: "transparent",
          boxShadow: "none",
        }}
      >
        <div className="min-h-[80px] sm:min-h-[100px] flex flex-col justify-center">
          {/* ✅ Mobile Header - Single Row */}
          <div className="sm:hidden w-full text-black px-4">
            <div className="flex justify-between items-center">
              <LocationPicker />
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  {userDetails?.userWalletImage && (
                    <img
                      src={userDetails.userWalletImage}
                      alt="Wallet"
                      className="w-8 h-8 object-contain cursor-pointer"
                    />
                  )}
                  {userDetails?.userWalletBalance && (
                    <span className="text-xs text-gray-600">₹{userDetails.userWalletBalance}</span>
                  )}
                </div>
                <UserProfile />
              </div>
            </div>
          </div>

          {/* ✅ Desktop Header (flexible layout with wider search) */}
          {!isScrolled ? (
            <div className="hidden sm:flex w-full h-full items-center px-8">
              {/* Left Section - Logo */}
              <div className="flex items-center mr-10">
                <Link to={"/"}>
                  <img
                    src={userDetails?.companyLogo || newLogo}
                    alt="Company Logo"
                    className="h-24 object-contain drop-shadow-md"
                  />
                </Link>
              </div>

              {/* Center Section - Location and Search */}
              <div className="flex items-center gap-12 flex-1">
                <LocationPicker />
                <div className="relative flex-1 max-w-3xl">
                  <div className="relative flex items-center bg-white rounded-full border border-gray-200 shadow-lg">
                    <FiSearch
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                      size={18}
                    />
                    {!searchQuery && (
                      <>
                        <span className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-0">Search product</span>
                        <div className="absolute left-[120px] top-1/2 -translate-y-1/2 overflow-hidden h-6 w-full pointer-events-none z-0">
                          <div className="transition-transform duration-800 ease-in-out" style={{ transform: `translateY(-${currentIndex * 20}px)` }}>
                            {placeholders.map((item, index) => (
                              <div key={index} className="h-5 font-bold ml-8 text-gray-500">{item}</div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    <input
                      type="text"
                      placeholder=""
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full h-10 px-4 py-2 pl-10 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent z-10 relative"
                    />
                  </div>

                  <SearchSuggestions
                    isOpen={searchQuery.trim() !== '' && suggestions.length > 0}
                    onSelect={handleSelectProduct}
                  />
                </div>
              </div>

              {/* Right Section - Wallet and User Profile */}
              {/* Wallet + Profile */}
                <div className="flex items-center gap-5 ml-8">
                  {userDetails?.userWalletImage && (
                    <div className="flex flex-col items-center">
                      <img
                        src={userDetails.userWalletImage}
                        alt="Wallet"
                        className="w-9 h-9 object-contain cursor-pointer drop-shadow hover:scale-110 transition"
                      />
                      <span className="text-xs text-gray-700 font-medium">
                        ₹{userDetails?.userWalletBalance}
                      </span>
                    </div>
                  )}
                  <UserProfile />
                </div>
            </div>
          ) : (
            <div className="hidden sm:flex w-full h-full items-center px-8 justify-center">
              <div className="relative w-80">
                <div className="relative flex items-center bg-white rounded-full border border-gray-200 shadow-lg">
                  <FiSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                    size={20}
                  />
                  {!searchQuery && (
                    <>
                      <span className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-0">Search product</span>
                      <div className="absolute left-[120px] top-1/2 -translate-y-1/2 overflow-hidden h-5 w-full pointer-events-none z-0">
                        <div className="transition-transform duration-500 ease-in-out" style={{ transform: `translateY(-${currentIndex * 20}px)` }}>
                          {placeholders.map((item, index) => (
                            <div key={index} className="h-5 font-bold ml-8 text-gray-500">{item}</div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  <input
                    type="text"
                    placeholder=""
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full h-16 px-4 py-2 pl-10 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent z-10 relative"
                  />
                </div>

                <SearchSuggestions
                  isOpen={searchQuery.trim() !== '' && suggestions.length > 0}
                  onSelect={handleSelectProduct}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[80px] sm:h-[60px]"></div>

      {/* ✅ Mobile Sticky Search */}
      {isHeroPast && (
        <div className="sm:hidden fixed top-[100px] left-0 right-0 z-40 bg-white px-2 py-2 shadow">
          <div className="relative flex items-center bg-white rounded-full border border-gray-300">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
              size={18}
            />
            {!searchQuery && (
              <>
                <span className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-0">Search product</span>
                <div className="absolute left-[200px] top-1/2 -translate-y-1/2 overflow-hidden h-10 w-full pointer-events-none z-0">
                  <div className="transition-transform duration-500 ease-in-out" style={{ transform: `translateY(-${currentIndex * 20}px)` }}>
                    {placeholders.map((item, index) => (
                      <div key={index} className="h-5 font-bold  text-gray-500">{item}</div>
                    ))}
                  </div>
                </div>
              </>
            )}
            <input
              type="text"
              placeholder=""
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 pl-10 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent z-10 relative"
            />
          </div>

          <SearchSuggestions
            isOpen={searchQuery.trim() !== '' && suggestions.length > 0}
            onSelect={handleSelectProduct}
          />
        </div>
      )}
    </>
  );
};

export default Header;
