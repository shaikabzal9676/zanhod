import { Link, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";

import Navbar from "../components/Navbar";

import "../styles/payment-success.css";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();

  const orderNumber =
    searchParams.get("order");

  return (
    <div className="site">
      <Navbar />

      <main className="payment-success-page">

        <div className="success-mark">
          <Check size={32} />
        </div>

        <p className="success-eyebrow">
          ZANHOD / ORDER CONFIRMED
        </p>

        <h1>
          THANK YOU.
        </h1>

        <p className="success-message">
          Your Drop 01 order has been
          successfully placed.
        </p>

        {orderNumber && (
          <div className="success-order">
            <span>ORDER NUMBER</span>

            <strong>
              {orderNumber}
            </strong>
          </div>
        )}

        <p className="success-note">
          We&apos;ll use the contact details
          provided at checkout to send your
          order updates.
        </p>

        <Link
          to="/"
          className="success-button"
        >
          CONTINUE SHOPPING
          <span>→</span>
        </Link>

      </main>
    </div>
  );
}

export default PaymentSuccess;