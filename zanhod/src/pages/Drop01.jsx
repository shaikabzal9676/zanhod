import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

import "../styles/drop-01.css";

function Drop01() {
  return (
    <div className="site">
      <Navbar />

      <main className="drop-page">

        {/* ================================
            HERO
        ================================= */}

        <section className="drop-hero">

          <div className="drop-hero-content">

            <p className="drop-eyebrow">
              ZANHOD / DROP 01
            </p>

            <h1>
              BUILT
              <br />
              FOR THE
              <br />
              COLD.
            </h1>

            <p className="drop-hero-description">
              Six designs. One collection.
              Designed for colder days and
              built around a darker state of mind.
            </p>

            <Link
              to="/shop"
              className="drop-hero-button"
            >
              SHOP DROP 01
              <ArrowUpRight size={17} />
            </Link>

          </div>

          <div className="drop-hero-mark">
            01
          </div>

          <div className="drop-scroll">
            <ArrowDown size={15} />
            <span>EXPLORE</span>
          </div>

        </section>


        {/* ================================
            INTRO
        ================================= */}

        <section className="drop-intro">

          <div className="drop-section-label">
            01 / THE COLLECTION
          </div>

          <div className="drop-intro-content">

            <h2>
              SIX DESIGNS.
              <br />
              LIMITED QUANTITIES.
            </h2>

            <div>
              <p>
                Drop 01 introduces the first ZANHOD
                collection — a focused selection of
                heavyweight streetwear built around
                simplicity, attitude and everyday wear.
              </p>

              <p>
                No unnecessary noise. No endless
                catalogue. Just six pieces designed
                to define the beginning.
              </p>
            </div>

          </div>

        </section>


        {/* ================================
            PRODUCTS
        ================================= */}

        <section className="drop-products">

          <div className="drop-products-heading">

            <div>
              <p>
                ZANHOD / DROP 01
              </p>

              <h2>
                THE SIX
              </h2>
            </div>

            <span>
              06 PIECES
            </span>

          </div>

          <div className="drop-product-grid">

            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>

        </section>


        {/* ================================
            PHILOSOPHY
        ================================= */}

        <section className="drop-philosophy">

          <div className="drop-section-label">
            02 / THE IDEA
          </div>

          <div className="drop-philosophy-content">

            <div className="drop-philosophy-number">
              Z
            </div>

            <div>

              <h2>
                LESS.
                <br />
                BUT BETTER.
              </h2>

              <p>
                ZANHOD begins with a simple idea:
                create fewer pieces and give each
                one a reason to exist.
              </p>

              <p>
                Drop 01 is intentionally limited.
                Six designs form the foundation of
                the brand — each carrying its own
                identity while belonging to the same
                world.
              </p>

            </div>

          </div>

        </section>


        {/* ================================
            FINAL CTA
        ================================= */}

        <section className="drop-final">

          <p>
            ZANHOD / 2026
          </p>

          <h2>
            THIS IS
            <br />
            ONLY THE
            <br />
            BEGINNING.
          </h2>

          <Link
            to="/shop"
            className="drop-final-button"
          >
            EXPLORE DROP 01
            <ArrowUpRight size={18} />
          </Link>

        </section>

      </main>
    </div>
  );
}

export default Drop01;
