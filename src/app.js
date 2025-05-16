const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth-router");
const profileRouter = require("./routes/profile-router");
const connectionRequestRouter = require("./routes/connection-request-router");
const userRouter = require("./routes/user-router");
const cors = require("cors");
require('dotenv').config()
const PORT = process.env.PORT || 7777;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);

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
