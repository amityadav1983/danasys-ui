import React from 'react';
import { useSearch } from '../contexts/SearchContext';

type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
  offerPrice?: number;
};

interface SearchSuggestionsProps {
  isOpen: boolean;
  onSelect: (product: Product) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ isOpen, onSelect }) => {
  const { suggestions } = useSearch();

  if (!isOpen || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
      {suggestions.map((product) => (
        <div
          key={product.id}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors flex items-center gap-2"
          onClick={() => onSelect(product)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-8 h-8 object-contain"
          />
          <p className="text-sm font-medium text-gray-800">{product.name}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchSuggestions;
