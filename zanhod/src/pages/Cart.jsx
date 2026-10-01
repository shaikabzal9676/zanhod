import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

import "../styles/cart.css";


function Cart() {
    const navigate = useNavigate();

  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
  } = useCart();


  return (

    <div className="site">

      <Navbar />

      <main className="cart-page">


        {/* =====================================
            HEADER
        ===================================== */}

        <div className="cart-header">

          <div>

            <p className="cart-eyebrow">
              ZANHOD / YOUR SELECTION
            </p>

            <h1>
              CART
            </h1>

          </div>


          <p className="cart-item-count">

            {cartItems.length === 1
              ? "01 ITEM"
              : `${String(cartItems.length).padStart(2, "0")} ITEMS`
            }

          </p>

        </div>


        {/* =====================================
            EMPTY CART
        ===================================== */}

        {cartItems.length === 0 ? (

          <div className="empty-cart">

            <ShoppingBag size={34} />

            <h2>
              YOUR CART IS EMPTY
            </h2>

            <p>
              Nothing here yet. Discover Drop 01.
            </p>

            <Link
              to="/"
              className="continue-shopping"
            >
              SHOP DROP 01
              <span>→</span>
            </Link>

          </div>

        ) : (


          /* ===================================
             CART CONTENT
          =================================== */

          <section className="cart-layout">


            {/* =================================
                ITEMS
            ================================= */}

            <div className="cart-items">


              {cartItems.map((item) => (

                <article
                  className="cart-item"
                  key={`${item.id}-${item.size}`}
                >


                  {/* IMAGE */}

                  <Link
                    to={`/product/${item.id}`}
                    className="cart-item-image"
                  >

                    <img
                      src={item.image}
                      alt={`${item.name} ZANHOD hoodie`}
                    />

                  </Link>


                  {/* DETAILS */}

                  <div className="cart-item-details">


                    <div className="cart-item-top">

                      <div>

                        <p className="cart-item-id">
                          ZANHOD / {item.id}
                        </p>

                        <Link
                          to={`/product/${item.id}`}
                          className="cart-item-name"
                        >
                          {item.name}
                        </Link>

                        <p className="cart-item-description">
                          {item.description}
                        </p>

                      </div>


                      <p className="cart-item-price">

                        ₹{item.price.toLocaleString("en-IN")}

                      </p>

                    </div>


                    <div className="cart-item-bottom">


                      {/* SIZE */}

                      <div className="cart-size">

                        <span>
                          SIZE
                        </span>

                        <strong>
                          {item.size}
                        </strong>

                      </div>


                      {/* QUANTITY */}

                      <div className="cart-quantity">

                        <span>
                          QTY
                        </span>


                        <div className="cart-quantity-control">

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.quantity - 1
                              )
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>


                          <span>
                            {item.quantity}
                          </span>


                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>

                        </div>

                      </div>


                      {/* REMOVE */}

                      <button
                        type="button"
                        className="remove-item"
                        onClick={() =>
                          removeFromCart(
                            item.id,
                            item.size
                          )
                        }
                      >

                        <Trash2 size={15} />

                        REMOVE

                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>


            {/* =================================
                SUMMARY
            ================================= */}

            <aside className="cart-summary">

              <p className="summary-eyebrow">
                ORDER SUMMARY
              </p>


              <div className="summary-line">

                <span>
                  SUBTOTAL
                </span>

                <strong>
                  ₹{subtotal.toLocaleString("en-IN")}
                </strong>

              </div>


              <div className="summary-line">

                <span>
                  SHIPPING
                </span>

                <strong>
                  FREE
                </strong>

              </div>


              <div className="summary-divider"></div>


              <div className="summary-total">

                <span>
                  TOTAL
                </span>

                <strong>
                  ₹{subtotal.toLocaleString("en-IN")}
                </strong>

              </div>


              <button
  type="button"
  className="checkout-button"
  onClick={() => navigate("/checkout")}
>
  PROCEED TO CHECKOUT
  <span>→</span>
</button>


              <p className="checkout-note">
                Secure checkout. Shipping calculated
                at checkout.
              </p>


              <Link
                to="/"
                className="continue-shopping-link"
              >
                <ArrowLeft size={15} />
                CONTINUE SHOPPING
              </Link>

            </aside>

          </section>

        )}

      </main>

    </div>

  );

}


export default Cart;