import { useNavigate } from "react-router-dom";
import AddToCartButton from "./shared/AddToCartButton";
import StarRating from "./shared/StarRating";
import { CartProduct, ProductItem } from "../utils/types";
import { convertTextToURLSlug } from "../utils/helper";

const ProductCard = ({ data }: { data: ProductItem }) => {
  if (!data) return null;

  const navigate = useNavigate();
  const { product_id, name, unit, price, mrp, image_url, discount, inventory } = data;

  // Calculate discount percentage
  const calculatedDiscount =
    price && mrp && price < mrp
      ? Math.round(((mrp - price) / mrp) * 100)
      : 0;

  const cartProduct: CartProduct = {
    id: product_id.toString(),
    title: name,
    subTitle: unit,
    image: image_url,
    price,
    mrp,
  };

  // Check if product is out of stock
  const isOutOfStock = inventory === 0;

  const handleProductClick = () => {
    if (isOutOfStock) return; // Prevent navigation for out-of-stock items
    const pname = convertTextToURLSlug(data.name);
    navigate({
      pathname: `/prn/${pname}/prid/${data.product_id}`,
    });
  };

  return (
  <div
  id={`product-${product_id}`}
  onClick={handleProductClick}
  className={`group relative h-[320px] w-[200px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden flex flex-col ${
    isOutOfStock ? 'opacity-60' : 'hover:shadow-xl'
  }`}
  style={isOutOfStock ? { cursor: 'not-allowed' } : {}}
>
  {/* Out of Stock Ribbon */}
  {isOutOfStock && (
    <div className="absolute right-0 top-3 z-10">
      <div className="bg-gradient-to-r from-gray-600 to-gray-500 text-white px-3 py-1 text-[11px] sm:text-xs font-bold rounded-l-lg shadow-md">
        OUT OF STOCK
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

  {/* Image fixed height */}
  <div className="h-[160px] w-full flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
    <img
      src={image_url}
      alt={name}
      className="h-full max-h-[150px] object-contain transform group-hover:scale-105 transition-transform duration-300"
    />
  </div>

  {/* Content area */}
  <div className="flex flex-col flex-1 p-3">
    <h3 className={`text-[13px] sm:text-sm font-medium leading-snug line-clamp-2 mb-1 transition-colors ${
      isOutOfStock ? 'text-gray-500' : 'text-gray-800 group-hover:text-red-600'
    }`}>
      {name}
    </h3>
    <p className="text-xs sm:text-sm text-gray-500 truncate mb-1">{unit}</p>

    {/* Rating */}
    {data.rating && (
      <div className="mb-1">
        <StarRating rating={data.rating} size="sm" maxStars={5} showValue={false} />
      </div>
    )}

    {/* Price & Add to cart fixed bottom */}
    <div className="flex items-end justify-between mt-auto">
      <div className="flex flex-col">
        <span className="text-[15px] sm:text-base font-bold text-gray-900">
          ₹{price}
        </span>
        {calculatedDiscount > 0 && (
          <del className="text-xs sm:text-sm text-gray-400">₹{mrp}</del>
        )}
      </div>
      <div className="h-8 w-[65px] sm:h-9 sm:w-[80px]">
        <AddToCartButton product={cartProduct} inventory={inventory} disabled={isOutOfStock} />
      </div>
    </div>
  </div>
</div>

  );
};

export default ProductCard;
