import { shuffleItems } from '../../utils/helper';
import { ProductItem } from '../../utils/types';
import ProductCard from '../ProductCard';

type Props = {
  topItems: ProductItem[];
};

const ItemsGrid = (props: Props) => {
  const items = shuffleItems(props.topItems);

  return (
    <div className="mb-8 w-full">
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8"> {/* Further increased gap for mobile */}
        {items?.map((item) => (
          <div
            key={item.product_id}
            id={`product-${item.product_id}`}
            className="flex justify-center"
          >
            <ProductCard data={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsGrid;
