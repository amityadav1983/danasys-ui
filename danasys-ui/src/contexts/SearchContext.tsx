import { createContext, useContext, useState } from "react";

type Product = {
  id: number;
  name: string;
  image: string;
};

type SearchContextType = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filteredProducts: Product[];
  setFilteredProducts: (value: Product[]) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  return (
    <SearchContext.Provider
      value={{ searchQuery, setSearchQuery, filteredProducts, setFilteredProducts }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
