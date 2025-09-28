import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import { productService, ProductCategory, BusinessProfile, Product } from '../../services/product';

const CategoriesSection = () => {
  // This component has been split into CategoriesIcons and BusinessTiles.
  // CategoriesIcons is used in Layout.tsx above main content.
  // BusinessTiles is used in Home.tsx below HeroArea.
  // Keeping this file for reference or future use.
  return null; // Component split, no longer used
};

export default CategoriesSection;
