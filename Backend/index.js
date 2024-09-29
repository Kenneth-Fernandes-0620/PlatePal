const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const FoodModel = require('./models/Food');
const Cart = require('./models/Cart');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const Order = require('./models/Order');

const uploadMiddleware = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 4000;

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

app.use(cors({
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect(`mongodb+srv://root:${process.env.MONGODB_PASS}@blog.oloxt.mongodb.net/food_ordering_website?retryWrites=true&w=majority&appName=blog`);

app.use(express.static("./public/images"));
app.use(express.static("./build"));

// Health check
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.get('/health', (req, res) => {
  res.json({ message: 'ok' });
})

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  console.log(email + " : " + password)

  // Basic input validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already taken.' });
    }

    console.log("Creating user")

    const hashedPassword = await bcrypt.hash(password, salt);

    const userDoc = await User.create({
      email: email,
      password: hashedPassword,
    });

    jwt.sign({ email, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id: userDoc._id,
        email,
      });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'User registration failed.' });
  }
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const userDoc = await User.findOne({ email });

  if (!userDoc) {
    return res.status(400).json('wrong Email');
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({ email, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id: userDoc._id,
        email,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});


app.post('/api/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});

app.post('/api/cart', async (req, res) => {
  const { foodId, quantity, name, price } = req.body;

  // Validate inputs
  if (!foodId || !quantity) {
    return res.status(400).json({ error: 'foodId, quantity, name and price are required' });
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });

    try {
      // Logic to add or update the item in the user's cart
      const cartItem = await Cart.findOneAndUpdate(
        { userId: info.id, foodId, name, price }, // Find cart item by userId and foodId
        { $inc: { quantity } },       // Increment quantity
        { new: true, upsert: true }   // Create a new entry if it doesn't exist
      );

      res.json(cartItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});


app.get('/api/cart', async (req, res) => {
  const { token } = req.cookies;

  // Verify the token to get user info
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const cartItems = await Cart.find({ userId: info.id }).populate('foodId', 'name price'); // Adjust fields as needed

      // Send the items back
      res.json(cartItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

app.delete('/api/cart', async (req, res) => {
  const { foodId } = req.body;

  // Validate input
  if (!foodId) {
    return res.status(400).json({ error: 'foodId is required' });
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });

    try {
      // Remove the item from the user's cart
      const deletedItem = await Cart.findOneAndDelete({ userId: info.id, foodId });

      if (!deletedItem) {
        return res.status(404).json({ error: 'Item not found in cart' });
      }

      res.json({ message: 'Item removed from cart', deletedItem });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});



app.get('/api/food', async (req, res) => {

  // Get page and limit from query parameters
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const limit = parseInt(req.query.limit); // No default limit, fetch all items if not specified

  let foodItems;

  try {
    if (limit) {
      // If limit is specified, calculate skip and apply pagination
      const skip = (page - 1) * limit;
      foodItems = await FoodModel.find().skip(skip).limit(limit);
    } else {
      // If no limit is provided, fetch all items
      foodItems = await FoodModel.find();
    }

    // Return the response
    res.json(foodItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/foodCategories', async (req, res) => {
  try {
    const categories = await FoodModel.aggregate([
      {
        $group: {
          _id: "$category",    // Group by category
          count: { $sum: 1 },  // Count the number of items in each category
        },
      },
      {
        $project: {
          _id: 0,              // Hide the default _id field
          category: "$_id",    // Rename _id to category
          count: 1,            // Include the count field
        },
      },
    ]);

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching categories" });
  }
});


app.get('/api/orders', async (req, res) => {
  const { token } = req.cookies;

  // Verify the token to get user info
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const orders = await Order.find({ userId: info.id }); // Filter orders by userId
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});



app.post('/api/orders', async (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).send('UserId or items not provided');
  }

  try {
    // Create a new order with userId
    const newOrder = new Order({ userId, items });
    await newOrder.save();

    // Remove items from the cart
    await Cart.deleteMany({ userId });

    res.status(201).send('Order placed successfully');
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).send('Internal server error');
  }
});



app.listen(PORT);
console.log(`Server is running on Port:${PORT}`);