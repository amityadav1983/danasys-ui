import { useNavigate } from "react-router-dom";
import AddToCartButton from "./shared/AddToCartButton";
import StarRating from "./shared/StarRating";
import { CartProduct, ProductItem } from "../utils/types";
import { convertTextToURLSlug } from "../utils/helper";

const ProductCard = ({ data }: { data: ProductItem }) => {
  if (!data || !data.id) return null;

  const navigate = useNavigate();
  const { id, name, description, offerPrice, price, image, starRating, quantity } = data;

  // Clean the product name by removing file extension and replacing dashes with spaces
  const cleanedName = name.replace(/\.jpg$/i, '').replace(/-/g, ' ');

  // Calculate discount percentage
  const calculatedDiscount =
    price && offerPrice && offerPrice < price
      ? Math.round(((price - offerPrice) / price) * 100)
      : 0;

  const cartProduct: CartProduct = {
    id: id.toString(),
    title: name,
    subTitle: description,
    image: image,
    price: offerPrice,
    mrp: price,
    userBusinessProfileId: data.userBusinessProfileId || 1,
  };

  const isOutOfStock = quantity === 0;

  const handleProductClick = () => {
    if (isOutOfStock) return;
    const pname = convertTextToURLSlug(data.name);
    navigate({
      pathname: `/prn/${pname}/prid/${data.id}`,
    });
  };

  return (
    <div
      id={`product-${id}`}
      onClick={handleProductClick}
      className={`group relative bg-white rounded-2xl shadow-md transition-all duration-300 overflow-hidden flex flex-col
        w-[200px] h-[320px] 
        sm:w-[180px] sm:h-[300px]
        md:w-[200px] md:h-[320px]
        lg:w-[220px] lg:h-[340px]
        max-sm:w-[47%] max-sm:h-[270px] 
        ${isOutOfStock ? "opacity-80 cursor-not-allowed" : "cursor-pointer hover:shadow-xl"}`}
    >
      {/* 🟥 Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/30 to-black/10 backdrop-blur-[1px] z-20">
          <div className="flex flex-col items-center space-y-2 animate-fadeIn">
            <div className="flex items-center space-x-2 bg-red-600/70 px-6 py-1.5 rounded-full shadow-lg">
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
              <span className="text-white font-semibold text-xs sm:text-sm">
                OUT OF STOCK
              </span>
            </div>
            <span className="text-black font-semibold text-xs italic opacity-100">
              Coming Soon
            </span>
          </div>
        </div>
      )}

      {/* 🔺 Discount Ribbon */}
      {calculatedDiscount > 0 && !isOutOfStock && (
        <div className="absolute left-0 top-3 z-10">
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-[2px] text-[10px] sm:text-[11px] font-bold rounded-r-lg shadow-md">
            {calculatedDiscount}% OFF
          </div>
        </div>
      )}

      {/* 🟡 Product Image */}
      <div className="flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors relative 
                      h-[160px] sm:h-[140px] md:h-[150px] max-sm:h-[130px]">
        <img
          src={image}
          alt={name}
          className={`max-h-[150px] object-contain transition-transform duration-300 
            ${isOutOfStock ? "grayscale-[70%] scale-95 opacity-70" : "group-hover:scale-105"}`}
        />
      </div>

      {/* 🧾 Content Area */}
      <div className="flex flex-col flex-1 p-3 z-10">
        <h3
          className={`text-[13px] sm:text-sm font-medium leading-snug line-clamp-2 mb-1 transition-colors
            ${isOutOfStock ? "text-gray-500" : "text-gray-800 group-hover:text-red-600"}`}
        >
          {cleanedName}
        </h3>
        <p className="text-[11px] sm:text-xs text-gray-500 truncate mb-1">{description}</p>

        {/* ⭐ Rating */}
        {starRating && (
          <div className="mb-1">
            <StarRating rating={starRating} size="sm" maxStars={5} showValue={false} />
          </div>
        )}

        {/* 💰 Price & Add to Cart */}
<div
  className="
    flex items-end justify-between mt-auto
    max-sm:items-center max-sm:gap-2 max-sm:pt-1
  "
>
  <div className="flex flex-col max-sm:flex-row max-sm:items-center max-sm:gap-1">
    {calculatedDiscount > 0 && (
      <del className="text-[10px] sm:text-xs text-gray-600 max-sm:ml-1">
        ₹{price}
      </del>
    )}
    <span className="text-[16px] mr-1 ml-(-2) sm:text-base font-bold text-gray-600">
      ₹{offerPrice}
    </span>
  </div>

  <div
    className="
      h-7 w-[45px] sm:h-8 sm:w-[80px]
      flex-shrink-0
      max-sm:w-[50px] max-sm:h-[26px] max-sm:flex max-sm:items-center max-sm:justify-center
    "
  >
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
