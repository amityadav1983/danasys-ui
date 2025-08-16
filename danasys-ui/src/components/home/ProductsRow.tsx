import { ProductRow } from '../../utils/types';
import ItemsGrid from '../shared/ItemsGrid';

const ProductsRow = ({ data, objects }: ProductRow) => {
  const products = objects[0].data.products;

  return (
    <section>
      {data.show_header && (
        <div className="flex items-center justify-between h-16">
          <h2 className="font-bold text-[26px] _text-default">{data.title}</h2>
          {data.show_view_all && (
            <span className="text-green-700 font-bold cursor-pointer text-lg">
              {data.title_action}
            </span>
          )}
        </div>
      )}
      <ItemsGrid topItems={products} />
    </section>
  );
};

export default ProductsRow;
