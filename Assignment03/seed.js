const mongoose = require("mongoose");
const Product = require("./models/Product"); // Make sure the path is correct

// --------------------
// 1. CONNECT TO MONGODB
// --------------------
mongoose.connect("mongodb://127.0.0.1:27017/ecommerceDB")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// --------------------
// 2. SAMPLE PRODUCTS
// --------------------
const products = [
  
  { 
    name: "Real Strawberry", 
    price: 3.5, 
    category: "Ice Cream", 
    image: "strawberry.png", 
    description: "Strawberry ice cream with fresh strawberry swirls." 
  },
  { 
    name: "Real Blueberry", 
    price: 3.0, 
    category: "Ice Cream", 
    image: "blueberry.png", 
    description: "Classic creamy bluberry ice cream." 
  },
  { 
    name: "Real Vanilla", 
    price: 3.7, 
    category: "Ice Cream", 
    image: "vanilla.png", 
    description: "rich vanilla flavour ." 
  },
  { 
    name: "Real Lemon", 
    price: 4.0, 
    category: "Ice Cream", 
    image: "lemon.png", 
    description: "Refreshing lemon ice cream." 
  },
  { 
    name: "Real Plum", 
    price: 4.2, 
    category: "Ice Cream", 
    image: "plum.png", 
    description: "Real plum goodness." 
  },
  { 
    name: "Real raspberry", 
    price: 3.8, 
    category: "Ice Cream", 
    image: "raspberry.png", 
    description: "Smooth mango ice cream with real raspberry chunks." 
  }
];

// --------------------
// 3. SEED FUNCTION
// --------------------
const seedDB = async () => {
  try {
    await Product.deleteMany({}); // Optional: clears existing products
    await Product.insertMany(products);
    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
