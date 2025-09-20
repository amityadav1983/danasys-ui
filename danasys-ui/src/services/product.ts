import api from './api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  offerPrice: number;
  category: string;
  quantity: number;
  image: string;
  moreAbout: string;
  businessUserProfileId: number;
  status: string | null;
  version: number;
  rating?: number; // Add rating field for star ratings
  starRating?: number; // Add starRating field as mentioned by user
}

export interface BusinessProfile {
  id: number;
  storeName: string;
  businessLogoPath: string;
}

export interface ProductCategory {
  id: number;
  categoryName: string;
  image?: string;
  productCount: number;
  themeColorCode?: string;
  linkedBusinessProfile: BusinessProfile[];
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

  // Get product categories with serviceAreaId
  getCategories: async (serviceAreaId: number): Promise<ProductCategory[]> => {
    const response = await api.get(`/api/user/productCategoryList/${serviceAreaId}`);
    return response.data;
  },

  // Get products by business profile
  getProductsByBusinessProfile: async (businessUserProfileId: number, params?: {
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
    const response = await api.get('/api/product/productList', {
      params: { ...params, businessUserProfileId }
    });
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get(`/api/product/${id}`);
    return response.data;
  },
};
