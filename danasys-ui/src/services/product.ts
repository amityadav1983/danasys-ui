import api from './api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  category: string;
  brand: string;
  inStock: boolean;
  rating?: number;
  reviews?: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  image?: string;
  productCount: number;
}

export const productService = {
  // Get all products
  getProducts: async (params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await api.get('/api/product/productList', { params });
    return response.data;
  },

  // Get product categories
  getCategories: async (): Promise<ProductCategory[]> => {
    const response = await api.get('/api/product/productCategoryList');
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get(`/api/product/${id}`);
    return response.data;
  },
};
