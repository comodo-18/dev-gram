const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpDetails } = require("./utils/validations");
const { userAuthMiddleware } = require("./middlewares/auth");
const bcrpypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const PORT = 7777;

app.use(express.json());
app.use(cookieParser());

// Signup route to create a new user
app.post("/signup", async (req, res) => {
  try {
    validateSignUpDetails(req);
    const userDetails = new User({
      ...req.body
    });
    await userDetails.save();
    res.status(201).send(userDetails);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//Login api
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDetails = await User.findOne({ email });
    if (!userDetails) {
      throw new Error("Invalid email or password");
    }
    const isMatch = await userDetails.checkPassword(password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    } else {
       const token = await userDetails.getJwtToken();
       res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
    }
    res.status(200).send(userDetails);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// Get all users from database
app.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).send();
    }
    res.status(200).send(users);
  } catch (error) {}
});

app.get("/profile", userAuthMiddleware, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//update user details
app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedData = req.body;
    const allowedFiledsToBeUpdate = [
      "age",
      "gender",
      "profilePicture",
      "bio",
      "skills",
      "location",
    ];
    const isValidOperation = Object.keys(updatedData).every((update) => {
      return allowedFiledsToBeUpdate.includes(update);
    });
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }
    if (updatedData["age"] && updatedData["age"] < 18) {
      return res.status(400).send({ error: "Age must be at least 18" });
    }
    if (updatedData["skills"]?.length > 10) {
      return res.status(400).send({ error: "Skills must be less than 10" });
    }
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true, // By default, it is false. It will return the old data.
      runValidators: true, // By default, it is false. It will not run the validators on the updated data.
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    return res.status(404).send();
  }
});

// Delete a user from database
app.delete("/user/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).send();
    }
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

connectDB()
  .then(() => {
    console.log("MongoDB connected...");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
app.get("/", (req, res) => {
  res.send("Hello, World! Hey jude");
});
