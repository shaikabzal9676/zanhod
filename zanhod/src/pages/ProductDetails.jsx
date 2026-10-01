import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
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

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

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

    if (!selectedSize) {

      alert("Please select a size.");

      return;

    }


    addToCart(
      product,
      selectedSize,
      quantity
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
              IMAGE
          =================================== */}

          <div className="product-details-image">

            <img
              src={product.image}
              alt={`${product.name} ZANHOD hoodie`}
            />

            <div className="details-image-number">
              {product.id}
            </div>

          </div>


          {/* ===================================
              CONTENT
          =================================== */}

          <div className="product-details-content">


            <p className="details-eyebrow">

              ZANHOD / DROP 01 / {product.id}

            </p>


            <h1>
              {product.name}
            </h1>


            <p className="details-description">

              {product.description}

            </p>


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

    </div>

  );

}


export default ProductDetails;