import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

import "../styles/shop.css";

function Shop() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const searchTerm = search.toLowerCase().trim();

      if (!searchTerm) return true;

      return (
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.id.includes(searchTerm)
      );
    });

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [search, sort]);

  return (
    <div className="site">
      <Navbar />

      <main className="shop-page">

        {/* HERO */}
        <section className="shop-hero">
          <div className="shop-hero-content">
            <p className="shop-eyebrow">
              ZANHOD / COLLECTION
            </p>

            <h1>
              SHOP
            </h1>

            <p className="shop-intro">
              Explore Drop 01 — six limited designs built
              for the cold.
            </p>
          </div>

          <div className="shop-hero-number">
            01
          </div>
        </section>

        {/* SHOP CONTROLS */}
        <section className="shop-controls">

          <div className="shop-count">
            <span>
              {filteredProducts.length.toString().padStart(2, "0")}
            </span>

            <p>
              PRODUCTS
            </p>
          </div>

          <div className="shop-tools">

            <div className="shop-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="SEARCH PRODUCTS"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="shop-sort">
              <SlidersHorizontal size={17} />

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="featured">
                  FEATURED
                </option>

                <option value="price-low">
                  PRICE: LOW TO HIGH
                </option>

                <option value="price-high">
                  PRICE: HIGH TO LOW
                </option>

                <option value="name">
                  NAME
                </option>
              </select>
            </div>

          </div>
        </section>

        {/* PRODUCT GRID */}
        <section className="shop-products">

          {filteredProducts.length > 0 ? (
            <div className="shop-product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="shop-empty">
              <p className="shop-empty-number">
                00
              </p>

              <h2>
                NO PRODUCTS FOUND
              </h2>

              <p>
                Try another search term.
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
              >
                CLEAR SEARCH
              </button>
            </div>
          )}

        </section>

        {/* BOTTOM EDITORIAL */}
        <section className="shop-bottom">

          <div>
            <p className="shop-bottom-label">
              ZANHOD / DROP 01
            </p>

            <h2>
              SIX DESIGNS.
              <br />
              LIMITED QUANTITIES.
            </h2>
          </div>

          <p>
            Designed with a focus on silhouette,
            weight and everyday movement.
          </p>

        </section>

      </main>
    </div>
  );
}

export default Shop;
