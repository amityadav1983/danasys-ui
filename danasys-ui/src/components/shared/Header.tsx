import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LocationPicker from "../LocationPicker";
import DeliveryToggle from "../DeliveryToggle";
import UserProfile from "../UserProfile";
import newLogo from "../../assets/images/COST2COST.png";
import { authService } from "../../services/auth";
import { productService } from "../../services/product";
import { useSearch } from "../../contexts/SearchContext";

const Header = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Grocery");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    searchQuery,
    setSearchQuery,
    filteredProducts,
    setFilteredProducts,
  } = useSearch();

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
      <div className="relative">
        <div
          className="absolute top-0 left-0 right-0 h-[350px] sm:h-[450px] pointer-events-none"
          style={{ background: "var(--header-gradient)" }}
        />

        <header
          className="_nav px-4 sm:px-8 fixed top-0 left-0 right-0 z-50 border-none shadow-none transition-colors duration-300"
          style={{
            background: isScrolled ? "#f8f8f8ff" : "transparent",
          }}
        >
          <div className="min-h-[80px] sm:min-h-[120px] mb-5 flex flex-col justify-center">
            {/* ✅ Mobile Header (2 Rows) */}
            <div className="sm:hidden w-full text-black">
              {/* Row 1: Toggle Center */}
             <div className="flex justify-center mb-2 mt-3">
  <div className="scale-140"> {/* 👈 ye button ko thoda bada kar dega */}
    <DeliveryToggle />
  </div>
</div>

              {/* Row 2: Location Left - User Right */}
              <div className="flex justify-between items-center">
                <LocationPicker />
                <UserProfile />
              </div>
            </div>

            {/* ✅ Desktop Header (grid layout for equal spacing) */}
            <div className="hidden sm:grid grid-cols-6 w-full h-full items-center gap-4">
              {/* 1 - Logo */}
              <div className="flex justify-start pl-6">
                <Link to={"/"}>
                  <img
                    src={newLogo}
                    alt="Cost2Cost Logo"
                    className="h-20 md:h-30 object-contain drop-shadow-md"
                  />
                </Link>
              </div>

              {/* 2 - Location Picker */}
              <div className="flex justify-center text-black pl-7">
                <LocationPicker />
              </div>

              {/* 3 - Delivery Toggle */}
              <div className="flex justify-center pl-6">
                <DeliveryToggle />
              </div>

              {/* 4 - Wallet */}
              <div className="flex justify-center pr-5">
                {userDetails?.userWalletImage && (
                  <img
                    src={userDetails.userWalletImage}
                    alt="Wallet"
                    className="w-12 h-12 object-contain cursor-pointer drop-shadow-md"
                  />
                )}
              </div>

              {/* 5 - Search */}
              <div className="flex justify-center relative pl-10">
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isHeroPast
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-4"
                  }`}
                >
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-[250px] md:w-[300px] h-10 px-4 py-2 pl-10 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
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

              {/* 6 - User Profile */}
              <div className="flex justify-center pl-14">
                <UserProfile />
              </div>
            </div>
          </div>
        </header>

        {/* Spacer */}
        <div className="h-[80px] sm:h-[60px] mb-1 sm:mb-0"></div>
      </div>

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
