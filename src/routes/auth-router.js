const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignUpDetails } = require("../utils/validations");

// Signup route to create a new user
authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/login", async (req, res) => {
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

authRouter.post("/logout", async (req,res)=>{
  res.cookie("token", "", {
    maxAge: 0
  });
  res.status(200).send("Logout successful");
})

module.exports = authRouter;