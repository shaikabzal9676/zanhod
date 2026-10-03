const mongoose = require("mongoose");

const pendingPaymentSchema = new mongoose.Schema(
  {
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },

    customer: {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },
    },

    shippingAddress: {
      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },
    },

    items: {
      type: [
        {
          productId: {
            type: String,
            required: true,
          },

          size: {
            type: String,
            required: true,
            enum: ["S", "M", "L", "XL", "XXL"],
          },

          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
        },
      ],
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    shipping: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 60 * 1000),
      expires: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PendingPayment",
  pendingPaymentSchema
);
