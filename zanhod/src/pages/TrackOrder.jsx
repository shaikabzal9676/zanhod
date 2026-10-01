import { useState } from "react";
import {
  Search,
  Package,
  Clock3,
  CheckCircle2,
  Truck,
  MapPin,
} from "lucide-react";
import API_URL from "../config/api";

import Navbar from "../components/Navbar";

import "../styles/track-order.css";


function TrackOrder() {

  const [orderNumber, setOrderNumber] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleTrackOrder = async (
    event
  ) => {

    event.preventDefault();

    setError("");
    setOrder(null);
    setLoading(true);


    try {

      const response = await fetch(
        `${API_URL}/api/orders/track`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            orderNumber,
            email,
          }),
        }
      );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to track order"
        );
      }


      setOrder(data.order);

    } catch (error) {

      setError(
        error.message ||
          "Unable to track order"
      );

    } finally {

      setLoading(false);

    }
  };


  const getStatusIcon = (
    status
  ) => {

    switch (status) {

      case "placed":
        return <Package size={17} />;

      case "confirmed":
        return (
          <CheckCircle2 size={17} />
        );

      case "processing":
        return <Clock3 size={17} />;

      case "shipped":
        return <Truck size={17} />;

      case "delivered":
        return (
          <CheckCircle2 size={17} />
        );

      default:
        return <Package size={17} />;
    }
  };


  const formatStatus = (
    status
  ) => {

    return status
      .replace(
        /^./,
        (letter) =>
          letter.toUpperCase()
      );
  };


  const formatDate = (
    date
  ) => {

    return new Date(
      date
    ).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  return (
    <div className="site">

      <Navbar />


      <main className="track-order-page">

        <div className="track-order-header">

          <p>
            ZANHOD / ORDER TRACKING
          </p>

          <h1>
            TRACK
            <br />
            YOUR ORDER
          </h1>

          <span>
            Enter your order number and
            email to view your latest
            order status.
          </span>

        </div>


        {/* =====================================
            TRACK FORM
        ===================================== */}

        <form
          className="track-order-form"
          onSubmit={
            handleTrackOrder
          }
        >

          <div className="track-field">

            <label>
              ORDER NUMBER
            </label>

            <input
              type="text"
              placeholder="ZANHOD-XXXXXXXX"
              value={
                orderNumber
              }
              onChange={(event) =>
                setOrderNumber(
                  event.target.value
                )
              }
              required
            />

          </div>


          <div className="track-field">

            <label>
              EMAIL ADDRESS
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              required
            />

          </div>


          {error && (
            <div className="track-error">
              {error}
            </div>
          )}


          <button
            type="submit"
            className="track-button"
            disabled={loading}
          >

            {loading ? (
              "CHECKING..."
            ) : (
              <>
                TRACK ORDER
                <Search size={17} />
              </>
            )}

          </button>

        </form>


        {/* =====================================
            ORDER RESULT
        ===================================== */}

        {order && (

          <section className="tracked-order">

            <div className="tracked-order-top">

              <div>

                <span>
                  ORDER NUMBER
                </span>

                <h2>
                  {order.orderNumber}
                </h2>

              </div>


              <div
                className={`tracked-status ${order.orderStatus}`}
              >
                {getStatusIcon(
                  order.orderStatus
                )}

                {formatStatus(
                  order.orderStatus
                )}
              </div>

            </div>


            {/* =================================
                STATUS TIMELINE
            ================================= */}

            <div className="tracking-section">

              <div className="tracking-section-title">

                <Clock3 size={16} />

                <h3>
                  ORDER PROGRESS
                </h3>

              </div>


              <div className="tracking-timeline">

                {(
                  order.statusHistory ||
                  []
                )
                  .slice()
                  .reverse()
                  .map(
                    (
                      history,
                      index
                    ) => (

                      <div
                        className={`tracking-event ${
                          index === 0
                            ? "current"
                            : ""
                        }`}
                        key={`${history.status}-${history.changedAt}-${index}`}
                      >

                        <div className="tracking-marker">
                          <span>
                            {getStatusIcon(
                              history.status
                            )}
                          </span>
                        </div>


                        <div className="tracking-event-content">

                          <div>

                            <strong>
                              {formatStatus(
                                history.status
                              )}
                            </strong>

                            {index === 0 && (
                              <small>
                                CURRENT
                              </small>
                            )}

                          </div>


                          <p>
                            {history.note}
                          </p>


                          <time>
                            {formatDate(
                              history.changedAt
                            )}
                          </time>

                        </div>

                      </div>

                    )
                  )}

              </div>

            </div>


            {/* =================================
                PRODUCTS
            ================================= */}

            <div className="tracking-section">

              <div className="tracking-section-title">

                <Package size={16} />

                <h3>
                  YOUR ITEMS
                </h3>

              </div>


              <div className="tracked-products">

                {order.items.map(
                  (item) => (

                    <div
                      className="tracked-product"
                      key={`${item.productId}-${item.size}`}
                    >

                      <img
                        src={item.image}
                        alt={
                          item.name
                        }
                      />


                      <div>

                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          SIZE {item.size}
                          {" · "}
                          QTY {item.quantity}
                        </span>

                      </div>


                      <b>
                        ₹
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </b>

                    </div>

                  )
                )}

              </div>

            </div>


            {/* =================================
                SUMMARY
            ================================= */}

            <div className="tracking-summary">

              <div>
                <span>
                  SUBTOTAL
                </span>

                <strong>
                  ₹
                  {order.subtotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>


              <div>
                <span>
                  SHIPPING
                </span>

                <strong>
                  FREE
                </strong>
              </div>


              <div className="tracking-total">

                <span>
                  TOTAL
                </span>

                <strong>
                  ₹
                  {order.total.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            </div>


          </section>

        )}

      </main>

    </div>
  );
}


export default TrackOrder;