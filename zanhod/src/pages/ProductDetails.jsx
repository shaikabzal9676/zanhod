import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

import Navbar from "../components/Navbar";
import products from "../data/products";

import { useCart } from "../context/CartContext";

import "../styles/product-details.css";


function ProductDetails() {

  const { id } = useParams();

  const product = products.find(
    (item) => String(item.id) === String(id)
  );


  /* =========================================
     PRODUCT IMAGES
  ========================================= */

  const productImages =
    product?.images && product.images.length > 0
      ? product.images.slice(0, 4)
      : product?.image
        ? [product.image]
        : [];


  /* =========================================
     STATES
  ========================================= */

  const [activeImage, setActiveImage] = useState(
    productImages[0] || ""
  );

  const [selectedSize, setSelectedSize] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [cartMessage, setCartMessage] = useState("");

  const [cartMessageType, setCartMessageType] =
    useState("success");


  const { addToCart } = useCart();


  /* =========================================
     PRODUCT NOT FOUND
  ========================================= */

  if (!product) {

    return (
      <div className="product-not-found">

        <h1>PRODUCT NOT FOUND</h1>

        <Link to="/">
          RETURN HOME
        </Link>

      </div>
    );

  }


  /* =========================================
     SHOW CART MESSAGE
  ========================================= */

  const showCartMessage = (
    message,
    type = "success"
  ) => {

    setCartMessage(message);

    setCartMessageType(type);

    setTimeout(() => {

      setCartMessage("");

    }, 3000);

  };


  /* =========================================
     QUANTITY
  ========================================= */

  const increaseQuantity = () => {

    setQuantity((prev) => prev + 1);

  };


  const decreaseQuantity = () => {

    setQuantity((prev) =>
      prev > 1 ? prev - 1 : 1
    );

  };


  /* =========================================
     ADD TO CART
  ========================================= */

  const handleAddToCart = () => {

    /* ---------------------------------------
       SIZE VALIDATION
    --------------------------------------- */

    if (!selectedSize) {

      showCartMessage(
        "Please select a size.",
        "error"
      );

      return;

    }


    /* ---------------------------------------
       ADD PRODUCT
    --------------------------------------- */

    addToCart(
      product,
      selectedSize,
      quantity
    );


    /* ---------------------------------------
       SUCCESS MESSAGE
    --------------------------------------- */

    showCartMessage(
      `${product.name} · Size ${selectedSize} · Qty ${quantity}`,
      "success"
    );

  };


  return (

    <div className="site">

      <Navbar />


      <main className="product-details-page">


        {/* =====================================
            BACK
        ===================================== */}

        <div className="product-back">

          <Link to="/">

            <ArrowLeft size={17} />

            BACK TO DROP

          </Link>

        </div>


        {/* =====================================
            PRODUCT
        ===================================== */}

        <section className="product-details">


          {/* ===================================
              IMAGE GALLERY
          =================================== */}

          <div className="product-details-image-gallery">


            {/* =================================
                MAIN IMAGE
            ================================= */}

            <div className="product-details-image">

              <img
                src={activeImage}
                alt={`${product.name} ZANHOD hoodie`}
              />

              <div className="details-image-number">

                {String(product.id).padStart(3, "0")}

              </div>

            </div>


            {/* =================================
                THUMBNAILS
            ================================= */}

            {productImages.length > 0 && (

              <div className="product-image-thumbnails">

                {productImages.map(
                  (image, index) => (

                    <button
                      key={`${image}-${index}`}
                      type="button"
                      className={
                        activeImage === image
                          ? "product-thumbnail active"
                          : "product-thumbnail"
                      }
                      onClick={() =>
                        setActiveImage(image)
                      }
                      aria-label={`View product image ${
                        index + 1
                      }`}
                    >

                      <img
                        src={image}
                        alt={`${product.name} view ${
                          index + 1
                        }`}
                      />

                    </button>

                  )
                )}

              </div>

            )}

          </div>


          {/* ===================================
              PRODUCT CONTENT
          =================================== */}

          <div className="product-details-content">


            {/* =================================
                EYEBROW
            ================================= */}

            <p className="details-eyebrow">

              ZANHOD / DROP 01 /{" "}
              {String(product.id).padStart(3, "0")}

            </p>


            {/* =================================
                TITLE
            ================================= */}

            <h1>
              {product.name}
            </h1>


            {/* =================================
                DESCRIPTION
            ================================= */}

            <p className="details-description">

              {product.description}

            </p>


            {/* =================================
                PRICE
            ================================= */}

            <div className="details-price">

              ₹{product.price.toLocaleString("en-IN")}

            </div>


            <div className="details-line"></div>


            {/* =================================
                SIZE
            ================================= */}

            <div className="size-section">

              <div className="size-header">

                <span>
                  SELECT SIZE
                </span>

                <span>
                  SIZE GUIDE
                </span>

              </div>


              <div className="size-options">

                {["S", "M", "L", "XL", "XXL"].map(
                  (size) => (

                    <button
                      key={size}
                      type="button"
                      className={
                        selectedSize === size
                          ? "size-button active"
                          : "size-button"
                      }
                      onClick={() =>
                        setSelectedSize(size)
                      }
                    >

                      {size}

                    </button>

                  )
                )}

              </div>

            </div>


            {/* =================================
                QUANTITY
            ================================= */}

            <div className="quantity-section">

              <span>
                QUANTITY
              </span>


              <div className="quantity-control">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  aria-label="Decrease quantity"
                >

                  <Minus size={15} />

                </button>


                <span>
                  {quantity}
                </span>


                <button
                  type="button"
                  onClick={increaseQuantity}
                  aria-label="Increase quantity"
                >

                  <Plus size={15} />

                </button>

              </div>

            </div>


            {/* =================================
                ADD TO CART
            ================================= */}

            <button
              type="button"
              className="add-cart-button"
              onClick={handleAddToCart}
            >

              <ShoppingBag size={18} />

              ADD TO CART

            </button>


            {/* =================================
                BUY NOW
            ================================= */}

            <button
              type="button"
              className="buy-now-button"
            >

              BUY NOW

            </button>


            {/* =================================
                PRODUCT INFO
            ================================= */}

            <div className="product-info-list">


              <div className="info-item">

                <span>
                  FABRIC
                </span>

                <p>
                  Premium Heavyweight Cotton
                </p>

              </div>


              <div className="info-item">

                <span>
                  FIT
                </span>

                <p>
                  Relaxed Streetwear Fit
                </p>

              </div>


              <div className="info-item">

                <span>
                  SHIPPING
                </span>

                <p>
                  Free Shipping Across India
                </p>

              </div>


              <div className="info-item">

                <span>
                  AVAILABILITY
                </span>

                <p>
                  Limited Drop 01
                </p>

              </div>


            </div>

          </div>

        </section>

      </main>


      {/* =========================================
          CART TOAST
      ========================================= */}

      {cartMessage && (

        <div
          className={
            cartMessageType === "success"
              ? "cart-toast"
              : "cart-toast error"
          }
        >


          {/* ICON */}

          <div className="cart-toast-icon">

            {cartMessageType === "success"
              ? "✓"
              : "!"}

          </div>


          {/* MESSAGE */}

          <div className="cart-toast-content">

            <strong>

              {cartMessageType === "success"
                ? "ADDED TO CART"
                : "SELECT A SIZE"}

            </strong>


            <span>

              {cartMessage}

            </span>


            {/* VIEW CART */}

            {cartMessageType === "success" && (

              <Link
                to="/cart"
                className="cart-toast-link"
              >

                VIEW CART

                <ArrowRight size={13} />

              </Link>

            )}

          </div>


        </div>

      )}

    </div>

  );

}


export default ProductDetails;
