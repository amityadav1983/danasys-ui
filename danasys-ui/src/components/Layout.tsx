import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './shared/Header';
import Footer from './shared/Footer';
import Modal from './Modal';
import { CartPanel } from './cart';
import { useAppSelector } from '../hooks/useAppSelector';
import CategoriesIcons from './home/CategoriesIcons';
import ViewCartButton from './shared/ViewCartButton';
import BusinessLayout from '../business/components/BusinessLayout';
import BusinessHome from '../business/pages/BusinessHome';

type Props = {
  noFooter?: boolean;
  component: React.ReactElement;
};

const Layout = ({ noFooter, component }: Props) => {
  const modalShown = useAppSelector((state) => state.modal.visible);
  const cartShown = useAppSelector((state) => state.ui.cartPanel);
  const currentMode = useAppSelector((state) => state.mode.currentMode);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check if current page is Order History
  const isOrderHistoryPage = location.pathname === '/orders';

  return (
    <>
      <div
        className={`transition-all duration-700 ease-in-out transform perspective-1000 ${
          currentMode === 'business'
            ? 'rotate-y-180 scale-100 opacity-100'
            : 'rotate-y-0 scale-100 opacity-100'
        }`}
        style={{ backfaceVisibility: 'hidden' }}
      >
        {currentMode === 'business' ? (
          <BusinessLayout component={<BusinessHome />} />
        ) : (
          <div>
            <Header />
            {!isOrderHistoryPage && <CategoriesIcons />}
            <main className="pt-0">{component}</main>
            {!noFooter && (
              <>
                <Footer />
              </>
            )}
          </div>
        )}
      </div>
      {currentMode !== 'business' && <ViewCartButton />}
      {cartShown && <CartPanel />}
      {modalShown && <Modal />}
    </>
  );
};

export default Layout;
