import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LocationPicker from "../LocationPicker";
import UserProfile from "../UserProfile";
import newLogo from "../../assets/images/COST2COST.png";
import { authService } from "../../services/auth";
import { productService } from "../../services/product";
import { useSearch } from "../../contexts/SearchContext";

const Header = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Grocery");
  const [products, setProducts] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { searchQuery, setSearchQuery, filteredProducts, setFilteredProducts } =
    useSearch();

  const [isScrolled, setIsScrolled] = useState(false);
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
        }
      } catch (err) {
        console.error("Error fetching data:", err);
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
    setSearchQuery("");
    setFilteredProducts([]);
    const element = document.getElementById(`product-${productId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <>
      {/* Gradient background behind header */}
      <div
        className="absolute top-0 left-0 right-0 h-[350px] sm:h-[450px] pointer-events-none"
        style={{ background: "var(--header-gradient)" }}
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
                {userDetails?.userWalletImage && (
                  <img
                    src={userDetails.userWalletImage}
                    alt="Wallet"
                    className="w-8 h-8 object-contain cursor-pointer"
                  />
                )}
                <UserProfile />
              </div>
            </div>
          </div>

          {/* ✅ Desktop Header (flexible layout with wider search) */}
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
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full h-10 px-4 py-2 pl-10 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
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
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-8 h-8 object-contain"
                        />
                        <span>{product.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right Section - Wallet and User Profile */}
            <div className="flex items-center gap-4 ml-8">
              {userDetails?.userWalletImage && (
                <img
                  src={userDetails.userWalletImage}
                  alt="Wallet"
                  className="w-8 h-8 object-contain cursor-pointer drop-shadow-md"
                />
              )}
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[80px] sm:h-[60px]"></div>

      {/* ✅ Mobile Sticky Search */}
      {isHeroPast && (
        <div className="sm:hidden fixed top-[100px] left-0 right-0 z-40 bg-white px-2 py-2 shadow">
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
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-8 h-8 object-contain"
                  />
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
