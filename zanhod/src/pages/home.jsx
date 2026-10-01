import Navbar from "../components/Navbar";
import "../styles/hero.css";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import heroImage from "../images/hero.png";

import "../styles/product.css"

function Home() {
  return (
    <div className="site">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="hero">
          {/* Background Image */}
          <div className="hero-image">
            <img src={heroImage} alt="ZANHOD Drop 01 hoodie" />
          </div>

          {/* Dark Overlay */}
          <div className="hero-overlay"></div>

          {/* Burgundy Atmosphere */}
          <div className="hero-burgundy-glow"></div>

          {/* Content */}
          <div className="hero-content">
            <p className="hero-brand">ZANHOD</p>

            <h1>
              DROP <span>01</span>
            </h1>

            <p className="hero-subtitle">SIX DESIGNS. LIMITED QUANTITIES.</p>

            <div className="hero-line"></div>

            <p className="hero-description">
              Premium heavyweight hoodies crafted for those who move different.
              Built for the cold.
            </p>

            <a href="#drop" className="hero-button">
              SHOP DROP
              <span>→</span>
            </a>
          </div>

          {/* Slide Indicators */}
          <div className="hero-slides">
            <span className="active">01</span>

            <span>02</span>

            <span>03</span>
          </div>

          {/* Scroll */}
          <div className="hero-scroll">
            <span>SCROLL</span>

            <div className="scroll-line"></div>
          </div>
        </section>

        <section className="drop-section" id="drop">
          <div className="drop-header">
            <div>
              <p className="section-eyebrow">THE SIX</p>

              <h2>
                DROP <span>01</span>
              </h2>
            </div>

            <p className="drop-count">06 PREMIUM HOODIES</p>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="drop-footer">
            <p>SIX DESIGNS. ONE DROP.</p>

            <a href="/shop">
              VIEW ALL
              <span>→</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
