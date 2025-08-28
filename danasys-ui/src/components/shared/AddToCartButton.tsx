import React from 'react';
import { IoAddSharp, IoRemoveSharp } from 'react-icons/io5';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { addItem, removeItem } from '../../store/cart';
import { CartProduct } from '../../utils/types';

type ButtonProps = {
  product: CartProduct;
  size?: 'sm' | 'lg';
};

const AddToCartButton = ({ product, size }: ButtonProps) => {
  const { cartItems } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const itemInCart = cartItems.find(
    (item) => item.product.id === product.id
  );
  const itemCount = itemInCart ? itemInCart.quantity : 0;

  const add = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(addItem({ ...product }));
  };

  const remove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(removeItem(product.id));
  };

  const handleItemAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(addItem({ ...product }));
  };

  return itemCount > 0 ? (
    <div
      className={`flex h-full w-full justify-around rounded-lg uppercase font-bold text-sm cursor-pointer ${
        size === 'lg' ? 'text-lg' : 'text-normal'
      } bg-green-600 text-white`}
    >
      <button
        onClick={remove}
        type="button"
        className="flex items-center justify-center w-8 text-white"
      >
        <IoRemoveSharp size={18} />
      </button>
      <span className="flex items-center justify-center text-white">
        {itemCount}
      </span>
      <button
        onClick={add}
        type="button"
        className="flex items-center justify-center w-8 text-white"
      >
        <IoAddSharp size={18} />
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={handleItemAdd}
      className={`_add_to_cart ${size === 'lg' ? 'text-md' : 'text-sm'} bg-white text-gray-700 font-semibold rounded-md px-3 py-1 flex items-center justify-center h-full w-full`}
    >
      Add
    </button>
  );
};

export default AddToCartButton;
