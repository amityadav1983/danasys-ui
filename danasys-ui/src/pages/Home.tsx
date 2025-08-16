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

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const getSelectedCategory = () => {
    const params = new URLSearchParams(location.search);
    return params.get('category') || 'Grocery';
  };

  useEffect(() => {
    const category = getSelectedCategory();

    setLoading(true);
    setError(null);

    fetch(`/api/product/productList?category=${encodeURIComponent(category)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        const filtered = Array.isArray(data)
          ? data.filter((p: any) => !p.category || p.category.toLowerCase() === category.toLowerCase())
          : [];
        const listToMap = filtered; // strictly show only selected category

        const mappedProducts = listToMap.map((item: any) => ({
          product_id: item.id,
          name: item.name,
          price: item.offerPrice,
          mrp: item.price,
          image_url: item.image,
          unit: '',
          discount: item.price > item.offerPrice ? ((item.price - item.offerPrice) / item.price) * 100 : 0,
          offer: '',
        }));
        setProducts(mappedProducts);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
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
        <ProductsRow data={{ title: `${selectedCategory} Products`, show_header: true }} objects={[{ data: { products: products } }]} />
      )}
      {!loading && !error && products.length === 0 && (
        <div className="py-8 text-center text-gray-600">No products found for {selectedCategory}.</div>
      )}
    </div>
  );
};

export default Home;
