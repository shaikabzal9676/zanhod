import { Link } from "react-router-dom";
import "../styles/policy.css";
import Navbar from "../components/Navbar";

function Terms() {
  return (
    <div className="site">
        <Navbar/>
    <main className="policy-page">
      <section className="policy-hero">
        <p className="policy-eyebrow">ZANHOD / TERMS</p>

        <h1>TERMS & CONDITIONS.</h1>

        <p>
          The terms that apply when you browse the ZANHOD website, purchase
          products, or use our services.
        </p>
      </section>

      <section className="policy-content">
        <article className="policy-section">
          <span>01</span>

          <div>
            <h2>ABOUT THESE TERMS</h2>

            <p>
              By accessing or using the ZANHOD website, you agree to these
              Terms & Conditions and any applicable policies published on the
              website.
            </p>

            <p>
              If you do not agree with these terms, please do not use the
              website or place an order.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>02</span>

          <div>
            <h2>PRODUCT INFORMATION</h2>

            <p>
              We make reasonable efforts to display product descriptions,
              images, prices, and other information accurately.
            </p>

            <p>
              However, colours and visual appearance may vary slightly
              depending on your device or display settings.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>03</span>

          <div>
            <h2>PRICES & AVAILABILITY</h2>

            <p>
              Product prices and availability may change from time to time.
            </p>

            <p>
              ZANHOD reserves the right to correct pricing, product
              information, or availability errors before an order is
              fulfilled.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>04</span>

          <div>
            <h2>ORDERS</h2>

            <p>
              When you place an order, you are responsible for providing
              accurate customer, contact, and shipping information.
            </p>

            <p>
              An order is subject to successful payment authorization and
              verification before it is treated as a completed purchase.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>05</span>

          <div>
            <h2>PAYMENT</h2>

            <p>
              Online payments are processed through the payment provider made
              available during checkout.
            </p>

            <p>
              ZANHOD may verify payment information before confirming an
              order.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>06</span>

          <div>
            <h2>CANCELLATION</h2>

            <p>
              Order cancellation requests may be subject to the order's
              processing and shipment status.
            </p>

            <p>
              If an order has already entered processing or shipment, it may
              not be possible to cancel it.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>07</span>

          <div>
            <h2>RETURNS & REFUNDS</h2>

            <p>
              Returns and refunds are handled according to the ZANHOD Returns
              & Refund Policy.
            </p>

            <p>
              Please review that policy before placing an order.
            </p>

            <Link to="/returns-refund-policy" className="policy-link">
              VIEW RETURNS POLICY →
            </Link>
          </div>
        </article>

        <article className="policy-section">
          <span>08</span>

          <div>
            <h2>SHIPPING</h2>

            <p>
              Shipping and delivery are subject to the ZANHOD Shipping Policy.
            </p>

            <p>
              Delivery estimates may vary depending on location, courier
              operations, weather, public holidays, and other circumstances.
            </p>

            <Link to="/shipping-policy" className="policy-link">
              VIEW SHIPPING POLICY →
            </Link>
          </div>
        </article>

        <article className="policy-section">
          <span>09</span>

          <div>
            <h2>WEBSITE USE</h2>

            <p>
              You agree not to misuse the ZANHOD website, interfere with its
              operation, attempt unauthorized access, or use the website for
              unlawful purposes.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>10</span>

          <div>
            <h2>INTELLECTUAL PROPERTY</h2>

            <p>
              ZANHOD branding, logos, product imagery, website design, text,
              graphics, and other original content belong to ZANHOD or their
              respective rights holders.
            </p>

            <p>
              Content may not be copied, reproduced, distributed, or used
              commercially without appropriate permission.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>11</span>

          <div>
            <h2>LIMITATION OF LIABILITY</h2>

            <p>
              ZANHOD will take reasonable steps to operate the website and
              process orders reliably, but we cannot guarantee uninterrupted or
              error-free access to the website at all times.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>12</span>

          <div>
            <h2>CHANGES TO THESE TERMS</h2>

            <p>
              ZANHOD may update these Terms & Conditions when our services,
              website, or legal requirements change.
            </p>

            <p>
              Updated terms will be published on this page.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>13</span>

          <div>
            <h2>CONTACT</h2>

            <p>
              If you have questions regarding these Terms & Conditions,
              please contact ZANHOD through our support page.
            </p>

            <Link to="/contact" className="policy-link">
              CONTACT ZANHOD →
            </Link>
          </div>
        </article>
      </section>
    </main>
    </div>
  );
}

export default Terms;
