import React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addItem } from '../../store/cart';

const TestCartButton: React.FC = () => {
  const dispatch = useAppDispatch();

  const addTestItem = () => {
    const testProduct = {
      id: 'test-1',
      title: 'Test Product',
      subTitle: 'Test Unit',
      image: 'https://via.placeholder.com/150',
      price: 100,
      mrp: 120
    };

    dispatch(addItem(testProduct));
    console.log('Test item added to cart');
  };

  return (
    <button
      onClick={addTestItem}
      className="fixed top-20 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg z-50"
    >
      Add Test Item to Cart
    </button>
  );
};

export default TestCartButton;
