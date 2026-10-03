import { Mail, MessageCircle, PackageSearch } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/contact.css";
import Navbar from "../components/Navbar"

function Contact() {
  return (
    <div className="site">
      <Navbar />
    <main className="contact-page">
      <section className="contact-hero">
        <p className="contact-eyebrow">ZANHOD / SUPPORT</p>

        <h1>WE'RE HERE TO HELP.</h1>

        <p className="contact-intro">
          Have a question about your order, sizing, shipping, or a product?
          Reach out to us and we'll help you with the next step.
        </p>
      </section>

      <section className="contact-grid">
        <a
          href="mailto:zanhodofficial@gmail.com"
          className="contact-card"
        >
          <Mail size={24} />

          <div>
            <p className="contact-label">EMAIL</p>
            <h2>Customer Support</h2>
            <span>zanhodofficial@gmail.com</span>
          </div>
        </a>

        <Link to="/track-order" className="contact-card">
          <PackageSearch size={24} />

          <div>
            <p className="contact-label">ORDERS</p>
            <h2>Track Your Order</h2>
            <span>Check your order status</span>
          </div>
        </Link>

        <div className="contact-card">
          <MessageCircle size={24} />

          <div>
            <p className="contact-label">SUPPORT</p>
            <h2>Order Assistance</h2>
            <span>We're happy to help with your order</span>
          </div>
        </div>
      </section>

      <section className="contact-info">
        <div>
          <p className="contact-eyebrow">BEFORE YOU CONTACT US</p>
          <h2>QUICK ANSWERS.</h2>
        </div>

        <div className="contact-links">
          <Link to="/size-guide">
            Size Guide
            <span>→</span>
          </Link>

          <Link to="/shipping-policy">
            Shipping Policy
            <span>→</span>
          </Link>

          <Link to="/returns-refund-policy">
            Returns & Refunds
            <span>→</span>
          </Link>

          <Link to="/privacy-policy">
            Privacy Policy
            <span>→</span>
          </Link>
        </div>
      </section>
    </main>
    </div>
  );
}

export default Contact;
