
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HeroArea,
  ProductsRow,
  BusinessTiles,
} from '../components/home';
import { authService } from '../services/auth';
import { productService } from '../services/product';
import { useSearch } from '../contexts/SearchContext';

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [selectedCategoryData, setSelectedCategoryData] = useState<any>(null);
  const { filteredProducts } = useSearch();

  const getSelectedCategory = () => {
    const params = new URLSearchParams(location.search);
    return params.get('category') || categoriesData[0]?.categoryName || 'Grocery';
  };

  const getSelectedBusinessId = () => {
    const params = new URLSearchParams(location.search);
    return params.get('business');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const category = getSelectedCategory();
        setLoading(true);
        setError(null);

        // Get user details to get serviceAreaId
        const userDetails = await authService.getUserDetails();
        const serviceAreaId = userDetails.serviceAreaId;

        if (!serviceAreaId) {
          throw new Error('Service area ID not found in user details');
        }

        // Get categories to find business profile for the selected category
        const categories = await productService.getCategories(serviceAreaId);
        setCategoriesData(categories);

        // Set selected category data
        const selectedCatName = getSelectedCategory();
        const selectedCat = categories.find(cat => cat.categoryName.toLowerCase() === selectedCatName.toLowerCase());
        setSelectedCategoryData(selectedCat || null);

        // Find the selected category and get its first business profile
        const selectedCategoryData = categories.find(
          cat => cat.categoryName.toLowerCase() === category.toLowerCase()
        );

        if (!selectedCategoryData || selectedCategoryData.linkedBusinessProfile.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        // Use the selected business profile if specified, else first one
        const businessParam = getSelectedBusinessId();
        let businessProfileId;
        if (businessParam) {
          const selectedBusiness = selectedCategoryData.linkedBusinessProfile.find(bp => bp.id.toString() === businessParam);
          businessProfileId = selectedBusiness ? selectedBusiness.id : selectedCategoryData.linkedBusinessProfile[0].id;
        } else {
          businessProfileId = selectedCategoryData.linkedBusinessProfile[0].id;
        }

        // Get products from API
        const productsData = await productService.getProductsByBusinessProfile(businessProfileId, {
          category
        });
        console.log('Fetched products data:', productsData);

        if (Array.isArray(productsData)) {
          // Map products to match ProductItem interface
          const mappedProducts = productsData.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            offerPrice: item.offerPrice,
            price: item.price,
            image: item.image,
            starRating: item.starRating || 0,
            quantity: item.quantity,
            category: item.category,
            // Keep old properties for compatibility with other components
            product_id: item.id,
            mrp: item.price,
            image_url: item.image,
            rating: item.starRating || 0,
            unit: '',
            discount: item.price > item.offerPrice ? ((item.price - item.offerPrice) / item.price) * 100 : 0,
            offer: '',
          }));

          // Filter by selected category
          const filteredProducts = mappedProducts.filter(
            product => product.category.toLowerCase() === category.toLowerCase()
          );

          setProducts(filteredProducts);
        } else {
          throw new Error('Invalid products data structure');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  const selectedCategory = getSelectedCategory();

  return (
    <div className="_container">
      <HeroArea
        greetingImage={selectedCategoryData?.greetingOfTheDay}
        dealImages={selectedCategoryData?.dealOfTheDayImages || []}
      />
      <BusinessTiles />
      {/* <FeaturedPromo />
      <CategoriesList />
      <DiscountOffers />
      <HighlightedPromo /> */}
      {loading && <div>Loading products...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {!loading && !error && ((filteredProducts?.length ?? 0) > 0 ? filteredProducts : (products ?? [])).length > 0 && (
        <ProductsRow
          data={{ title: `${selectedCategory} Products`, show_header: true }}
          objects={[{ data: { products: (filteredProducts?.length ?? 0) > 0 ? filteredProducts : (products ?? []) } }]}
        />
      )}
      {!loading && !error && ((filteredProducts?.length ?? 0) > 0 ? filteredProducts : (products ?? [])).length === 0 && (
        <div className="py-8 text-center text-gray-600">
          No products found for {selectedCategory}.
        </div>
      )}
    </div>
  );
};

export default Home;
