const Product = require("../models/Product");
const Order = require("../models/Order");
const PendingPayment = require("../models/PendingPayment");

const razorpay = require("../config/razorpay");

const crypto = require("crypto");


// =========================================
// CREATE ORDER
// =========================================

// =========================================
// CREATE RAZORPAY PAYMENT
// =========================================

const createOrder = async (req, res) => {
  try {
    const {
      customer,
      shippingAddress,
      items,
    } = req.body;

    // ---------------------------------------
    // VALIDATION
    // ---------------------------------------

    if (!customer || !shippingAddress || !items) {
      return res.status(400).json({
        success: false,
        message:
          "Customer, shipping address and items are required",
      });
    }

    if (!items.length) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // ---------------------------------------
    // GET PRODUCTS FROM DATABASE
    // ---------------------------------------

    const productIds = items.map(
      (item) => item.productId
    );

    const products = await Product.find({
      productId: {
        $in: productIds,
      },
      available: true,
    });

    if (products.length !== items.length) {
      return res.status(400).json({
        success: false,
        message:
          "One or more products are unavailable",
      });
    }

    // ---------------------------------------
    // BUILD TRUSTED ITEMS
    // ---------------------------------------

    const orderItems = [];

    for (const item of items) {
      const product = products.find(
        (product) =>
          product.productId === item.productId
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          message:
            `Product ${item.productId} not found`,
        });
      }

      const validSizes = [
        "S",
        "M",
        "L",
        "XL",
        "XXL",
      ];

      if (!validSizes.includes(item.size)) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid size for ${product.name}`,
        });
      }

      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid quantity for ${product.name}`,
        });
      }

      orderItems.push({
        productId: product.productId,
        size: item.size,
        quantity,
      });
    }

    // ---------------------------------------
    // CALCULATE TRUSTED TOTAL
    // ---------------------------------------

    const subtotal = products.reduce(
      (total, product) => {
        const matchingItems = items.filter(
          (item) =>
            item.productId === product.productId
        );

        return (
          total +
          matchingItems.reduce(
            (itemTotal, item) =>
              itemTotal +
              product.price *
                Number(item.quantity),
            0
          )
        );
      },
      0
    );

    const shipping = 0;
    const total = subtotal + shipping;

    // ---------------------------------------
    // CREATE RAZORPAY ORDER
    // ---------------------------------------

    const receipt =
      `ZANHOD-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

    const razorpayOrder =
      await razorpay.orders.create({
        amount: total * 100,
        currency: "INR",
        receipt,

        notes: {
          store: "ZANHOD",
        },
      });

    // ---------------------------------------
    // SAVE CHECKOUT AS PENDING PAYMENT
    // NOT AS AN ACTUAL ORDER
    // ---------------------------------------

    const pendingPayment =
      await PendingPayment.create({
        razorpayOrderId:
          razorpayOrder.id,

        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },

        shippingAddress: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
        },

        items: orderItems,

        subtotal,
        shipping,
        total,

        status: "pending",
      });

    // ---------------------------------------
    // RESPONSE
    // ---------------------------------------

    return res.status(201).json({
      success: true,

      message:
        "Payment session created",

      order: {
        pendingPaymentId:
          pendingPayment._id,

        razorpayOrderId:
          razorpayOrder.id,

        total,

        razorpayKeyId:
          process.env.RAZORPAY_KEY_ID,
      },
    });

  } catch (error) {
    console.error(
      "Create payment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create payment",
    });
  }
};



// =========================================
// BUILD FINAL ORDER ITEMS
// =========================================

const buildFinalOrderItems = async (
  pendingItems
) => {
  const productIds =
    pendingItems.map(
      (item) => item.productId
    );

  const products =
    await Product.find({
      productId: {
        $in: productIds,
      },
      available: true,
    });

  if (
    products.length !==
    pendingItems.length
  ) {
    throw new Error(
      "One or more products are no longer available"
    );
  }

  return pendingItems.map((item) => {
    const product =
      products.find(
        (product) =>
          product.productId ===
          item.productId
      );

    if (!product) {
      throw new Error(
        `Product ${item.productId} not found`
      );
    }

    return {
      productId:
        product.productId,

      name:
        product.name,

      price:
        product.price,

      size:
        item.size,

      quantity:
        item.quantity,

      image:
        product.image,
    };
  });
};

// =========================================
// VERIFY RAZORPAY PAYMENT
// =========================================

// =========================================
// VERIFY RAZORPAY PAYMENT
// =========================================

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // ---------------------------------------
    // CHECK REQUIRED VALUES
    // ---------------------------------------

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment verification details are missing",
      });
    }

    // ---------------------------------------
    // FIND PENDING PAYMENT
    // ---------------------------------------

    const pendingPayment =
      await PendingPayment.findOne({
        razorpayOrderId:
          razorpay_order_id,
      });

    if (!pendingPayment) {
      return res.status(404).json({
        success: false,
        message:
          "Payment session not found or expired",
      });
    }

    // ---------------------------------------
    // VERIFY RAZORPAY SIGNATURE
    // ---------------------------------------

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed",
      });
    }

    // ---------------------------------------
    // PREVENT DUPLICATE VERIFICATION
    // ---------------------------------------

    if (
      pendingPayment.status ===
      "completed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment has already been processed",
      });
    }

    // ---------------------------------------
    // CREATE REAL ORDER
    // ---------------------------------------

    const orderNumber =
      `ZANHOD-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;

    const order =
      await Order.create({
        orderNumber,

        customer: {
          name:
            pendingPayment.customer.name,

          email:
            pendingPayment.customer.email,

          phone:
            pendingPayment.customer.phone,
        },

        shippingAddress: {
          address:
            pendingPayment.shippingAddress.address,

          city:
            pendingPayment.shippingAddress.city,

          state:
            pendingPayment.shippingAddress.state,

          pincode:
            pendingPayment.shippingAddress.pincode,
        },

        items:
          await buildFinalOrderItems(
            pendingPayment.items
          ),

        subtotal:
          pendingPayment.subtotal,

        shipping:
          pendingPayment.shipping,

        total:
          pendingPayment.total,

        paymentStatus: "paid",

        orderStatus: "confirmed",

        statusHistory: [
          {
            status: "placed",
            note:
              "Order placed successfully",
            changedAt: new Date(),
          },

          {
            status: "confirmed",
            note:
              "Payment verified successfully",
            changedAt: new Date(),
          },
        ],

        paymentMethod: "razorpay",

        razorpayOrderId:
          razorpay_order_id,

        razorpayPaymentId:
          razorpay_payment_id,
      });

    // ---------------------------------------
    // MARK PENDING PAYMENT COMPLETE
    // ---------------------------------------

    pendingPayment.status =
      "completed";

    await pendingPayment.save();

    // ---------------------------------------
    // RESPONSE
    // ---------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Payment verified successfully",

      order: {
        id: order._id,

        orderNumber:
          order.orderNumber,

        paymentStatus:
          order.paymentStatus,

        orderStatus:
          order.orderStatus,

        statusHistory:
          order.statusHistory || [],
      },
    });

  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Payment verification failed",
    });
  }
};



