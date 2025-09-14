import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import { productService, ProductCategory, BusinessProfile, Product } from '../../services/product';

const CategoriesSection = () => {
  // States
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Grocery');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusinessProfile, setSelectedBusinessProfile] = useState<BusinessProfile | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Theme color for selected category
  const selectedCategoryData = categories.find(
    (cat) => cat.categoryName === selectedCategory
  );
  const themeColor = selectedCategoryData?.themeColorCode || '#349FDE';

  // Fetch user details, then categories and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const userDetails = await authService.getUserDetails();
        const serviceAreaId = userDetails.serviceAreaId;

        if (!serviceAreaId) {
          throw new Error('Service area ID not found in user details');
        }

        const categoriesData = await productService.getCategories(serviceAreaId);
        setCategories(categoriesData);

        // ✅ Default: first category + its first business profile
        if (categoriesData.length > 0) {
          const firstCategory = categoriesData[0];
          setSelectedCategory(firstCategory.categoryName);

          if (firstCategory.linkedBusinessProfile.length > 0) {
            const firstBusinessProfile = firstCategory.linkedBusinessProfile[0];
            setSelectedBusinessProfile(firstBusinessProfile);

            const productsData = await productService.getProductsByBusinessProfile(firstBusinessProfile.id);
            setProducts(productsData.products);
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize category from URL if provided
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get('category');
    if (fromUrl) {
      setSelectedCategory(fromUrl);
    }
  }, [location.search]);

  // ✅ Whenever category changes → select its first business profile automatically
  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const category = categories.find((cat) => cat.categoryName === selectedCategory);
      if (category && category.linkedBusinessProfile.length > 0) {
        const firstBusinessProfile = category.linkedBusinessProfile[0];
        setSelectedBusinessProfile(firstBusinessProfile);

        // Fetch products for first business profile
        productService.getProductsByBusinessProfile(firstBusinessProfile.id).then((productsData) => {
          setProducts(productsData.products);
        });
      }
    }
  }, [selectedCategory, categories]);

  // Handle category selection
  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSelectedBusinessProfile(null);

    const params = new URLSearchParams(location.search);
    params.set('category', categoryName);
    navigate({ pathname: '/', search: params.toString() });

    const element = document.getElementById(`category-${categoryName}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle business profile selection
  const handleBusinessProfileClick = async (businessProfile: BusinessProfile, categoryName: string) => {
    setSelectedBusinessProfile(businessProfile);
    setSelectedCategory(categoryName);

    try {
      setLoading(true);
      const productsData = await productService.getProductsByBusinessProfile(businessProfile.id);
      setProducts(productsData.products);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setLoading(false);
    }
  };

  // Filter logic for search
  const getFilteredResults = () => {
    const query = searchQuery.toLowerCase();

    const filteredCategories = categories.filter((category) =>
      category.categoryName.toLowerCase().includes(query)
    );

    const filteredProducts = (products || []).filter(
      (product) =>
        (product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)) &&
        (!selectedCategory || product.category === selectedCategory)
    );

    return { filteredCategories, filteredProducts };
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  const { filteredCategories, filteredProducts } = getFilteredResults();

  return (
    <section className="pt-8 relative">
      <div className="_container">
        {/* ✅ Category Icons (Left aligned, better UI) */}
        <div className="flex flex-wrap gap-6 mb-8 justify-start">
          {categories.map((category) => (
            <div
              key={category.id}
              className="cursor-pointer flex flex-col items-center w-20 group"
              onClick={() => handleCategoryClick(category.categoryName)}
            >
              <div
                className={`w-16 h-16 flex items-center rounded-full justify-center transition-all duration-300 ${
                  selectedCategory === category.categoryName
                    ? 'ring-2 ring-blue-500 rounded-full scale-110'
                    : 'hover:scale-150'
                }`}
              >
                <img
                  src={category.image}
                  alt={category.categoryName}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="mt-2 text-xs font-medium text-gray-700 text-center whitespace-normal leading-tight">
                {category.categoryName}
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Business Profiles as Tiles (Left aligned grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-6">
          {categories
            .find((cat) => cat.categoryName === selectedCategory)
            ?.linkedBusinessProfile.map((businessProfile) => {
              const isSelected = selectedBusinessProfile?.id === businessProfile.id;

              return (
                <div
                  key={businessProfile.id}
                  className={`cursor-pointer flex flex-col items-center p-4 rounded-xl border transition-all duration-300 ${
                    isSelected
                      ? 'ring-2 ring-blue-500 bg-blue-50 scale-105 shadow-md'
                      : 'hover:scale-105 hover:shadow'
                  }`}
                  onClick={() =>
                    handleBusinessProfileClick(businessProfile, selectedCategory)
                  }
                >
                  <div className="w-16 h-20 flex items-center justify-center mb-3">
                    <img
                      src={businessProfile.businessLogoPath}
                      alt={businessProfile.storeName}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                      {businessProfile.storeName.charAt(0)}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-800 text-center whitespace-normal leading-tight">
                    {businessProfile.storeName}
                  </div>
                </div>
              );
            })}
        </div>

        {/* 🚫 Search Bar Disabled */}
        {/*
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories and products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {searchQuery && (
            <div className="mt-3 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
              ...
            </div>
          )}
        </div>
        */}
      </div>
    </section>
  );
};

export default CategoriesSection;
