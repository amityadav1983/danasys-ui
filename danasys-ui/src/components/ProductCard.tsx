import { useNavigate } from "react-router-dom";
import AddToCartButton from "./shared/AddToCartButton";
import StarRating from "./shared/StarRating";
import { CartProduct, ProductItem } from "../utils/types";
import { convertTextToURLSlug } from "../utils/helper";

const ProductCard = ({ data }: { data: ProductItem }) => {
  if (!data) return null;

  const navigate = useNavigate();
  const { id, name, description, offerPrice, price, image, starRating, quantity } = data;

  // Calculate discount percentage
  const calculatedDiscount =
    price && offerPrice && offerPrice < price
      ? Math.round(((price - offerPrice) / price) * 100)
      : 0;

  // Cart product data
  const cartProduct: CartProduct = {
    id: id.toString(),
    title: name,
    subTitle: description,
    image: image,
    price: offerPrice,
    mrp: price,
  };

  // Check if product is out of stock
  const isOutOfStock = quantity === 0;

  const handleProductClick = () => {
    if (isOutOfStock) return; // Prevent navigation for out-of-stock items
    const pname = convertTextToURLSlug(data.name);
    navigate({
      pathname: `/prn/${pname}/prid/${data.id}`,
    });
  };

  return (
    <div
      id={`product-${id}`}
      onClick={handleProductClick}
      className={`group relative h-[320px] w-[200px] bg-white rounded-2xl shadow-md transition-all duration-300 overflow-hidden flex flex-col ${
        isOutOfStock ? "opacity-80 cursor-not-allowed" : "cursor-pointer hover:shadow-xl"
      }`}
    >
      {/* 🟥 Modern Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 to-black/50 backdrop-blur-[2px] z-20 transition-all duration-500">
          <div className="flex flex-col items-center space-y-2 animate-fadeIn">
            <div className="flex items-center space-x-2 bg-red-600/90 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-white font-semibold text-sm sm:text-base tracking-wide">
                OUT OF STOCK
              </span>
            </div>

            <span className="text-gray-200 text-xs sm:text-sm italic opacity-90">
              Coming Soon
            </span>
          </div>
        </div>
      )}

      {/* Discount Ribbon */}
      {calculatedDiscount > 0 && !isOutOfStock && (
        <div className="absolute left-0 top-3 z-10">
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1 text-[11px] sm:text-xs font-bold rounded-r-lg shadow-md">
            {calculatedDiscount}% OFF
          </div>
        </div>
      )}

      {/* Product Image */}
      <div className="h-[160px] w-full flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors relative">
        <img
          src={image}
          alt={name}
          className={`h-full max-h-[150px] object-contain transform transition-transform duration-300 ${
            isOutOfStock
              ? "grayscale-[70%] scale-95 opacity-70"
              : "group-hover:scale-105"
          }`}
        />
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-3 z-10">
        <h3
          className={`text-[13px] sm:text-sm font-medium leading-snug line-clamp-2 mb-1 transition-colors ${
            isOutOfStock ? "text-gray-500" : "text-gray-800 group-hover:text-red-600"
          }`}
        >
          {name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 truncate mb-1">{description}</p>

        {/* Rating */}
        {starRating && (
          <div className="mb-1">
            <StarRating rating={starRating} size="sm" maxStars={5} showValue={false} />
          </div>
        )}

        {/* Price & Add to Cart */}
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-[15px] sm:text-base font-bold text-gray-900">
              ₹{offerPrice}
            </span>
            {calculatedDiscount > 0 && (
              <del className="text-xs sm:text-sm text-gray-400">₹{price}</del>
            )}
          </div>
          <div className="h-8 w-[65px] sm:h-9 sm:w-[80px]">
            <AddToCartButton
              product={cartProduct}
              inventory={quantity}
              disabled={isOutOfStock}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
