import { useEffect, useState } from "react";
import {
  RefreshCw,
  Search,
  LogOut,
  Package,
  CheckCircle2,
  Clock3,
  IndianRupee,
  ChevronDown,
  X,
  User,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  CalendarDays,
  Hash,
} from "lucide-react";
import API_URL from "../config/api";
import { useAdminAuth } from "../context/AdminAuthContext";

import "../styles/admin-orders.css";


function AdminOrders() {

  const {
    token,
    admin,
    logout,
  } = useAdminAuth();


  /* =========================================================
     STATE
  ========================================================= */

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [updatingOrder, setUpdatingOrder] =
    useState(null);

  
  const [currentPage, setCurrentPage] = useState(1);

const [pagination, setPagination] = useState({
  currentPage: 1,
  itemsPerPage: 10,
  totalOrders: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});

const [statistics, setStatistics] = useState({
  totalOrders: 0,
  paidOrders: 0,
  pendingPayments: 0,
  paidRevenue: 0,
});


  /* =========================================================
     ORDER DETAILS
  ========================================================= */

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [orderDetailsLoading, setOrderDetailsLoading] =
    useState(false);

  const [orderDetailsError, setOrderDetailsError] =
    useState("");


  /* =========================================================
     FETCH ALL ORDERS
  ========================================================= */

 const fetchOrders = async (
  page = currentPage,
  showRefreshLoader = false
) => {
  try {
    setError("");

    if (showRefreshLoader) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const params = new URLSearchParams();

    params.set("page", page);
    params.set("limit", "10");

    if (searchTerm.trim()) {
      params.set(
        "search",
        searchTerm.trim()
      );
    }

    if (statusFilter !== "all") {
      params.set(
        "status",
        statusFilter
      );
    }

    const response = await fetch(
      `${API_URL}/api/orders/admin/all?${params.toString()}`,
      {
        method: "GET",
        

        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials:"include",
      }
    );

    const data = await response.json();

    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Failed to load orders"
      );
    }

    setOrders(data.orders || []);

    setStatistics(
  data.statistics || {
    totalOrders: 0,
    paidOrders: 0,
    pendingPayments: 0,
    paidRevenue: 0,
  }
);

    setPagination(
      data.pagination || {
        currentPage: page,
        itemsPerPage: 10,
        totalOrders: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      }
    );

    setCurrentPage(
      data.pagination?.currentPage || page
    );

  } catch (error) {

    console.error(
      "Fetch orders error:",
      error
    );

    setError(
      error.message ||
        "Unable to load orders. Please try again."
    );

  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
  if (token) {
    fetchOrders(
      currentPage,
      false
    );
  }
}, [
  token,
  currentPage,
]);


  /* =========================================================
     UPDATE ORDER STATUS
  ========================================================= */

 const updateOrderStatus = async (
  orderNumber,
  newStatus
) => {
  try {
    setError("");
    setUpdatingOrder(orderNumber);

    const response = await fetch(
      `${API_URL}/api/orders/admin/${encodeURIComponent(
        orderNumber
      )}/status`,
      {
        method: "PATCH",
        

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        credentials:"include",

        body: JSON.stringify({
          orderStatus: newStatus,
        }),
      }
    );

    const data = await response.json();

    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Failed to update order status"
      );
    }

    /* =========================================
       UPDATE ORDER IN TABLE
    ========================================= */

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.orderNumber === orderNumber
          ? {
              ...order,

              orderStatus:
                data.order.orderStatus,

              statusHistory:
                data.order.statusHistory ||
                order.statusHistory ||
                [],
            }
          : order
      )
    );

    /* =========================================
       UPDATE OPEN ORDER DETAILS
    ========================================= */

    setSelectedOrder((currentOrder) => {
      if (
        !currentOrder ||
        currentOrder.orderNumber !== orderNumber
      ) {
        return currentOrder;
      }

      return {
        ...currentOrder,

        orderStatus:
          data.order.orderStatus,

        statusHistory:
          data.order.statusHistory ||
          currentOrder.statusHistory ||
          [],
      };
    });

  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    setError(
      error.message ||
        "Unable to update order status."
    );

  } finally {
    setUpdatingOrder(null);
  }
};

  /* =========================================================
     OPEN ORDER DETAILS
  ========================================================= */

  const openOrderDetails = async (
    order
  ) => {

    try {

      /* Show existing order immediately */
      setSelectedOrder(order);

      setOrderDetailsLoading(true);

      setOrderDetailsError("");


      const response = await fetch(
        `${API_URL}/api/orders/admin/${encodeURIComponent(
          order.orderNumber
        )}`,
        {
          method: "GET",


          headers: {
            Authorization:
              `Bearer ${token}`,
          },
          credentials:"include",
        }
      );


      const data =
        await response.json();


      if (response.status === 401) {
        logout();
        return;
      }


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
            "Failed to load order details"
        );

      }


      setSelectedOrder(
        data.order
      );


    } catch (error) {

      console.error(
        "Order details error:",
        error
      );


      setOrderDetailsError(
        error.message ||
          "Unable to load order details."
      );

    } finally {

      setOrderDetailsLoading(false);

    }

  };


  /* =========================================================
     CLOSE ORDER DETAILS
  ========================================================= */

  const closeOrderDetails = () => {

    setSelectedOrder(null);

    setOrderDetailsError("");

  };


  /* =========================================================
     FILTER ORDERS
  ========================================================= */

  useEffect(() => {
  if (!token) {
    return;
  }

  if (currentPage !== 1) {
    setCurrentPage(1);
    return;
  }

  fetchOrders(1);
}, [
  searchTerm,
  statusFilter,
]);


  /* =========================================================
     DASHBOARD STATISTICS
  ========================================================= */

