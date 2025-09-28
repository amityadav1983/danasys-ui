import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import { productService, ProductCategory, BusinessProfile } from '../../services/product';

const BusinessTiles = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Grocery');
  const [selectedBusinessProfile, setSelectedBusinessProfile] = useState<BusinessProfile | null>(null);

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

        // Default: first category + its first business profile
        if (categoriesData.length > 0) {
          const firstCategory = categoriesData[0];
          setSelectedCategory(firstCategory.categoryName);

          if (firstCategory.linkedBusinessProfile.length > 0) {
            const firstBusinessProfile = firstCategory.linkedBusinessProfile[0];
            setSelectedBusinessProfile(firstBusinessProfile);
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Initialize category and business from URL if provided
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    const businessFromUrl = params.get('business');

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }

    if (businessFromUrl) {
      // Find the business profile by ID
      const category = categories.find(cat => cat.categoryName === (categoryFromUrl || selectedCategory));
      if (category) {
        const business = category.linkedBusinessProfile.find(bp => bp.id.toString() === businessFromUrl);
        if (business) {
          setSelectedBusinessProfile(business);
        }
      }
    }
  }, [location.search, categories]);

  // Whenever category changes → select its first business profile automatically if no business selected
  useEffect(() => {
    if (selectedCategory && categories.length > 0 && !selectedBusinessProfile) {
      const category = categories.find((cat) => cat.categoryName === selectedCategory);
      if (category && category.linkedBusinessProfile.length > 0) {
        const firstBusinessProfile = category.linkedBusinessProfile[0];
        setSelectedBusinessProfile(firstBusinessProfile);
      }
    }
  }, [selectedCategory, categories, selectedBusinessProfile]);

  // Handle business profile selection
  const handleBusinessProfileClick = (businessProfile: BusinessProfile, categoryName: string) => {
    setSelectedBusinessProfile(businessProfile);
    setSelectedCategory(categoryName);

    const params = new URLSearchParams(location.search);
    params.set('category', categoryName);
    params.set('business', businessProfile.id.toString());
    navigate({ pathname: '/', search: params.toString() });
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">Loading business profiles...</div>
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

  const selectedCategoryData = categories.find((cat) => cat.categoryName === selectedCategory);

  return (
    <section className="py-8">
      <div className="_container">
        {/* Business Profiles as Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-6">
          {selectedCategoryData?.linkedBusinessProfile.map((businessProfile) => {
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
      </div>
    </section>
  );
};

export default BusinessTiles;
