import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './shared/Header';
import Footer from './shared/Footer';
import Modal from './Modal';
import { CartPanel } from './cart';
import { useAppSelector } from '../hooks/useAppSelector';
import CategoriesSection from './home/CategoriesSection';
import ViewCartButton from './shared/ViewCartButton';

type Props = {
  noFooter?: boolean;
  component: React.ReactElement;
};

const Layout = ({ noFooter, component }: Props) => {
  const modalShown = useAppSelector((state) => state.modal.visible);
  const cartShown = useAppSelector((state) => state.ui.cartPanel);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check if current page is Order History
  const isOrderHistoryPage = location.pathname === '/orders';

  return (
    <>
      <div>
        <Header />
        {!isOrderHistoryPage && <CategoriesSection />}
        <main className="pt-4">{component}</main>
        {!noFooter && (
          <>
            <Footer />
          </>
        )}
        <ViewCartButton />
      </div>
      {cartShown && <CartPanel />}
      {modalShown && <Modal />}
    </>
  );
};

export default Layout;
