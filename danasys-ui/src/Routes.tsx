import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, Error404 } from './pages';
import { Loader } from './components/shared';
import Layout from './components/Layout';
const ProductView = React.lazy(() => import('./pages/ProductView'));
const OrderHistory = React.lazy(() => import('./pages/OrderHistory'));
const BusinessLayout = React.lazy(() => import('./business/components/BusinessLayout'));
const BusinessProfile = React.lazy(() => import('./business/pages/BusinessProfile'));
const UpdateBusinessProfilePage = React.lazy(() => import('./business/pages/UpdateBusinessProfilePage'));
const AddUser = React.lazy(() => import('./business/pages/AddUser'));
const Activation = React.lazy(() => import('./business/pages/Activation'));
const BusinessProducts = React.lazy(() => import('./business/pages/BusinessProducts'));
const ManageProduct = React.lazy(() => import('./business/pages/ManageProduct'));
const BusinessOrders = React.lazy(() => import('./business/pages/BusinessOrders'));
const BusinessPayments = React.lazy(() => import('./business/pages/BusinessPayments'));
const BusinessHome = React.lazy(() => import('./business/pages/BusinessHome'));
const UnderConstruction = React.lazy(() => import('./business/pages/UnderConstruction'));
const BusinessConnections = React.lazy(() => import('./business/pages/BusinessConnections'));
const BusinessMoneyTransfer = React.lazy(() => import('./business/pages/BusinessMoneyTransfer'));

const AppWithRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout component={<Home />} />} />
      <Route
        path="/prn/:name/prid/:id"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <Layout component={<ProductView />} />
          </Suspense>
        }
      />
      <Route
        path="/orders"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <Layout component={<OrderHistory />} />
          </Suspense>
        }
      />
      <Route
        path="/business/profile"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <BusinessLayout component={<BusinessProfile />} />
          </Suspense>
        }
      />
      <Route
        path="/business/update-profile"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <BusinessLayout component={<UpdateBusinessProfilePage />} />
          </Suspense>
        }
      />
      <Route
        path="/business/add-user"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <BusinessLayout component={<AddUser />} />
          </Suspense>
        }
      />
      <Route
        path="/not-found"
        element={<Layout noFooter={true} component={<Error404 />} />}
      />
      <Route
        path="/business/activation"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <BusinessLayout component={<Activation />} />
          </Suspense>
        }
      />
      <Route
        path="/business/products"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <BusinessLayout component={<BusinessProducts />} />
          </Suspense>
        }
      />
      <Route
        path="/business/manage-products"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <BusinessLayout component={<ManageProduct />} />
          </Suspense>
        }
      />
      <Route
        path="/business/orders"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <BusinessLayout component={<BusinessOrders />} />
          </Suspense>
        }
      />
      <Route
        path="/business/payments"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <BusinessLayout component={<BusinessPayments />} />
          </Suspense>
        }
      />
      <Route
        path="/business"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <BusinessLayout component={<BusinessHome />} />
          </Suspense>
        }
      />
      <Route
        path="/business/money-transfer"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <BusinessLayout component={<BusinessMoneyTransfer />} />
          </Suspense>
        }
      />
      <Route
        path="/business/reports"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <BusinessLayout component={<UnderConstruction />} />
          </Suspense>
        }
      />
      <Route
        path="/business/company-profile"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <BusinessLayout component={<UnderConstruction />} />
          </Suspense>
        }
      />
      <Route
        path="/business/trends"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <BusinessLayout component={<UnderConstruction />} />
          </Suspense>
        }
      />
      <Route
        path="/business/annual-report"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <BusinessLayout component={<UnderConstruction />} />
          </Suspense>
        }
      />
      <Route
        path="/business/communication"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <BusinessLayout component={<UnderConstruction />} />
          </Suspense>
        }
      />
      <Route
        path="/business/connections"
        element={
          <Suspense fallback={<Loader fullscreen />}>
            <BusinessLayout component={<BusinessConnections />} />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={<Layout noFooter={true} component={<Error404 />} />}
      />
    </Routes>
  );
};

export default AppWithRouting;
