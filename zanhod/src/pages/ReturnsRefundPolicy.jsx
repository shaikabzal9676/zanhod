import { Link } from "react-router-dom";
import "../styles/policy.css";
import Navbar from "../components/Navbar"

function ReturnsRefundPolicy() {
  return (
  <div className="site">
        <Navbar />
    <main className="policy-page">
      <section className="policy-hero">
        <p className="policy-eyebrow">ZANHOD / RETURNS</p>

        <h1>RETURNS & REFUNDS.</h1>

        <p>
          Our policy for damaged, defective, incorrect, or otherwise eligible
          orders.
        </p>
      </section>

      <section className="policy-content">
        <article className="policy-section">
          <span>01</span>

          <div>
            <h2>ELIGIBLE RETURNS</h2>

            <p>
              ZANHOD accepts return or replacement requests only for products
              that arrive damaged, defective, dirty, or incorrect.
            </p>

            <p>
              Please contact us as soon as possible after receiving your order
              so that we can review the issue.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>02</span>

          <div>
            <h2>SIZE & CHANGE-OF-MIND RETURNS</h2>

            <p>
              Please carefully check the size guide before placing your order.
            </p>

            <p>
              Returns or exchanges due to incorrect size selection, change of
              mind, preference, or a change in styling choice are not accepted.
            </p>

            <Link to="/size-guide" className="policy-link">
              VIEW SIZE GUIDE →
            </Link>
          </div>
        </article>

        <article className="policy-section">
          <span>03</span>

          <div>
            <h2>REPORTING A PROBLEM</h2>

            <p>
              If your order arrives damaged, defective, dirty, or incorrect,
              contact ZANHOD support with your order number and clear photos or
              videos showing the issue.
            </p>

            <p>
              Our team will review the information and provide the appropriate
              resolution.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>04</span>

          <div>
            <h2>REFUNDS</h2>

            <p>
              If a refund is approved, the refund will be processed after the
              issue has been reviewed and the applicable return or verification
              process has been completed.
            </p>

            <p>
              The time taken for the refunded amount to appear in your account
              may depend on your payment provider or bank.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>05</span>

          <div>
            <h2>EXCHANGES & REPLACEMENTS</h2>

            <p>
              Where appropriate, ZANHOD may offer a replacement for an eligible
              damaged, defective, or incorrect product.
            </p>

            <p>
              The available resolution will depend on the specific issue and
              product availability.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>06</span>

          <div>
            <h2>CONDITION OF PRODUCTS</h2>

            <p>
              Products reported as damaged or defective should be kept in the
              condition in which they were received until ZANHOD provides
              further instructions.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>07</span>

          <div>
            <h2>NEED HELP?</h2>

            <p>
              If you believe there is an issue with your order, contact our
              support team with your order number and relevant details.
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

export default ReturnsRefundPolicy;
