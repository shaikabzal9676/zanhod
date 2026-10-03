import "../styles/policy.css";
import Navbar from "../components/Navbar"

function PrivacyPolicy() {
  return (
    <div className="site">
            <Navbar />
    <main className="policy-page">
      <section className="policy-hero">
        <p className="policy-eyebrow">ZANHOD / PRIVACY</p>

        <h1>PRIVACY POLICY.</h1>

        <p>
          How ZANHOD collects, uses, protects, and handles information when
          you use our website and place an order.
        </p>
      </section>

      <section className="policy-content">
        <article className="policy-section">
          <span>01</span>

          <div>
            <h2>INFORMATION WE COLLECT</h2>

            <p>
              When you place an order, we may collect information required to
              process and deliver your purchase, including your name, email
              address, phone number, and shipping address.
            </p>

            <p>
              We may also receive information relating to your order, such as
              the products purchased, selected sizes, quantities, order number,
              payment status, and shipping status.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>02</span>

          <div>
            <h2>HOW WE USE YOUR INFORMATION</h2>

            <p>
              We use customer information to process orders, arrange delivery,
              provide order updates, respond to support requests, verify
              transactions, and maintain our records.
            </p>

            <p>
              Information may also be used to maintain and improve the
              functionality and security of the ZANHOD website.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>03</span>

          <div>
            <h2>PAYMENTS</h2>

            <p>
              Online payments are processed through our payment service
              provider. Payment processing may require information to be
              handled by the payment provider according to its own privacy and
              security policies.
            </p>

            <p>
              ZANHOD does not need to store your complete card or banking
              credentials in order to process an order.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>04</span>

          <div>
            <h2>ORDER INFORMATION</h2>

            <p>
              Order information is stored so that we can manage purchases,
              provide customer support, verify payments, and allow customers to
              check their order status.
            </p>

            <p>
              Access to administrative order information is restricted to
              authorized ZANHOD administration.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>05</span>

          <div>
            <h2>COOKIES & LOCAL STORAGE</h2>

            <p>
              The website may use browser technologies such as cookies or local
              storage to support website functionality, including maintaining
              shopping-cart information and authentication-related functionality.
            </p>

            <p>
              These technologies help the website remember information during
              your browsing session and improve the shopping experience.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>06</span>

          <div>
            <h2>THIRD-PARTY SERVICES</h2>

            <p>
              ZANHOD may rely on third-party services for functions such as
              payment processing, hosting, database infrastructure, analytics,
              security, or delivery-related services.
            </p>

            <p>
              These providers may process information necessary to provide
              their services and are subject to their respective policies and
              terms.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>07</span>

          <div>
            <h2>DATA SECURITY</h2>

            <p>
              We take reasonable steps to protect information handled through
              the website against unauthorized access, misuse, alteration, or
              disclosure.
            </p>

            <p>
              However, no internet-based system can be guaranteed to be
              completely secure.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>08</span>

          <div>
            <h2>DATA RETENTION</h2>

            <p>
              Customer and order information may be retained for as long as
              reasonably necessary to operate the business, provide customer
              support, maintain transaction records, resolve disputes, and
              meet applicable legal or accounting requirements.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>09</span>

          <div>
            <h2>YOUR INFORMATION</h2>

            <p>
              If you have questions about information associated with your
              order or believe your information needs to be corrected, please
              contact ZANHOD support.
            </p>
          </div>
        </article>

        <article className="policy-section">
          <span>10</span>

          <div>
            <h2>POLICY UPDATES</h2>

            <p>
              ZANHOD may update this Privacy Policy when our website,
              services, or legal requirements change.
            </p>

            <p>
              The updated version will be published on this page.
            </p>
          </div>
        </article>
      </section>
    </main>
    </div>
  );
}

export default PrivacyPolicy;
