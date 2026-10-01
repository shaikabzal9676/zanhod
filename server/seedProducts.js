const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("./models/Product");

dotenv.config();

const products = [
  {
    productId: "001",
    name: "THE VOID",
    description: "Minimal. Timeless.",
    price: 2499,
    image: "/products/void.jpg",
    collection: "DROP 01",
  },

  {
    productId: "002",
    name: "AFTER DARK",
    description: "Bold. Unforgiving.",
    price: 2699,
    image: "/products/after-dark.jpg",
    collection: "DROP 01",
  },

  {
    productId: "003",
    name: "NORTH",
    description: "Cold. Focused.",
    price: 2599,
    image: "/products/north.jpg",
    collection: "DROP 01",
  },

  {
    productId: "004",
    name: "REBEL",
    description: "Defy. Create.",
    price: 2699,
    image: "/products/rebel.jpg",
    collection: "DROP 01",
  },

  {
    productId: "005",
    name: "NOIR",
    description: "Pure. Essential.",
    price: 2499,
    image: "/products/noir.jpg",
    collection: "DROP 01",
  },

  {
    productId: "006",
    name: "ORIGIN",
    description: "Where it began.",
    price: 2799,
    image: "/products/origin.jpg",
    collection: "DROP 01",
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("ZANHOD products added successfully");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

seedProducts();