const {
  totalOrders,
  paidOrders,
  pendingPayments,
  paidRevenue,
} = statistics;


  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }


    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formatTime = (date) => {

    if (!date) {
      return "";
    }


    return new Date(
      date
    ).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  };


  /* =========================================================
     STATUS CLASS
  ========================================================= */

  const getStatusClass =
    (status) => {

      return (
        status
          ?.toLowerCase()
          .replace(/\s+/g, "-") ||
        "unknown"
      );

    };


  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (loading) {

    return (

      <main className="admin-orders-page">

        <div className="admin-loading">

          <div className="admin-loading-spinner"></div>

          <p>
            LOADING ORDERS...
          </p>

        </div>

      </main>

    );

  }


  /* =========================================================
     PAGE
  ========================================================= */

  return (

    <main className="admin-orders-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="admin-header">

        <div className="admin-header-left">

          <div className="admin-brand-mark">
            Z
          </div>

          <div>

            <p className="admin-eyebrow">
              ZANHOD / ADMIN
            </p>

            <h1>
              ORDERS
            </h1>

          </div>

        </div>


        <div className="admin-header-right">

          <div className="admin-user">

            <div className="admin-user-info">

              <span>
                LOGGED IN AS
              </span>

              <strong>
                {admin?.name ||
                  "ADMIN"}
              </strong>

            </div>

          </div>


          <button
            type="button"
            className="admin-logout-button"
            onClick={logout}
          >

            <LogOut size={16} />

            LOGOUT

          </button>

        </div>

      </header>


      {/* =====================================================
          DASHBOARD TOP BAR
      ===================================================== */}

      <section className="admin-toolbar">

        <div>

          <p className="admin-section-label">
            DROP 01
          </p>

          <h2>
            ORDER MANAGEMENT
          </h2>

        </div>


        <button
          type="button"
          className="admin-refresh-button"
          onClick={() =>
            fetchOrders(true)
          }
          disabled={refreshing}
        >

          <RefreshCw
            size={16}
            className={
              refreshing
                ? "admin-spin"
                : ""
            }
          />

          {refreshing
            ? "REFRESHING..."
            : "REFRESH"}

        </button>

      </section>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div className="admin-error">

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            ×
          </button>

        </div>

      )}


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="admin-stats">


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Package size={19} />
          </div>

          <div>

            <span>
              TOTAL ORDERS
            </span>

            <strong>
              {totalOrders}
            </strong>

          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <CheckCircle2 size={19} />
          </div>

          <div>

            <span>
              PAID ORDERS
            </span>

            <strong>
              {paidOrders}
            </strong>

          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Clock3 size={19} />
          </div>

          <div>

            <span>
              PENDING PAYMENT
            </span>

            <strong>
              {pendingPayments}
            </strong>

          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <IndianRupee size={19} />
          </div>

          <div>

            <span>
              PAID REVENUE
            </span>

            <strong>
              ₹
              {paidRevenue.toLocaleString("en-IN")}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <section className="admin-filters">


        <div className="admin-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search order, customer, email..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>


        <div className="admin-status-filter">

          <ChevronDown size={15} />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >

            <option value="all">
              ALL STATUS
            </option>

            <option value="placed">
              PLACED
            </option>

            <option value="confirmed">
              CONFIRMED
            </option>

            <option value="processing">
              PROCESSING
            </option>

            <option value="shipped">
              SHIPPED
            </option>

            <option value="delivered">
              DELIVERED
            </option>

            <option value="cancelled">
              CANCELLED
            </option>

          </select>

        </div>

      </section>


      {/* =====================================================
          RESULTS INFO
      ===================================================== */}

      <div className="admin-results-bar">

        <span>

         SHOWING{" "}
{orders.length}{" "}
OF{" "}
{pagination.totalOrders}{" "}
ORDERS

        </span>


        {(searchTerm ||
          statusFilter !== "all") && (

          <button
            type="button"
            onClick={() => {

              setSearchTerm("");

              setStatusFilter(
                "all"
              );

            }}
          >
            CLEAR FILTERS
          </button>

        )}

      </div>


      {/* =====================================================
          ORDERS
      ===================================================== */}

      {orders.length === 0 ? (

        <section className="admin-empty">

          <Package size={34} />

          <h3>
            NO ORDERS FOUND
          </h3>

          <p>

            {orders.length === 0
              ? "Orders will appear here after customers complete checkout."
              : "Try changing your search or status filter."}

          </p>

        </section>

      ) : (

        <section className="admin-orders-container">


          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          <div className="admin-table-wrapper">

            <table className="admin-orders-table">

              <thead>

                <tr>

                  <th>
                    ORDER
                  </th>

                  <th>
                    CUSTOMER
                  </th>

                  <th>
                    ITEMS
                  </th>

                  <th>
                    TOTAL
                  </th>

                  <th>
                    PAYMENT
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    DATE
                  </th>

                </tr>

              </thead>


              <tbody>

                {orders.map(
                  (order) => (

                    <tr
                      key={
                        order._id ||
                        order.orderNumber
                      }
                      className="admin-order-row"
                      onClick={() =>
                        openOrderDetails(
                          order
                        )
                      }
                    >


                      {/* ORDER */}

                      <td>

                        <div className="order-number">

                          {order.orderNumber}

                        </div>


                        {order.razorpayOrderId && (

                          <div className="order-razorpay-id">

                            {
                              order.razorpayOrderId
                            }

                          </div>

                        )}

                      </td>


                      {/* CUSTOMER */}

                      <td>

                        <div className="customer-cell">

                          <strong>
                            {
                              order.customer
                                ?.name ||
                              "—"
                            }
                          </strong>

                          <span>
                            {
                              order.customer
                                ?.email ||
                              "—"
                            }
                          </span>

                          <span>
                            {
                              order.customer
                                ?.phone ||
                              "—"
                            }
                          </span>

                        </div>

                      </td>


                      {/* ITEMS */}

                      <td>

                        <div className="order-items-cell">

                          {order.items?.map(
                            (
                              item,
                              index
                            ) => (

                              <div
                                className="order-item"
                                key={`${item.productId}-${item.size}-${index}`}
                              >

                                <img
                                  src={
                                    item.image
                                  }
                                  alt={
                                    item.name
                                  }
                                />

                                <div>

                                  <strong>
                                    {
                                      item.name
                                    }
                                  </strong>

                                  <span>
                                    {
                                      item.size
                                    }{" "}
                                    ×{" "}
                                    {
                                      item.quantity
                                    }
                                  </span>

                                </div>

                              </div>

                            )
                          )}

                        </div>

                      </td>


                      {/* TOTAL */}

                      <td>

                        <strong className="order-total">

                          ₹
                          {Number(
                            order.total ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </strong>

                      </td>


                      {/* PAYMENT */}

                      <td>

                        <span
                          className={`payment-badge ${getStatusClass(
                            order.paymentStatus
                          )}`}
                        >

                          {
                            order.paymentStatus ||
                            "UNKNOWN"
                          }

                        </span>


                        {order.razorpayPaymentId && (

                          <span className="payment-id">

                            {
                              order.razorpayPaymentId
                            }

                          </span>

                        )}

                      </td>


                      {/* STATUS */}

                      <td
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >

                        <div className="status-control">

                          <select
                            value={
                              order.orderStatus ||
                              "placed"
                            }
                            disabled={
                              updatingOrder ===
                              order.orderNumber
                            }
                            className={`order-status-select ${getStatusClass(
                              order.orderStatus
                            )}`}
                            onChange={(
                              event
                            ) =>
                              updateOrderStatus(
                                order.orderNumber,
                                event.target
                                  .value
                              )
                            }
                          >

                            <option value="placed">
                              PLACED
                            </option>

                            <option value="confirmed">
                              CONFIRMED
                            </option>

                            <option value="processing">
                              PROCESSING
                            </option>

                            <option value="shipped">
                              SHIPPED
                            </option>

                            <option value="delivered">
                              DELIVERED
                            </option>

                            <option value="cancelled">
                              CANCELLED
                            </option>

                          </select>


                          {updatingOrder ===
                            order.orderNumber && (

                            <span className="status-saving">
                              SAVING...
                            </span>

                          )}

                        </div>

                      </td>


                      {/* DATE */}

                      <td>

                        <div className="order-date">

                          <strong>
                            {formatDate(
                              order.createdAt
                            )}
                          </strong>

                          <span>
                            {formatTime(
                              order.createdAt
                            )}
                          </span>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>


          {/* =================================================
              MOBILE ORDER CARDS
          ================================================= */}

          <div className="admin-mobile-orders">

            {orders.map(
              (order) => (

                <article
                  className="admin-mobile-order"
                  key={`mobile-${
                    order._id ||
                    order.orderNumber
                  }`}
                  onClick={() =>
                    openOrderDetails(
                      order
                    )
                  }
                >


                  <div className="mobile-order-top">

                    <div>

                      <span>
                        ORDER
                      </span>

                      <strong>
                        {
                          order.orderNumber
                        }
                      </strong>

                    </div>


                    <div className="mobile-order-total">

                      ₹
                      {Number(
                        order.total ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </div>

                  </div>


                  <div className="mobile-order-customer">

                    <strong>
                      {
                        order.customer
                          ?.name ||
                        "—"
                      }
                    </strong>

                    <span>
                      {
                        order.customer
                          ?.email ||
                        "—"
                      }
                    </span>

                    <span>
                      {
                        order.customer
                          ?.phone ||
                        "—"
                      }
                    </span>

                  </div>


                  <div className="mobile-order-items">

                    {order.items?.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          className="mobile-order-item"
                          key={`${item.productId}-${item.size}-${index}`}
                        >

                          <img
                            src={
                              item.image
                            }
                            alt={
                              item.name
                            }
                          />

                          <div>

                            <strong>
                              {
                                item.name
                              }
                            </strong>

                            <span>
                              Size{" "}
                              {
                                item.size
                              }{" "}
                              · Qty{" "}
                              {
                                item.quantity
                              }
                            </span>

                          </div>

                        </div>

                      )
                    )}

                  </div>


                  <div className="mobile-order-meta">


                    <div>

                      <span>
                        PAYMENT
                      </span>

                      <strong
                        className={`payment-badge ${getStatusClass(
                          order.paymentStatus
                        )}`}
                      >

                        {
                          order.paymentStatus
                        }

                      </strong>

                    </div>


                    <div>

                      <span>
                        DATE
                      </span>

                      <strong>
                        {formatDate(
                          order.createdAt
                        )}
                      </strong>

                    </div>

                  </div>


                  <div
                    className="mobile-order-status"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >

                    <label>
                      ORDER STATUS
                    </label>


                    <select
                      value={
                        order.orderStatus ||
                        "placed"
                      }
                      disabled={
                        updatingOrder ===
                        order.orderNumber
                      }
                      onChange={(
                        event
                      ) =>
                        updateOrderStatus(
                          order.orderNumber,
                          event.target
                            .value
                        )
                      }
                    >

                      <option value="placed">
                        PLACED
                      </option>

                      <option value="confirmed">
                        CONFIRMED
                      </option>

                      <option value="processing">
                        PROCESSING
                      </option>

                      <option value="shipped">
                        SHIPPED
                      </option>

                      <option value="delivered">
                        DELIVERED
                      </option>

                      <option value="cancelled">
                        CANCELLED
                      </option>

                    </select>

                  </div>

                </article>

              )
            )}

          </div>

        </section>

      )}


      {/* =========================================================
    PAGINATION
========================================================= */}

{pagination.totalPages > 1 && (
  <div className="admin-pagination">

    <button
      type="button"
      className="pagination-button"
      onClick={() =>
        setCurrentPage(
          (page) => page - 1
        )
      }
      disabled={
        !pagination.hasPreviousPage
      }
    >
      ← PREVIOUS
    </button>


    <div className="pagination-pages">

      {Array.from(
        {
          length:
            pagination.totalPages,
        },
        (_, index) => index + 1
      ).map((page) => (

        <button
          key={page}
          type="button"
          className={`pagination-page ${
            currentPage === page
              ? "active"
              : ""
          }`}
          onClick={() =>
            setCurrentPage(page)
          }
        >
          {page}
        </button>

      ))}

    </div>


    <button
      type="button"
      className="pagination-button"
      onClick={() =>
        setCurrentPage(
          (page) => page + 1
        )
      }
      disabled={
        !pagination.hasNextPage
      }
    >
      NEXT →
    </button>

  </div>
)}


      {/* =====================================================
          ORDER DETAILS DRAWER
      ===================================================== */}

      {selectedOrder && (

        <div
          className="order-details-overlay"
          onClick={closeOrderDetails}
        >

          <aside
            className="order-details-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* HEADER */}

            <div className="order-details-header">

              <div>

                <p>
                  ZANHOD / ORDER
                </p>

                <h2>
                  {
                    selectedOrder.orderNumber
                  }
                </h2>

              </div>


              <button
                type="button"
                className="order-details-close"
                onClick={
                  closeOrderDetails
                }
                aria-label="Close order details"
              >

                <X size={20} />

              </button>

            </div>


            {/* BODY */}

            <div className="order-details-body">


              {/* LOADING */}

              {orderDetailsLoading ? (

                <div className="order-details-loading">

                  <div className="admin-loading-spinner"></div>

                  <p>
                    LOADING ORDER DETAILS...
                  </p>

                </div>


              ) : orderDetailsError ? (


                /* ERROR */

                <div className="order-details-error">

                  <p>
                    {
                      orderDetailsError
                    }
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      openOrderDetails(
                        selectedOrder
                      )
                    }
                  >
                    TRY AGAIN
                  </button>

                </div>


              ) : (


                /* DETAILS */

                <>


                  {/* =================================================
                      STATUS
                  ================================================= */}

                  <section className="details-block">

                    <div className="details-block-heading">

                      <span>
                        ORDER STATUS
                      </span>

                      <span
                        className={`details-status ${getStatusClass(
                          selectedOrder.orderStatus
                        )}`}
                      >
                        {
                          selectedOrder.orderStatus ||
                          "UNKNOWN"
                        }
                      </span>

                    </div>


                    <div className="details-status-control">

                      <label>
                        UPDATE STATUS
                      </label>


                      <select
                        value={
                          selectedOrder.orderStatus ||
                          "placed"
                        }
                        disabled={
                          updatingOrder ===
                          selectedOrder.orderNumber
                        }
                        onChange={(
                          event
                        ) =>
                          updateOrderStatus(
                            selectedOrder.orderNumber,
                            event.target
                              .value
                          )
                        }
                      >

                        <option value="placed">
                          PLACED
                        </option>

                        <option value="confirmed">
                          CONFIRMED
                        </option>

                        <option value="processing">
                          PROCESSING
                        </option>

                        <option value="shipped">
                          SHIPPED
                        </option>

                        <option value="delivered">
                          DELIVERED
                        </option>

                        <option value="cancelled">
                          CANCELLED
                        </option>

                      </select>

                    </div>

                  </section>


                  {/* =================================================
                      CUSTOMER
                  ================================================= */}

                  <section className="details-block">

                    <div className="details-block-title">

                      <User size={16} />

                      <h3>
                        CUSTOMER
                      </h3>

                    </div>


                    <div className="details-customer">


                      <div className="detail-row">

                        <span>
                          NAME
                        </span>

                        <strong>
                          {
                            selectedOrder.customer
                              ?.name ||
                            "—"
                          }
                        </strong>

                      </div>


                      <div className="detail-row">

                        <span>

                          <Mail size={13} />

                          EMAIL

                        </span>

                        <strong className="break-text">

                          {
                            selectedOrder.customer
                              ?.email ||
                            "—"
                          }

                        </strong>

                      </div>


                      <div className="detail-row">

                        <span>

                          <Phone size={13} />

                          PHONE

                        </span>

                        <strong>

                          {
                            selectedOrder.customer
                              ?.phone ||
                            "—"
                          }

                        </strong>

                      </div>


                    </div>

                  </section>


                  {/* =================================================
                      SHIPPING
                  ================================================= */}

                  <section className="details-block">

                    <div className="details-block-title">

                      <MapPin size={16} />

                      <h3>
                        SHIPPING ADDRESS
                      </h3>

                    </div>


                    <div className="shipping-address">

                      <p>
                        {
                          selectedOrder
                            .shippingAddress
                            ?.address ||
                          "—"
                        }
                      </p>

                      <p>

                        {
                          selectedOrder
                            .shippingAddress
                            ?.city ||
                          ""
                        }

                        {selectedOrder
                          .shippingAddress
                          ?.city &&
                        selectedOrder
                          .shippingAddress
                          ?.state
                          ? ", "
                          : ""}

                        {
                          selectedOrder
                            .shippingAddress
                            ?.state ||
                          ""
                        }

                      </p>

                      <strong>

                        PINCODE:{" "}

                        {
                          selectedOrder
                            .shippingAddress
                            ?.pincode ||
                          "—"
                        }

                      </strong>

                    </div>

                  </section>


                  {/* =================================================
                      PRODUCTS
                  ================================================= */}

                  <section className="details-block">

                    <div className="details-block-title">

                      <Package size={16} />

                      <h3>
                        ORDERED PRODUCTS
                      </h3>

                    </div>


                    <div className="details-products">

                      {selectedOrder.items?.map(
                        (
                          item,
                          index
                        ) => (

                          <div
                            className="details-product"
                            key={`${item.productId}-${item.size}-${index}`}
                          >

                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                            />


                            <div className="details-product-info">

                              <strong>
                                {
                                  item.name
                                }
                              </strong>

                              <span>
                                ZANHOD /{" "}
                                {
                                  item.productId
                                }
                              </span>

                              <span>
                                SIZE{" "}
                                {
                                  item.size
                                }{" "}
                                · QTY{" "}
                                {
                                  item.quantity
                                }
                              </span>

                            </div>


                            <strong className="details-product-price">

                              ₹
                              {Number(
                                item.price ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}

                            </strong>

                          </div>

                        )
                      )}

                    </div>

                  </section>


                  {/* =================================================
                      PAYMENT
                  ================================================= */}

                  <section className="details-block">

                    <div className="details-block-title">

                      <CreditCard size={16} />

                      <h3>
                        PAYMENT
                      </h3>

                    </div>


                    <div className="payment-details">


                      <div className="detail-row">

                        <span>
                          PAYMENT STATUS
                        </span>

                        <strong
                          className={`details-payment-status ${getStatusClass(
                            selectedOrder.paymentStatus
                          )}`}
                        >

                          {
                            selectedOrder.paymentStatus ||
                            "UNKNOWN"
                          }

                        </strong>

                      </div>


                      <div className="detail-row">

                        <span>
                          PAYMENT METHOD
                        </span>

                        <strong>

                          {
                            selectedOrder.paymentMethod ||
                            "RAZORPAY"
                          }

                        </strong>

                      </div>


                      {selectedOrder.razorpayPaymentId && (

                        <div className="detail-row">

                          <span>
                            PAYMENT ID
                          </span>

                          <strong className="break-text">

                            {
                              selectedOrder.razorpayPaymentId
                            }

                          </strong>

                        </div>

                      )}


                      {selectedOrder.razorpayOrderId && (

                        <div className="detail-row">

                          <span>
                            RAZORPAY ORDER
                          </span>

                          <strong className="break-text">

                            {
                              selectedOrder.razorpayOrderId
                            }

                          </strong>

                        </div>

                      )}

                    </div>

                  </section>


                  {/* =================================================
                      ORDER SUMMARY
                  ================================================= */}

                  <section className="details-block">

                    <div className="details-block-title">

                      <IndianRupee size={16} />

                      <h3>
                        ORDER SUMMARY
                      </h3>

                    </div>


                    <div className="details-summary">


                      <div>

                        <span>
                          SUBTOTAL
                        </span>

                        <strong>

                          ₹
                          {Number(
                            selectedOrder.subtotal ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </strong>

                      </div>


                      <div>

                        <span>
                          SHIPPING
                        </span>

                        <strong>

                          {Number(
                            selectedOrder.shipping ||
                              0
                          ) === 0
                            ? "FREE"
                            : `₹${Number(
                                selectedOrder.shipping
                              ).toLocaleString(
                                "en-IN"
                              )}`}

                        </strong>

                      </div>


                      <div className="details-total">

                        <span>
                          TOTAL
                        </span>

                        <strong>

                          ₹
                          {Number(
                            selectedOrder.total ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </strong>

                      </div>


                    </div>

                  </section>


                  {/* =================================================
                      ORDER INFORMATION
                  ================================================= */}

                  <section className="details-block">

                    <div className="details-block-title">

                      <CalendarDays size={16} />

                      <h3>
                        ORDER INFORMATION
                      </h3>

                    </div>


                    <div className="order-information">


                      <div className="detail-row">

                        <span>

                          <Hash size={12} />

                          ORDER NUMBER

                        </span>

                        <strong className="break-text">

                          {
                            selectedOrder.orderNumber
                          }

                        </strong>

                      </div>


                      <div className="detail-row">

                        <span>

                          <CalendarDays
                            size={12}
                          />

                          CREATED

                        </span>

                        <strong>

                          {formatDate(
                            selectedOrder.createdAt
                          )}

                        </strong>

                      </div>


                      <div className="detail-row">

                        <span>
                          TIME
                        </span>

                        <strong>

                          {formatTime(
                            selectedOrder.createdAt
                          )}

                        </strong>

                      </div>


                    </div>

                  </section>


                </>

              )}

            </div>

          </aside>

        </div>

      )}

    </main>

  );

}


export default AdminOrders;