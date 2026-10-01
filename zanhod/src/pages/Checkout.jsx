import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";

import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

import API_URL from "../config/api";
import "../styles/checkout.css";


function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    subtotal,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shipping = 0;
  const total = subtotal + shipping;

  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // LOAD RAZORPAY
  // =========================================

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // =========================================
  // VERIFY PAYMENT
  // =========================================

  const verifyPayment = async (response, orderData) => {
    try {
      const verificationResponse = await fetch(
        `${API_URL}/api/orders/verify-payment`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            razorpay_order_id:
              response.razorpay_order_id,

            razorpay_payment_id:
              response.razorpay_payment_id,

            razorpay_signature:
              response.razorpay_signature,
          }),
        }
      );

      const result =
        await verificationResponse.json();

      if (!verificationResponse.ok || !result.success) {
        throw new Error(
          result.message ||
            "Payment verification failed"
        );
      }

      // =====================================
      // PAYMENT VERIFIED
      // =====================================

      clearCart();

      navigate(
        `/payment-success?order=${encodeURIComponent(
          result.order.orderNumber
        )}`
      );
    } catch (error) {
      console.error(
        "Payment verification error:",
        error
      );

      setError(
        "Payment was received, but verification failed. Please contact ZANHOD support."
      );

      setLoading(false);
    }
  };

  // =========================================
  // OPEN RAZORPAY
  // =========================================

  const openRazorpay = (orderData) => {
    const options = {
      key: orderData.razorpayKeyId,

      amount: orderData.total * 100,

      currency: "INR",

      name: "ZANHOD",

      description:
        `ZANHOD / ${orderData.orderNumber}`,

      order_id:
        orderData.razorpayOrderId,

      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },

      notes: {
        orderNumber:
          orderData.orderNumber,
      },

      theme: {
        color: "#8F1D26",
      },

      // =====================================
      // IMPORTANT
      // =====================================

      handler: async (response) => {
        console.log(
          "Razorpay response:",
          response
        );

        await verifyPayment(
          response,
          orderData
        );
      },

      modal: {
        ondismiss: () => {
          setLoading(false);
        },
      },
    };

    const razorpay =
      new window.Razorpay(options);

    razorpay.on(
      "payment.failed",
      function (response) {
        console.error(
          "Payment failed:",
          response
        );

        setError(
          response.error?.description ||
            "Payment failed. Please try again."
        );

        setLoading(false);
      }
    );

    razorpay.open();
  };

  // =========================================
  // SUBMIT CHECKOUT
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!cartItems.length) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay
      const razorpayLoaded =
        await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error(
          "Razorpay failed to load."
        );
      }

      // =====================================
      // CREATE BACKEND ORDER
      // =====================================

      const response = await fetch(
         `${API_URL}/api/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ 
            customer: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            },

            shippingAddress: {
              address: formData.address,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
            },

            items: cartItems.map((item) => ({
              productId: item.id,
              size: item.size,
              quantity: item.quantity,
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to create order."
        );
      }

      // =====================================
      // OPEN RAZORPAY
      // =====================================

      openRazorpay(data.order);
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  };

  // =========================================
  // EMPTY CART
  // =========================================

  if (!cartItems.length) {
    return (
      <div className="site">
        <Navbar />

        <main className="checkout-empty">
          <h1>YOUR CART IS EMPTY</h1>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            RETURN TO DROP
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="site">
      <Navbar />

      <main className="checkout-page">

        {/* HEADER */}

        <div className="checkout-header">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="checkout-back"
          >
            <ArrowLeft size={17} />
            BACK TO CART
          </button>

          <div>
            <p className="checkout-eyebrow">
              ZANHOD / SECURE CHECKOUT
            </p>

            <h1>CHECKOUT</h1>
          </div>
        </div>

        <form
          className="checkout-layout"
          onSubmit={handleSubmit}
        >

          {/* LEFT */}

          <div className="checkout-form">

            {/* CUSTOMER */}

            <section className="checkout-section">

              <div className="checkout-section-header">
                <span>01</span>

                <div>
                  <h2>CONTACT INFORMATION</h2>
                  <p>
                    Where should we send your order
                    updates?
                  </p>
                </div>
              </div>

              <div className="checkout-grid">

                <div className="checkout-field">
                  <label>FULL NAME</label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label>EMAIL</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label>PHONE</label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91"
                    required
                  />
                </div>

              </div>

            </section>

            {/* SHIPPING */}

            <section className="checkout-section">

              <div className="checkout-section-header">
                <span>02</span>

                <div>
                  <h2>SHIPPING ADDRESS</h2>

                  <p>
                    Where should we deliver your
                    ZANHOD order?
                  </p>
                </div>
              </div>

              <div className="checkout-grid">

                <div className="checkout-field checkout-field-full">
                  <label>ADDRESS</label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House / Flat / Street"
                    rows="3"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label>CITY</label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label>STATE</label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label>PINCODE</label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6 digit PIN"
                    required
                  />
                </div>

              </div>

            </section>

            {/* PAYMENT */}

            <section className="checkout-section">

              <div className="checkout-section-header">
                <span>03</span>

                <div>
                  <h2>PAYMENT</h2>

                  <p>
                    Secure payment powered by
                    Razorpay.
                  </p>
                </div>
              </div>

              <div className="payment-placeholder">

                <Lock size={18} />

                <div>
                  <strong>
                    SECURE RAZORPAY PAYMENT
                  </strong>

                  <p>
                    UPI, cards, net banking and
                    supported payment methods.
                  </p>
                </div>

              </div>

            </section>

            {error && (
              <div className="checkout-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="payment-button"
              disabled={loading}
            >
              {loading
                ? "PROCESSING..."
                : `PAY ₹${total.toLocaleString(
                    "en-IN"
                  )}`}

              {!loading && <span>→</span>}
            </button>

          </div>

          {/* RIGHT — SUMMARY */}

          <aside className="checkout-summary">

            <div className="checkout-summary-header">
              <p>YOUR ORDER</p>

              <span>
                {cartItems.length} ITEM
                {cartItems.length > 1
                  ? "S"
                  : ""}
              </span>
            </div>

            <div className="checkout-summary-products">

              {cartItems.map((item) => (
                <div
                  className="checkout-summary-product"
                  key={`${item.id}-${item.size}`}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>
                    <p className="summary-product-id">
                      ZANHOD / {item.id}
                    </p>

                    <h3>{item.name}</h3>

                    <p>
                      SIZE {item.size} ×{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <strong>
                    ₹
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>
              ))}

            </div>

            <div className="checkout-summary-totals">

              <div>
                <span>SUBTOTAL</span>

                <strong>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div>
                <span>SHIPPING</span>

                <strong>FREE</strong>
              </div>

              <div className="summary-total">
                <span>TOTAL</span>

                <strong>
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

            </div>

            <div className="checkout-trust">
              <Lock size={15} />

              <span>
                SECURE PAYMENT · FREE SHIPPING
                · ZANHOD DROP 01
              </span>
            </div>

          </aside>

        </form>
      </main>
    </div>
  );
}

export default Checkout;