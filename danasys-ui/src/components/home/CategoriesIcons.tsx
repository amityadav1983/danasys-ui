import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import { productService, ProductCategory } from '../../services/product';

const CategoriesIcons = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Grocery');

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const userDetails = await authService.getUserDetails();
        const serviceAreaId = userDetails.serviceAreaId;

        if (!serviceAreaId) {
          throw new Error('Service area ID not found in user details');
        }

        const categoriesData = await productService.getCategories(serviceAreaId);
        setCategories(categoriesData);

        // Default: first category
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].categoryName);
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Initialize category from URL if provided
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get('category');
    if (fromUrl) {
      setSelectedCategory(fromUrl);
    }
  }, [location.search]);

  // Handle category selection
  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);

    const params = new URLSearchParams(location.search);
    params.set('category', categoryName);
    navigate({ pathname: '/', search: params.toString() });

    const element = document.getElementById(`category-${categoryName}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">Loading categories...</div>
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

  return (
    <section className="pt-8 pb-0 relative">
      <div className="_container">
        {/* Category Icons (Horizontal scrollable) */}
        <div
          className="
            flex overflow-x-auto gap-6 no-scrollbar px-4 items-center h-28
            sm:justify-start
            [@media(max-width:640px)]:gap-2
            [@media(max-width:640px)]:pl-3
            [@media(max-width:640px)]:mt-2
          "
        >
          {categories.map((category) => (
            <div
              key={category.id}
              className="
                flex-none cursor-pointer flex flex-col items-center w-20 group
                [@media(max-width:640px)]:w-1/4
              "
              onClick={() => handleCategoryClick(category.categoryName)}
            >
              {/* Circle */}
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full transition-all duration-300 ${
                  selectedCategory === category.categoryName
                    ? 'scale-110'
                    : 'hover:scale-110'
                }`}
              >
                <img
                  src={category.image}
                  alt={category.categoryName}
                  className="w-10 h-10 object-contain"
                />
              </div>

              {/* Text with Fancy Underline */}
              <div className="relative mt-2 text-xs font-medium text-gray-700 text-center leading-tight">
                {category.categoryName}

                {selectedCategory === category.categoryName && (
                  <span className="absolute left-1/2 -bottom-3 w-10 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform -translate-x-1/2 animate-[scaleX_0.5s_ease-out]"></span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesIcons;
