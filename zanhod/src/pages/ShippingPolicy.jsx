import { Link } from "react-router-dom";
import "../styles/policy.css";
import Navbar from "../components/Navbar"

function ShippingPolicy() {
  return (
    <div className="site">
      <Navbar />
    <main className="policy-page">
      <section className="policy-hero">
        <p className="policy-eyebrow">ZANHOD / SHIPPING</p>

        <h1>SHIPPING POLICY.</h1>

        <p>
          Everything you need to know about how your ZANHOD order is processed,
          shipped, and delivered.
        </p>
      </section>

      <section className="policy-content">
        <article className="policy-section">
          <span>01</span>
          <div>
            <h2>ORDER PROCESSING</h2>
            <p>
              Once your order is successfully placed and payment is confirmed,
              we begin processing it for shipment.
            </p>
            <p>
              Processing time may vary depending on product availability and
              order volume.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>02</span>
          <div>
            <h2>SHIPPING</h2>
            <p>
              Orders are shipped to the shipping address provided during
              checkout.
            </p>
            <p>
              Delivery timelines can vary depending on your location,
              courier operations, weather, and other circumstances outside our
              control.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>03</span>
          <div>
            <h2>TRACKING</h2>
            <p>
              Once your order has been shipped, tracking information may be
              provided so you can follow the progress of your shipment.
            </p>
            <p>
              You can also use the ZANHOD Track Order page to check your order
              status.
            </p>

            <Link to="/track-order" className="policy-link">
              TRACK YOUR ORDER →
            </Link>
          </div>
        </article>

        <article className="policy-section">
          <span>04</span>
          <div>
            <h2>DELIVERY ADDRESS</h2>
            <p>
              Please make sure your name, phone number, address, city, state,
              and PIN code are correct before completing your order.
            </p>
            <p>
              ZANHOD is not responsible for delays or failed deliveries caused
              by incorrect or incomplete address information supplied by the
              customer.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>05</span>
          <div>
            <h2>DELIVERY DELAYS</h2>
            <p>
              Delivery times are estimates and are not guaranteed. Delays may
              occur because of courier operations, weather, public holidays,
              high order volumes, or circumstances beyond our control.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>06</span>
          <div>
            <h2>QUESTIONS ABOUT YOUR ORDER?</h2>
            <p>
              If you need help with your shipment or order status, contact
              ZANHOD support with your order number.
            </p>

            <Link to="/contact" className="policy-link">
              CONTACT SUPPORT →
            </Link>
          </div>
        </article>
      </section>
    </main>
    </div>
  );
}

export default ShippingPolicy;
