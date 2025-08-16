import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Category {
  id: number;
  categoryName: string;
  description: string;
  status: string;
  image: string;
  theemColorCode: string;
}

const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Grocery');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get theme color for selected category
  const selectedCategoryData = categories.find(cat => cat.categoryName === selectedCategory);
  const themeColor = selectedCategoryData?.theemColorCode || '#349FDE';

  useEffect(() => {
    // Initialize from URL if provided
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get('category');
    if (fromUrl) {
      setSelectedCategory(fromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    fetch('/api/product/productCategoryList')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    const params = new URLSearchParams(location.search);
    params.set('category', categoryName);
    navigate({ pathname: '/', search: params.toString() });
  };

  const filteredCategories = categories.filter(category =>
    category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <section className="pt-8 relative">
      <div className="_container">
        <div className="flex justify-center gap-8 mb-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="cursor-pointer relative"
              onClick={() => handleCategoryClick(category.categoryName)}
            >
              <div className={`w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center transition-all duration-300 ${
                selectedCategory === category.categoryName 
                  ? 'ring-4 ring-blue-200 scale-110' 
                  : 'ring-0 scale-100'
              }`}>
                <img
                  src={category.image}
                  alt={category.categoryName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
                  {category.categoryName.charAt(0)}
                </div>
              </div>
              {selectedCategory === category.categoryName && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Search Results */}
          {searchQuery && (
            <div className="mt-3 bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-y-auto">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      setSelectedCategory(category.categoryName);
                      setSearchQuery('');
                      handleCategoryClick(category.categoryName);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img
                          src={category.image}
                          alt={category.categoryName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-800">{category.categoryName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-center">
                  No categories found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
