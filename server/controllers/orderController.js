const Product = require("../models/Product");
const Order = require("../models/Order");
const PendingPayment = require("../models/PendingPayment");

const razorpay = require("../config/razorpay");

const crypto = require("crypto");

// =========================================
// CONSTANTS
// =========================================

const VALID_SIZES = [
  "S",
  "M",
  "L",
  "XL",
  "XXL",
];

const VALID_ORDER_STATUSES = [
  "placed",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

// =========================================
// HELPERS
// =========================================

const createOrderNumber = () => {
  return `ZANHOD-${Date.now()}-${crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;
};

const createReceipt = () => {
  return `ZANHOD-${Date.now()}-${crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;
};

const escapeRegex = (value) => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

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
    // BASIC VALIDATION
    // ---------------------------------------

    if (
      !customer ||
      !shippingAddress ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Customer, shipping address and items are required",
      });
    }

    // ---------------------------------------
    // CUSTOMER VALIDATION
    // ---------------------------------------

    if (
      !customer.name ||
      !customer.email ||
      !customer.phone
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Customer name, email and phone are required",
      });
    }

    // ---------------------------------------
    // SHIPPING VALIDATION
    // ---------------------------------------

    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Complete shipping address is required",
      });
    }

    // ---------------------------------------
    // PRODUCT IDS
    // ---------------------------------------

    const productIds = items.map(
      (item) => item.productId
    );

    // ---------------------------------------
    // UNIQUE PRODUCT IDS
    // ---------------------------------------
    // Important:
    // Same product can exist with different sizes.

    const uniqueProductIds = [
      ...new Set(productIds),
    ];

    // ---------------------------------------
    // GET PRODUCTS
    // ---------------------------------------

    const products = await Product.find({
      productId: {
        $in: uniqueProductIds,
      },

      available: true,
    });

    if (
      products.length !==
      uniqueProductIds.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "One or more products are unavailable",
      });
    }

    // ---------------------------------------
    // PRODUCT MAP
    // ---------------------------------------

    const productMap = new Map();

    for (const product of products) {
      productMap.set(
        product.productId,
        product
      );
    }

    // ---------------------------------------
    // BUILD TRUSTED ITEMS
    // ---------------------------------------

    const orderItems = [];

    for (const item of items) {
      const product = productMap.get(
        item.productId
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          message:
            `Product ${item.productId} not found`,
        });
      }

      // -------------------------------------
      // SIZE
      // -------------------------------------

      if (
        !VALID_SIZES.includes(item.size)
      ) {
        return res.status(400).json({
          success: false,
          message:
            `Invalid size for ${product.name}`,
        });
      }

      // -------------------------------------
      // QUANTITY
      // -------------------------------------

      const quantity = Number(
        item.quantity
      );

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
        productId:
          product.productId,

        size: item.size,

        quantity,
      });
    }

    // ---------------------------------------
    // CALCULATE TRUSTED SUBTOTAL
    // ---------------------------------------

    const subtotal =
      orderItems.reduce(
        (total, item) => {
          const product =
            productMap.get(
              item.productId
            );

          return (
            total +
            product.price *
              item.quantity
          );
        },
        0
      );

    const shipping = 0;

    const total =
      subtotal + shipping;

    // ---------------------------------------
    // CREATE RAZORPAY ORDER
    // ---------------------------------------

    const receipt =
      createReceipt();

    const razorpayOrder =
      await razorpay.orders.create({
        amount: Math.round(
          total * 100
        ),

        currency: "INR",

        receipt,

        notes: {
          store: "ZANHOD",
        },
      });

    // ---------------------------------------
    // SAVE PENDING PAYMENT
    // ---------------------------------------

    const pendingPayment =
      await PendingPayment.create({
        razorpayOrderId:
          razorpayOrder.id,

        customer: {
          name:
            String(customer.name).trim(),

          email:
            String(customer.email)
              .trim()
              .toLowerCase(),

          phone:
            String(customer.phone).trim(),
        },

        shippingAddress: {
          address:
            String(
              shippingAddress.address
            ).trim(),

          city:
            String(
              shippingAddress.city
            ).trim(),

          state:
            String(
              shippingAddress.state
            ).trim(),

          pincode:
            String(
              shippingAddress.pincode
            ).trim(),
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
  // ---------------------------------------
  // UNIQUE PRODUCT IDS
  // ---------------------------------------

  const productIds =
    pendingItems.map(
      (item) => item.productId
    );

  const uniqueProductIds = [
    ...new Set(productIds),
  ];

  // ---------------------------------------
  // GET PRODUCTS
  // ---------------------------------------
  // We intentionally do NOT require
  // available:true here.
  //
  // The payment session was already created
  // when the product was available.
  //
  // This prevents a product being disabled
  // between payment and verification from
  // causing a paid order to fail.

  const products =
    await Product.find({
      productId: {
        $in: uniqueProductIds,
      },
    });

  if (
    products.length !==
    uniqueProductIds.length
  ) {
    throw new Error(
      "One or more products no longer exist"
    );
  }

  // ---------------------------------------
  // PRODUCT MAP
  // ---------------------------------------

  const productMap = new Map();

  for (const product of products) {
    productMap.set(
      product.productId,
      product
    );
  }

  // ---------------------------------------
  // BUILD FINAL ITEMS
  // ---------------------------------------

  return pendingItems.map((item) => {
    const product =
      productMap.get(
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

const verifyPayment = async (
  req,
  res
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // ---------------------------------------
    // REQUIRED VALUES
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
    // VERIFY SIGNATURE
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

    let signatureValid = false;

    if (
      generatedSignature.length ===
      razorpay_signature.length
    ) {
      signatureValid =
        crypto.timingSafeEqual(
          Buffer.from(
            generatedSignature
          ),
          Buffer.from(
            razorpay_signature
          )
        );
    }

    if (!signatureValid) {
      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed",
      });
    }

    // ---------------------------------------
    // FETCH ACTUAL RAZORPAY PAYMENT
    // ---------------------------------------

    const payment =
      await razorpay.payments.fetch(
        razorpay_payment_id
      );

    // ---------------------------------------
    // VERIFY PAYMENT BELONGS TO ORDER
    // ---------------------------------------

    if (
      payment.order_id !==
      razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment does not belong to this order",
      });
    }

    // ---------------------------------------
    // VERIFY PAYMENT STATUS
    // ---------------------------------------

    if (
      payment.status !== "captured"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment has not been captured",
      });
    }

    // ---------------------------------------
    // EXPECTED AMOUNT
    // ---------------------------------------

    const expectedAmount =
      Math.round(
        Number(
          pendingPayment.total
        ) * 100
      );

    // ---------------------------------------
    // VERIFY PAYMENT AMOUNT
    // ---------------------------------------

    if (
      Number(payment.amount) !==
      expectedAmount
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment amount does not match the order",
      });
    }

    // ---------------------------------------
    // VERIFY PAYMENT CURRENCY
    // ---------------------------------------

    if (
      payment.currency !== "INR"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment currency",
      });
    }

    // ---------------------------------------
    // FETCH RAZORPAY ORDER
    // ---------------------------------------

    const razorpayOrder =
      await razorpay.orders.fetch(
        razorpay_order_id
      );

    // ---------------------------------------
    // VERIFY RAZORPAY ORDER AMOUNT
    // ---------------------------------------

    if (
      Number(
        razorpayOrder.amount
      ) !== expectedAmount
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay order amount does not match",
      });
    }

    // ---------------------------------------
    // VERIFY RAZORPAY ORDER CURRENCY
    // ---------------------------------------

    if (
      razorpayOrder.currency !==
      "INR"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Razorpay order currency is invalid",
      });
    }

    // =======================================
    // IDEMPOTENCY CHECK
    // =======================================

    // ---------------------------------------
    // PAYMENT ID ALREADY USED?
    // ---------------------------------------

    const existingPaymentOrder =
      await Order.findOne({
        razorpayPaymentId:
          razorpay_payment_id,
      });

    if (existingPaymentOrder) {
      if (
        pendingPayment.status !==
        "completed"
      ) {
        pendingPayment.status =
          "completed";

        await pendingPayment.save();
      }

      return res.status(200).json({
        success: true,

        message:
          "Payment already processed",

        order: {
          id:
            existingPaymentOrder._id,

          orderNumber:
            existingPaymentOrder.orderNumber,

          paymentStatus:
            existingPaymentOrder.paymentStatus,

          orderStatus:
            existingPaymentOrder.orderStatus,

          statusHistory:
            existingPaymentOrder.statusHistory ||
            [],
        },
      });
    }

    // ---------------------------------------
    // RAZORPAY ORDER ID ALREADY USED?
    // ---------------------------------------

    const existingOrder =
      await Order.findOne({
        razorpayOrderId:
          razorpay_order_id,
      });

    if (existingOrder) {
      if (
        pendingPayment.status !==
        "completed"
      ) {
        pendingPayment.status =
          "completed";

        await pendingPayment.save();
      }

      return res.status(200).json({
        success: true,

        message:
          "Payment already processed",

        order: {
          id:
            existingOrder._id,

          orderNumber:
            existingOrder.orderNumber,

          paymentStatus:
            existingOrder.paymentStatus,

          orderStatus:
            existingOrder.orderStatus,

          statusHistory:
            existingOrder.statusHistory ||
            [],
        },
      });
    }

    // =======================================
    // BUILD FINAL ITEMS
    // =======================================

    const finalOrderItems =
      await buildFinalOrderItems(
        pendingPayment.items
      );

    // =======================================
    // CREATE REAL ORDER
    // =======================================

    const orderNumber =
      createOrderNumber();

    let order;

    try {
      order =
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
              pendingPayment
                .shippingAddress
                .address,

            city:
              pendingPayment
                .shippingAddress
                .city,

            state:
              pendingPayment
                .shippingAddress
                .state,

            pincode:
              pendingPayment
                .shippingAddress
                .pincode,
          },

          items:
            finalOrderItems,

          subtotal:
            pendingPayment.subtotal,

          shipping:
            pendingPayment.shipping,

          total:
            pendingPayment.total,

          paymentStatus:
            "paid",

          orderStatus:
            "confirmed",

          statusHistory: [
            {
              status:
                "placed",

              note:
                "Order placed successfully",

              changedAt:
                new Date(),
            },

            {
              status:
                "confirmed",

              note:
                "Payment verified successfully",

              changedAt:
                new Date(),
            },
          ],

          paymentMethod:
            "razorpay",

          razorpayOrderId:
            razorpay_order_id,

          razorpayPaymentId:
            razorpay_payment_id,
        });
    } catch (error) {
      // -------------------------------------
      // DUPLICATE PAYMENT RACE PROTECTION
      // -------------------------------------

      if (
        error &&
        error.code === 11000
      ) {
        const duplicateOrder =
          await Order.findOne({
            $or: [
              {
                razorpayPaymentId:
                  razorpay_payment_id,
              },

              {
                razorpayOrderId:
                  razorpay_order_id,
              },
            ],
          });

        if (duplicateOrder) {
          if (
            pendingPayment.status !==
            "completed"
          ) {
            pendingPayment.status =
              "completed";

            await pendingPayment.save();
          }

          return res.status(200).json({
            success: true,

            message:
              "Payment already processed",

            order: {
              id:
                duplicateOrder._id,

              orderNumber:
                duplicateOrder.orderNumber,

              paymentStatus:
                duplicateOrder.paymentStatus,

              orderStatus:
                duplicateOrder.orderStatus,

              statusHistory:
                duplicateOrder.statusHistory ||
                [],
            },
          });
        }
      }

      throw error;
    }

    // =======================================
    // MARK PENDING PAYMENT COMPLETE
    // =======================================

    pendingPayment.status =
      "completed";

    await pendingPayment.save();

    // =======================================
    // RESPONSE
    // =======================================

    return res.status(200).json({
      success: true,

      message:
        "Payment verified successfully",

      order: {
        id:
          order._id,

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

// =========================================
// ADMIN — GET ALL ORDERS
// =========================================

const getAllOrders = async (
  req,
  res
) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "all",
    } = req.query;

    // ---------------------------------------
    // PAGINATION
    // ---------------------------------------

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const itemsPerPage = Math.min(
      Math.max(
        Number(limit) || 10,
        1
      ),
      50
    );

    const skip =
      (currentPage - 1) *
      itemsPerPage;

    // ---------------------------------------
    // FILTER
    // ---------------------------------------

    const filter = {};

    // ---------------------------------------
    // STATUS FILTER
    // ---------------------------------------

    if (
      status !== "all" &&
      VALID_ORDER_STATUSES.includes(
        status
      )
    ) {
      filter.orderStatus =
        status;
    }

    // ---------------------------------------
    // SEARCH FILTER
    // ---------------------------------------

    const cleanSearch =
      String(search).trim();

    if (cleanSearch) {
      const safeSearch =
        escapeRegex(cleanSearch);

      filter.$or = [
        {
          orderNumber: {
            $regex: safeSearch,
            $options: "i",
          },
        },

        {
          "customer.name": {
            $regex: safeSearch,
            $options: "i",
          },
        },

        {
          "customer.email": {
            $regex: safeSearch,
            $options: "i",
          },
        },

        {
          "customer.phone": {
            $regex: safeSearch,
            $options: "i",
          },
        },

        {
          paymentStatus: {
            $regex: safeSearch,
            $options: "i",
          },
        },
      ];
    }

    // ---------------------------------------
    // TOTAL MATCHING ORDERS
    // ---------------------------------------

    const totalOrders =
      await Order.countDocuments(
        filter
      );

    // ---------------------------------------
    // PAGINATED ORDERS
    // ---------------------------------------

    const orders =
      await Order.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(itemsPerPage)
        .lean();

    // ---------------------------------------
    // GLOBAL STATISTICS
    // ---------------------------------------

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

    // ---------------------------------------
    // PAGINATION INFO
    // ---------------------------------------

    const totalPages =
      Math.ceil(
        totalOrders /
          itemsPerPage
      );

    // ---------------------------------------
    // RESPONSE
    // ---------------------------------------

    return res.status(200).json({
      success: true,

      orders,

      statistics: {
        totalOrders:
          overallTotalOrders,

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
          currentPage <
          totalPages,

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

// =========================================
// ADMIN — GET SINGLE ORDER
// =========================================

const getAdminOrderByNumber =
  async (req, res) => {
    try {
      const { orderNumber } =
        req.params;

      const order =
        await Order.findOne({
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
// ADMIN — UPDATE ORDER STATUS
// =========================================

const updateOrderStatus =
  async (req, res) => {
    try {
      const { orderNumber } =
        req.params;

      const { orderStatus, note } =
        req.body;

      // -------------------------------------
      // VALIDATE STATUS
      // -------------------------------------

      if (
        !VALID_ORDER_STATUSES.includes(
          orderStatus
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid order status",
        });
      }

      // -------------------------------------
      // FIND ORDER
      // -------------------------------------

      const order =
        await Order.findOne({
          orderNumber,
        });

      if (!order) {
        return res.status(404).json({
          success: false,

          message:
            "Order not found",
        });
      }

      // -------------------------------------
      // SAME STATUS
      // -------------------------------------

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

      // -------------------------------------
      // UPDATE STATUS
      // -------------------------------------

      order.orderStatus =
        orderStatus;

      // -------------------------------------
      // STATUS HISTORY
      // -------------------------------------

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

      // -------------------------------------
      // SAVE
      // -------------------------------------

      await order.save();

      // -------------------------------------
      // RESPONSE
      // -------------------------------------

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

const trackOrder = async (
  req,
  res
) => {
  try {
    const {
      orderNumber,
      email,
    } = req.body;

    // ---------------------------------------
    // VALIDATION
    // ---------------------------------------

    if (
      !orderNumber ||
      !email
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Order number and email are required",
      });
    }

    // ---------------------------------------
    // FIND ORDER
    // ---------------------------------------

    const order =
      await Order.findOne({
        orderNumber:
          String(orderNumber)
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
    // LIMITED CUSTOMER RESPONSE
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
