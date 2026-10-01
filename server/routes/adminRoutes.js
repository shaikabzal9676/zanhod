const express = require("express");

const {
  loginAdmin,
  logoutAdmin,
  getAdminSession,
} = require("../controllers/adminController");

const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.post("/login", loginAdmin);

router.post("/logout", logoutAdmin);

router.get(
  "/session",
  adminAuth,
  getAdminSession
);

module.exports = router;