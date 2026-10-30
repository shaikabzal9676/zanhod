const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("./models/Product");

dotenv.config();

const products = [
  
  {
    id: "001",
    name: "The ZANHOD Signature Hoodie",
    description: "Own. Your. Identity.",
    price: 1199,
    image: "/products/hoodie_product_1.png",
  },
  
  {
    id: "002",
    name: "The Sakura Summit Hoodie",
    description: "Rise Beyond Limits.",
    price: 1199,
    image: "/products/hoodie_product_2.png",

  },
  
  {
    id: "003",
    name: "The Rising Tiger Hoodie",
    description: "Power Without Permission.",
    price: 1199,
    image: "/products/hoodie_product_3.png",
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
