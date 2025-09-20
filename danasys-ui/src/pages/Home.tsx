
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  HeroArea,
  CategoriesList,
  DiscountOffers,
  FeaturedPromo,
  HighlightedPromo,
  ProductsRow,
} from '../components/home';
import { authService } from '../services/auth';
import { productService } from '../services/product';

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const [categoriesData, setCategoriesData] = useState<any[]>([]);

  const getSelectedCategory = () => {
    const params = new URLSearchParams(location.search);
    return params.get('category') || categoriesData[0]?.categoryName || 'Grocery';
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

        // Find the selected category and get its first business profile
        const selectedCategoryData = categories.find(
          cat => cat.categoryName.toLowerCase() === category.toLowerCase()
        );

        if (!selectedCategoryData || selectedCategoryData.linkedBusinessProfile.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        // Use the first business profile for the selected category
        const businessProfileId = selectedCategoryData.linkedBusinessProfile[0].id;

        // Get products from API
        const productsData = await productService.getProductsByBusinessProfile(businessProfileId, {
          category
        });
        console.log('Fetched products data:', productsData);

        if (Array.isArray(productsData)) {
          // Map products
          const mappedProducts = productsData.map((item: any) => ({
            product_id: item.id,
            name: item.name,
            price: item.offerPrice,
            mrp: item.price,
            image_url: item.image,
            unit: '',
            discount: item.price > item.offerPrice ? ((item.price - item.offerPrice) / item.price) * 100 : 0,
            offer: '',
            category: item.category,
            rating: item.starRating || 0 // Include starRating from API response
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
      <HeroArea />
      {/* <FeaturedPromo />
      <CategoriesList />
      <DiscountOffers />
      <HighlightedPromo /> */}
      {loading && <div>Loading products...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {!loading && !error && products.length > 0 && (
        <ProductsRow
          data={{ title: `${selectedCategory} Products`, show_header: true }}
          objects={[{ data: { products: products || [] } }]}
        />
      )}
      {!loading && !error && products.length === 0 && (
        <div className="py-8 text-center text-gray-600">
          No products found for {selectedCategory}.
        </div>
      )}
    </div>
  );
};

export default Home;
