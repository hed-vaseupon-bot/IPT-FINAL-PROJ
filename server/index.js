require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');

// Import Models
const User = require('./model/user.model');
const Menu = require('./model/menu.model');

const app = express();
const PORT = 1337;
const DATA_FILE = path.join(__dirname, 'data.json');
const MENU_FILE = path.join(__dirname, 'menu.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/CantoBox-db";
mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB (CantoBox)");
    await seedMenuFromFileIfEmpty();
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// JSON Helper Utility (Kept strictly for the local file fallback login system)
const readJsonFile = (filePath, fallback) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
      return fallback;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    return content ? JSON.parse(content) : fallback;
  } catch (error) {
    console.error(`❌ Read error for ${filePath}:`, error);
    return fallback;
  }
};

const readMenuFile = () => {
  try {
    if (!fs.existsSync(MENU_FILE)) {
      fs.writeFileSync(MENU_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const content = fs.readFileSync(MENU_FILE, 'utf-8');
    return content ? JSON.parse(content) : [];
  } catch (error) {
    console.error(`❌ Read error for ${MENU_FILE}:`, error);
    return [];
  }
};

const writeMenuFile = (menuItems) => {
  try {
    const plainItems = menuItems.map((item) => {
      const obj = item.toObject ? item.toObject({ getters: true, versionKey: false }) : { ...item };
      if (obj._id) obj._id = obj._id.toString();
      return obj;
    });
    fs.writeFileSync(MENU_FILE, JSON.stringify(plainItems, null, 2));
  } catch (error) {
    console.error(`❌ Write error for ${MENU_FILE}:`, error);
  }
};

const syncMenuFile = async () => {
  try {
    const menuItems = await Menu.find().sort({ createdAt: -1 });
    writeMenuFile(menuItems);
  } catch (error) {
    console.error("❌ Error syncing menu.json:", error);
  }
};

const seedMenuFromFileIfEmpty = async () => {
  try {
    const count = await Menu.countDocuments();
    if (count === 0) {
      const fileItems = readMenuFile();
      if (Array.isArray(fileItems) && fileItems.length > 0) {
        const documents = fileItems.map(({ _id, ...rest }) => rest);
        await Menu.insertMany(documents);
        console.log(`✓ Seeded MongoDB menu from ${MENU_FILE}`);
      }
    }
  } catch (error) {
    console.error("❌ Error seeding menu from menu.json:", error);
  }
};

// --- IMAGE UPLOAD CONFIG ---
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// --- API ROUTES ---

// 1. Image Upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  res.json({ imagePath: req.file.filename });
});

// 2. GET Menu Items - Fetches individual documents directly from MongoDB
app.get("/api/menu", async (req, res) => {
  try {
    // Directly pull the freshest state from your database
    const menuItems = await Menu.find().sort({ createdAt: -1 }); 
    
    // Optional: Keeps your local menu.json backup file updated even when you refresh the page
    writeMenuFile(menuItems); 

    res.json(menuItems);
  } catch (error) {
    console.error("❌ Error fetching menu:", error);
    res.status(500).json({ message: "Error fetching menu" });
  }
});

// 3. ADD Menu Item - Creates a separate document for each item in MongoDB
app.post("/api/menu", async (req, res) => {
  try {
    const newItem = new Menu(req.body);
    await newItem.save();
    await syncMenuFile();
    res.status(201).json({ message: "Item added", item: newItem });
  } catch (error) {
    console.error("❌ Error adding item:", error);
    res.status(500).json({ message: "Error adding item" });
  }
});

// 4. EDIT Menu Item - Updates a separate document by its MongoDB _id
app.put("/api/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const updatedItem = await Menu.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true } // Returns the newly modified document
    );

    if (!updatedItem) return res.status(404).json({ message: "Item not found" });
    await syncMenuFile();
    res.json({ message: "Updated successfully", item: updatedItem });
  } catch (error) {
    console.error("❌ Error updating item:", error);
    res.status(500).json({ message: "Error updating item" });
  }
});

// 5. DELETE Menu Item - Deletes an item document and unlinks its uploaded image
app.delete("/api/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }
    
    const deletedItem = await Menu.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ message: "Item not found" });
    
    // Delete associated image file if it exists inside the uploads directory
    if (deletedItem.imageUrl) {
      const imagePath = path.join(__dirname, 'uploads', deletedItem.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`✓ Deleted image: ${deletedItem.imageUrl}`);
      }
    }

    await syncMenuFile();
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item" });
  }
});

// 6. Users - GET ALL
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// 7. Users - ADD
app.post("/api/add-user", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error adding user" });
  }
});

// 8. Authentication (Login via MongoDB users with local fallback)
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    let user = null;

    try {
      user = await User.findOne({ email }).exec();
    } catch (dbError) {
      console.warn("⚠️ MongoDB login check failed, falling back to local auth.", dbError);
    }

    if (!user) {
      const authData = readJsonFile(DATA_FILE, { users: [] });
      user = authData.users.find((u) => u.email === email);
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const userId = user._id ? user._id.toString() : user.id || email;
    const userName = user.name || user.displayName || user.email;

    res.json({
      message: "Login successful",
      user: {
        id: userId,
        name: userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(` CantoBox Server running at http://localhost:${PORT}`);
});

// SYNC: Manually sync MongoDB menu collection to menu.json
app.post('/api/menu/sync', async (req, res) => {
  try {
    await syncMenuFile();
    res.json({ message: 'menu.json synced from MongoDB' });
  } catch (error) {
    console.error('❌ Error during manual sync:', error);
    res.status(500).json({ message: 'Error syncing menu.json' });
  }
});