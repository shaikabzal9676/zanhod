const express = require("express");

const {
  createOrder,
  verifyPayment,
  trackOrder,
  getAllOrders,
  getAdminOrderByNumber,
  updateOrderStatus,
} = require("../controllers/orderController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();


// =========================================
// CUSTOMER
// =========================================

router.post(
  "/",
  createOrder
);

router.post(
  "/verify-payment",
  verifyPayment
);

router.post(
  "/track",
  trackOrder
);


// =========================================
// ADMIN
// =========================================

router.get(
  "/admin/all",
  adminAuth,
  getAllOrders
);

router.get(
  "/admin/:orderNumber",
  adminAuth,
  getAdminOrderByNumber
);

router.patch(
  "/admin/:orderNumber/status",
  adminAuth,
  updateOrderStatus
);


module.exports = router;