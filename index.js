const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
const connectDB = async () => {
  try {
    console.log("MongoDB Connection Attempt...");

    const mongoURI =
      "mongodb://admin:password123@mongodb:27017/todoapp?authSource=admin";

    console.log("Connecting to MongoDB using URI:", mongoURI);

    await mongoose.connect(mongoURI, {
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected Successfully!");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    console.error("Application continuing despite MongoDB connection failure");
  }
};

// Todo Model
const TodoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Todo = mongoose.model("Todo", TodoSchema);

// Routes

// Get all todos
app.get("/api/todos", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        error: "Database not connected",
        readyState: mongoose.connection.readyState,
        mockData: [
          { _id: "1", text: "Mock Todo 1", completed: false },
          { _id: "2", text: "Mock Todo 2", completed: true },
        ],
      });
    }

    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({
      error: "Server error",
      details: err.toString(),
      mockData: [
        { _id: "1", text: "Mock Todo 1", completed: false },
        { _id: "2", text: "Mock Todo 2", completed: true },
      ],
    });
  }
});

// Add new todo
app.post("/api/todos", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        error: "Database not connected",
        readyState: mongoose.connection.readyState,
      });
    }

    const newTodo = new Todo({
      text: req.body.text,
    });

    const todo = await newTodo.save();
    res.json(todo);
  } catch (err) {
    console.error("Error adding todo:", err);
    res.status(500).json({ error: "Server error", details: err.toString() });
  }
});

// Update todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        error: "Database not connected",
        readyState: mongoose.connection.readyState,
      });
    }

    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    todo.text = req.body.text || todo.text;
    todo.completed =
      req.body.completed !== undefined ? req.body.completed : todo.completed;

    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ error: "Server error", details: err.toString() });
  }
});

// Delete todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        error: "Database not connected",
        readyState: mongoose.connection.readyState,
      });
    }

    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    await todo.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ error: "Server error", details: err.toString() });
  }
});

app.get("/debug", (req, res) => {
  res.json({
    mongooseState: {
      readyState: mongoose.connection.readyState,
      readyStateText:
        ["disconnected", "connected", "connecting", "disconnecting"][
          mongoose.connection.readyState
        ] || "unknown",
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      port: PORT,
    },
  });
});

app.get("/health", (req, res) => {
  const mongoState = mongoose.connection.readyState;
  const stateText =
    ["disconnected", "connected", "connecting", "disconnecting"][mongoState] ||
    "unknown";

  res.status(mongoState === 1 ? 200 : 200).json({
    status: "ok",
    databaseStatus: stateText,
    databaseReadyState: mongoState,
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Connect to MongoDB
connectDB().finally(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server ready at http://localhost:${PORT}`);
  });
});
