const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Food = require('./models/Food');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');

const uploadMiddleware = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 4000;

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));
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

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log(username + " : " + password)

  const userDoc = await User.findOne({ username });

  if (!userDoc) {
    return res.status(400).json('wrong Email');
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: 'not logged in' });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});

app.post('/food', uploadMiddleware.single('file'), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const foodDoc = await Food.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(foodDoc);
  });

});

app.put('/food', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const foodDoc = await Food.findById(id);
    const isAuthor = JSON.stringify(foodDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }

    await foodDoc.updateOne({
      title,
      summary,
      content,
      cover: newPath ? newPath : foodDoc.cover,
    });

    res.json(foodDoc);
  });

});

app.get('/food', async (req, res) => {
  console.log("GET /food");

  // Get page and limit from query parameters
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const limit = parseInt(req.query.limit); // No default limit, fetch all items if not specified

  let foodItems;

  try {
    if (limit) {
      // If limit is specified, calculate skip and apply pagination
      const skip = (page - 1) * limit;
      foodItems = await Food.find().skip(skip).limit(limit);
    } else {
      // If no limit is provided, fetch all items
      foodItems = await Food.find();
    }

    // Return the response
    res.json(foodItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/foodCategories', async (req, res) => {
  try {
    const categories = await Food.aggregate([
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


app.get('/Food/:id', async (req, res) => {
  const { id } = req.params;
  const foodDoc = await Food.findById(id).populate('author', ['username']);
  res.json(foodDoc);
})

app.listen(PORT);
console.log(`Server is running on  http://localhost:${PORT}`);