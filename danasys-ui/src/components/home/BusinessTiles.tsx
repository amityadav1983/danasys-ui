import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth";
import {
  productService,
  ProductCategory,
  BusinessProfile,
} from "../../services/product";

const BusinessTiles = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Grocery");
  const [selectedBusinessProfile, setSelectedBusinessProfile] =
    useState<BusinessProfile | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const userDetails = await authService.getUserDetails();
        const serviceAreaId = userDetails.serviceAreaId;

        if (!serviceAreaId) {
          throw new Error("Service area ID not found in user details");
        }

        const categoriesData = await productService.getCategories(serviceAreaId);
        setCategories(categoriesData);

        if (categoriesData.length > 0) {
          const firstCategory = categoriesData[0];
          setSelectedCategory(firstCategory.categoryName);

          if (firstCategory.linkedBusinessProfile.length > 0) {
            setSelectedBusinessProfile(firstCategory.linkedBusinessProfile[0]);
          }
        }

        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch categories"
        );
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("category");
    const businessFromUrl = params.get("business");

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }

    if (businessFromUrl) {
      const category = categories.find(
        (cat) => cat.categoryName === (categoryFromUrl || selectedCategory)
      );
      if (category) {
        const business = category.linkedBusinessProfile.find(
          (bp) => bp.id.toString() === businessFromUrl
        );
        if (business) {
          setSelectedBusinessProfile(business);
        }
      }
    }
  }, [location.search, categories]);

  const handleBusinessProfileClick = (
    businessProfile: BusinessProfile,
    categoryName: string
  ) => {
    setSelectedBusinessProfile(businessProfile);
    setSelectedCategory(categoryName);

    const params = new URLSearchParams(location.search);
    params.set("category", categoryName);
    params.set("business", businessProfile.id.toString());
    navigate({ pathname: "/", search: params.toString() });
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500">
        Loading business profiles...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">Error: {error}</div>
    );
  }

  const selectedCategoryData = categories.find(
    (cat) => cat.categoryName === selectedCategory
  );

  if (!selectedCategoryData) return null;

  const businessCount = selectedCategoryData.linkedBusinessProfile.length;
  if (businessCount === 1) return null;

  return (
    <section className="py-8">
      <div className="_container">
        <div
          className={`grid gap-8`}
          style={{
            gridTemplateColumns: `repeat(${businessCount}, minmax(0, 1fr))`,
          }}
        >
          {selectedCategoryData.linkedBusinessProfile.map((businessProfile) => {
            const isSelected = selectedBusinessProfile?.id === businessProfile.id;

            return (
              <div
                key={businessProfile.id}
                className={`relative cursor-pointer rounded-2xl overflow-hidden shadow-lg group transition-all duration-100 ${
                  isSelected
                    ? "ring-4 ring-blue-800 scale-[1.05] shadow-2xl"
                    : "hover:scale-[1.02] hover:shadow-xl"
                }`}
                onClick={() =>
                  handleBusinessProfileClick(businessProfile, selectedCategory)
                }
              >
                {/* Business Image */}
                <img
                  src={businessProfile.businessLogoPath}
                  alt={businessProfile.storeName}
                  className="w-full h-40 md:h-48 object-cover transition-transform duration-500 group-hover:scale-100"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                {/* Store Name */}
                <div className="absolute bottom-3 w-full text-center text-white font-semibold text-base md:text-lg drop-shadow">
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
