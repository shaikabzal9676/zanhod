import { ArrowUpRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/footer.css";
import logo from "../images/logo.png"

function Footer() {
  const handleNewsletterSubmit = (event) => {
    event.preventDefault();

    const email = event.target.email.value.trim();

    if (!email) return;
    // Newsletter backend can be connected later.
    console.log("Newsletter signup:", email);

    event.target.reset();
  };

  return (
    <footer className="site-footer">

      {/* TOP BRAND SECTION */}
      <section className="footer-intro">
        <div className="footer-intro-left">
          <p className="footer-eyebrow">ZANHOD / EST. 2026</p>

          <h2>
            WEAR
            <br />
            YOUR
            <br />
            DIFFERENCE.
          </h2>
        </div>

        <div className="footer-intro-right">
          <p>
            Premium streetwear built around distinctive design,
            everyday comfort, and limited collections.
          </p>

          <Link to="/shop" className="footer-main-link">
            SHOP ZANHOD
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="footer-newsletter">
        <div>
          <p className="footer-eyebrow">STAY IN THE LOOP</p>

          <h3>
            GET THE NEXT
            <br />
            DROP FIRST.
          </h3>
        </div>

        <form
          className="footer-newsletter-form"
          onSubmit={handleNewsletterSubmit}
        >
          <div className="footer-input-wrapper">
            <Mail size={17} />

            <input
              type="email"
              name="email"
              placeholder="Your email address"
              aria-label="Email address"
              required
            />

            <button type="submit" aria-label="Subscribe">
              <ArrowUpRight size={19} />
            </button>
          </div>

          <p>
            By subscribing, you agree to receive updates from ZANHOD.
          </p>
        </form>
      </section>

      {/* LINKS */}
      <section className="footer-links">

        {/* SHOP */}
        <div className="footer-column">
          <p className="footer-column-title">SHOP</p>

          <Link to="/shop">All Hoodies</Link>
          <Link to="/drop-01">Drop 01</Link>
          <Link to="/shop">New Arrivals</Link>
        </div>

        {/* EXPLORE */}
        <div className="footer-column">
          <p className="footer-column-title">EXPLORE</p>

          <Link to="/about">About ZANHOD</Link>
          <Link to="/journal">Journal</Link>
          <Link to="/size-guide">Size Guide</Link>
        </div>

        {/* SUPPORT */}
        <div className="footer-column">
          <p className="footer-column-title">SUPPORT</p>

          <Link to="/track-order">Track Order</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/shipping-policy">Shipping</Link>
          <Link to="/returns-refund-policy">
            Returns & Refunds
          </Link>
        </div>

        {/* LEGAL */}
        <div className="footer-column">
          <p className="footer-column-title">LEGAL</p>

          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-and-conditions">
            Terms & Conditions
          </Link>
        </div>

        {/* SOCIAL */}
        <div className="footer-column footer-social">
          <p className="footer-column-title">FOLLOW</p>

          <a
  href="https://instagram.com/"
  target="_blank"
  rel="noreferrer"
>
  <span className="footer-instagram-icon">◎</span>
  Instagram
  <ArrowUpRight size={15} />
</a>
        </div>

      </section>

      {/* TRUST BAR */}
      <section className="footer-trust">

        <div>
          <span className="footer-trust-number">01</span>

          <div>
            <strong>SECURE CHECKOUT</strong>
            <p>Protected online payments</p>
          </div>
        </div>

        <div>
          <span className="footer-trust-number">02</span>

          <div>
            <strong>ORDER TRACKING</strong>
            <p>Follow your order from dispatch</p>
          </div>
        </div>

        <div>
          <span className="footer-trust-number">03</span>

          <div>
            <strong>SUPPORT</strong>
            <p>We're here when you need us</p>
          </div>
        </div>

      </section>

      {/* BOTTOM */}
      <section className="footer-bottom">

        <div className="footer-logo">
            <img src={logo} alt="" />
          <span>ZANHOD</span>
        </div>

        <p>
          © {new Date().getFullYear()} ZANHOD. All rights reserved.
        </p>

        <p className="footer-location">
          INDIA
        </p>

      </section>

    </footer>
  );
}

export default Footer;
