import React from 'react';
import { useSearch } from '../contexts/SearchContext';

interface SearchSuggestionsProps {
  isOpen: boolean;
  onSelect: (productName: string) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ isOpen, onSelect }) => {
  const { filteredProducts } = useSearch();

  console.log('SearchSuggestions rendered:', {
    isOpen,
    filteredProductsCount: filteredProducts.length,
    filteredProducts: filteredProducts.map(p => ({ id: p.id, name: p.name }))
  });

  if (!isOpen || filteredProducts.length === 0) {
    console.log('SearchSuggestions not showing - isOpen:', isOpen, 'products count:', filteredProducts.length);
    return null;
  }

  console.log('Showing search suggestions with', filteredProducts.length, 'products');

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
          onClick={() => {
            console.log('Product suggestion clicked:', product.name);
            onSelect(product.name);
          }}
        >
          <div className="flex items-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-8 h-8 object-cover rounded mr-3"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">{product.name}</p>
              <p className="text-xs text-gray-500">₹{product.offerPrice || product.price}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchSuggestions;
