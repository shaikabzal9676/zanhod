const mongoose = require("mongoose");

// =========================================
// ORDER ITEM
// =========================================

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    size: {
      type: String,
      required: true,
      enum: [
        "S",
        "M",
        "L",
        "XL",
        "XXL",
      ],
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    image: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

// =========================================
// ORDER STATUS HISTORY
// =========================================

const statusHistorySchema =
  new mongoose.Schema(
    {
      status: {
        type: String,
        required: true,

        enum: [
          "placed",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ],
      },

      note: {
        type: String,
        default: "",
        trim: true,
      },

      changedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      _id: false,
    }
  );

// =========================================
// ORDER
// =========================================

const orderSchema = new mongoose.Schema(
  {
    // ---------------------------------------
    // ORDER NUMBER
    // ---------------------------------------

    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    // ---------------------------------------
    // CUSTOMER
    // ---------------------------------------

    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // ---------------------------------------
    // SHIPPING ADDRESS
    // ---------------------------------------

    shippingAddress: {
      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      pincode: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // ---------------------------------------
    // ITEMS
    // ---------------------------------------

    items: {
      type: [orderItemSchema],
      required: true,
    },

    // ---------------------------------------
    // PRICING
    // ---------------------------------------

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    shipping: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    // ---------------------------------------
    // PAYMENT STATUS
    // ---------------------------------------

    paymentStatus: {
      type: String,

      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],

      default: "pending",
    },

    // ---------------------------------------
    // ORDER STATUS
    // ---------------------------------------

    orderStatus: {
      type: String,

      enum: [
        "placed",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],

      default: "placed",
    },

    // ---------------------------------------
    // STATUS HISTORY
    // ---------------------------------------

    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },

    // ---------------------------------------
    // PAYMENT METHOD
    // ---------------------------------------

    paymentMethod: {
      type: String,
      default: "razorpay",
    },

    // ---------------------------------------
    // RAZORPAY ORDER ID
    // ---------------------------------------
    // Unique + sparse prevents the same
    // Razorpay order from creating multiple
    // database orders.

    razorpayOrderId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },

    // ---------------------------------------
    // RAZORPAY PAYMENT ID
    // ---------------------------------------
    // Critical duplicate-payment protection.

    razorpayPaymentId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);
