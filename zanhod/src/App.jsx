import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Shop from "./pages/Shop"
import Drop01 from "./pages/Drop01"
import About from "./pages/About"

import Contact from "./pages/Contact"
import ShippingPolicy from "./pages/ShippingPolicy"


import AdminLogin from "./pages/AdminLogin";
import AdminOrders from "./pages/AdminOrders";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import TrackOrder from "./pages/TrackOrder";

function App() {
  return (
    <Routes>

      {/* CUSTOMER */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route path='/shop' element={<Shop/>}/>

      <Route path="/drop-01" element={<Drop01/>}/>
      
      <Route path="/about" element={<About/>}/>
      

      <Route path="/contact" element={<Contact />} />
      <Route path="/shipping-policy" element={<ShippingPolicy />} />




      <Route
        path="/product/:id"
        element={<ProductDetails />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      <Route
        path="/payment-success"
        element={<PaymentSuccess />}
      />

      <Route
  path="/track-order"
  element={<TrackOrder />}
/>

      {/* ADMIN LOGIN */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

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
  );
}

export default App;
