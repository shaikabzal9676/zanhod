const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const Admin = require("./models/Admin");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("MongoDB connected");

    const email =
      "admin@zanhod.com";

    const password =
      "ZanhodAdmin@123";

    const existingAdmin =
      await Admin.findOne({ email });

    if (existingAdmin) {
      console.log(
        "Admin already exists"
      );

      process.exit();
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    await Admin.create({
      name: "ZANHOD Admin",
      email,
      password: hashedPassword,
    });

    console.log(
      "Admin created successfully"
    );

    console.log(
      "Email:",
      email
    );

    console.log(
      "Password:",
      password
    );

    process.exit();
  } catch (error) {
    console.error(
      "Admin creation error:",
      error
    );

    process.exit(1);
  }
};

createAdmin();