/*
|--------------------------------------------------------------------------
| ADMIN — GET ALL ORDERS
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| ADMIN — GET ALL ORDERS
| PAGINATED + SEARCH + STATUS FILTER
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| ADMIN — GET ALL ORDERS
| PAGINATED + SEARCH + STATUS FILTER + GLOBAL STATISTICS
|--------------------------------------------------------------------------
*/

const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "all",
    } = req.query;

    /* =========================================
       PAGINATION
    ========================================= */

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const itemsPerPage = Math.min(
      Math.max(Number(limit) || 10, 1),
      50
    );

    const skip =
      (currentPage - 1) * itemsPerPage;


    /* =========================================
       FILTER
    ========================================= */

    const filter = {};


    /* =========================================
       STATUS FILTER
    ========================================= */

    const allowedStatuses = [
      "placed",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (
      status !== "all" &&
      allowedStatuses.includes(status)
    ) {
      filter.orderStatus = status;
    }


    /* =========================================
       SEARCH FILTER
    ========================================= */

    const cleanSearch =
      String(search).trim();

    if (cleanSearch) {
      filter.$or = [
        {
          orderNumber: {
            $regex: cleanSearch,
            $options: "i",
          },
        },

        {
          "customer.name": {
            $regex: cleanSearch,
            $options: "i",
          },
        },

        {
          "customer.email": {
            $regex: cleanSearch,
            $options: "i",
          },
        },

        {
          "customer.phone": {
            $regex: cleanSearch,
            $options: "i",
          },
        },

        {
          paymentStatus: {
            $regex: cleanSearch,
            $options: "i",
          },
        },
      ];
    }


    /* =========================================
       TOTAL MATCHING ORDERS
    ========================================= */

    const totalOrders =
      await Order.countDocuments(filter);


    /* =========================================
       PAGINATED ORDERS
    ========================================= */

    const orders =
      await Order.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(itemsPerPage)
        .lean();


    /* =========================================
       GLOBAL DASHBOARD STATISTICS
       
       These are calculated from ALL orders,
       not only the current page.
    ========================================= */

   /* =========================================
   GLOBAL DASHBOARD STATISTICS
========================================= */

const overallTotalOrders =
  await Order.countDocuments();

const [
  paidOrders,
  pendingPayments,
  revenueResult,
] = await Promise.all([
  Order.countDocuments({
    paymentStatus: "paid",
  }),

  Order.countDocuments({
    paymentStatus: "pending",
  }),

  Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
      },
    },

    {
      $group: {
        _id: null,

        total: {
          $sum: "$total",
        },
      },
    },
  ]),
]);


