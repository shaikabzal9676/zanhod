import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Shop from "./pages/Shop";
import Drop01 from "./pages/Drop01";
import About from "./pages/About";
import Contact from "./pages/Contact";

import AdminLogin from "./pages/AdminLogin";
import AdminOrders from "./pages/AdminOrders";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import TrackOrder from "./pages/TrackOrder";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnsRefundPolicy from "./pages/ReturnsRefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

import Footer from "./components/Footer";

function AppContent() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");
  return (
    <>
      <Routes>
        {/* CUSTOMER */}

        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />

        <Route path="/drop-01" element={<Drop01 />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route
          path="/returns-refund-policy"
          element={<ReturnsRefundPolicy />}
        />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/terms-and-conditions" element={<Terms />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/payment-success" element={<PaymentSuccess />} />

        <Route path="/track-order" element={<TrackOrder />} />

        {/* ADMIN LOGIN */}

        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PROTECTED ADMIN */}

        <Route
          path="/admin/orders"
          element={
            <ProtectedAdminRoute>
              <AdminOrders />
            </ProtectedAdminRoute>
          }
        />
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}

function App() {
  return <AppContent />;
}
export default App;
