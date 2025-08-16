import { FaShoppingCart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { showCart } from '../../store/ui';

const CartButton = () => {
  const { t } = useTranslation();
  const { billAmount, totalQuantity } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  return (
   <div
  className="flex items-center rounded-[6px] min-w-[112px] h-[50px] py-2 px-3 gap-2 font-bold text-sm bg-[#0c30fe] cursor-pointer text-white hover:shadow-[0_10px_20px_rgba(0,1,1,1)] transition-shadow duration-200"
  onClick={() => dispatch(showCart())}
>

      <FaShoppingCart size={24} className="_wiggle" />
      <div className="flex flex-col font-bold text-[14px] leading-none">
        {totalQuantity === 0 ? (
          <span className="">{t('myCart')}</span>
        ) : (
          <>
            <span className="tracking-tight">{totalQuantity} {t('items')}</span>
            <span className="tracking-tight mt-0.5">₹{billAmount}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default CartButton;