const paidRevenue =
  revenueResult.length > 0
    ? revenueResult[0].total
    : 0;

  
     


    /* =========================================
       PAGINATION INFORMATION
    ========================================= */

    const totalPages =
      Math.ceil(
        totalOrders / itemsPerPage
      );


    /* =========================================
       RESPONSE
    ========================================= */

    return res.status(200).json({
      success: true,

      orders,

      statistics: {
  totalOrders: overallTotalOrders,
  paidOrders,
  pendingPayments,
  paidRevenue,
},

      pagination: {
        currentPage,

        itemsPerPage,

        totalOrders,

        totalPages,

        hasNextPage:
          currentPage < totalPages,

        hasPreviousPage:
          currentPage > 1,
      },
    });

  } catch (error) {

    console.error(
      "Get all orders error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch orders",
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN — GET SINGLE ORDER
|--------------------------------------------------------------------------
*/

const getAdminOrderByNumber = async (
  req,
  res
) => {
  try {

    const { orderNumber } =
      req.params;


    const order = await Order.findOne({
      orderNumber,
    }).lean();


    if (!order) {
      return res.status(404).json({
        success: false,

        message:
          "Order not found",
      });
    }


    return res.status(200).json({
      success: true,

      order,
    });

  } catch (error) {

    console.error(
      "Admin order details error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch order details",
    });
  }
};


// =========================================
// UPDATE ORDER STATUS - ADMIN
// =========================================

const updateOrderStatus = async (
  req,
  res
) => {
  try {

    const { orderNumber } =
      req.params;

    const { orderStatus, note } =
      req.body;


    // ---------------------------------------
    // ALLOWED STATUSES
    // ---------------------------------------

    const allowedStatuses = [
      "placed",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];


    if (
      !allowedStatuses.includes(
        orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid order status",
      });
    }


    // ---------------------------------------
    // FIND ORDER
    // ---------------------------------------

    const order = await Order.findOne({
      orderNumber,
    });


    if (!order) {
      return res.status(404).json({
        success: false,

        message:
          "Order not found",
      });
    }


    // ---------------------------------------
    // CHECK IF STATUS IS ALREADY SAME
    // ---------------------------------------

    if (
      order.orderStatus ===
      orderStatus
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Order is already in this status",
      });
    }


    // ---------------------------------------
    // UPDATE STATUS
    // ---------------------------------------

    order.orderStatus =
      orderStatus;


    // ---------------------------------------
    // ADD STATUS HISTORY
    // ---------------------------------------

    order.statusHistory =
      order.statusHistory || [];


    order.statusHistory.push({
      status: orderStatus,

      note:
        note ||
        `Order status changed to ${orderStatus}`,

      changedAt:
        new Date(),
    });


    // ---------------------------------------
    // SAVE ORDER
    // ---------------------------------------

    await order.save();


    // ---------------------------------------
    // RESPONSE
    // ---------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Order status updated",

      order: {
        orderNumber:
          order.orderNumber,

        orderStatus:
          order.orderStatus,

        paymentStatus:
          order.paymentStatus,

        statusHistory:
          order.statusHistory || [],
      },
    });

  } catch (error) {

    console.error(
      "Update order status error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to update order status",
    });
  }
};

// =========================================
// CUSTOMER — TRACK ORDER
// =========================================

const trackOrder = async (req, res) => {
  try {
    const {
      orderNumber,
      email,
    } = req.body;


    // ---------------------------------------
    // VALIDATION
    // ---------------------------------------

    if (!orderNumber || !email) {
      return res.status(400).json({
        success: false,
        message:
          "Order number and email are required",
      });
    }


    // ---------------------------------------
    // FIND ORDER
    // ---------------------------------------

    const order = await Order.findOne({
      orderNumber: String(
        orderNumber
      )
        .trim()
        .toUpperCase(),

      "customer.email":
        String(email)
          .trim()
          .toLowerCase(),
    }).lean();


    // ---------------------------------------
    // DON'T REVEAL WHICH FIELD FAILED
    // ---------------------------------------

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order number or email is incorrect",
      });
    }


    // ---------------------------------------
    // RETURN LIMITED CUSTOMER DATA
    // ---------------------------------------

    return res.status(200).json({
      success: true,

      order: {
        orderNumber:
          order.orderNumber,

        customer: {
          name:
            order.customer.name,
        },

        items:
          order.items,

        subtotal:
          order.subtotal,

        shipping:
          order.shipping,

        total:
          order.total,

        paymentStatus:
          order.paymentStatus,

        orderStatus:
          order.orderStatus,

        paymentMethod:
          order.paymentMethod,

        statusHistory:
          order.statusHistory || [],

        createdAt:
          order.createdAt,
      },
    });

  } catch (error) {

    console.error(
      "Track order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to track order",
    });
  }
};


// =========================================
// EXPORTS
// =========================================

module.exports = {
  createOrder,
  verifyPayment,
  trackOrder,
  getAllOrders,
  getAdminOrderByNumber,
  updateOrderStatus,
};
