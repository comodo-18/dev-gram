const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuthMiddleware } = require("../middlewares/auth");
const { validateProfileEditDetails } = require("../utils/validations");






profileRouter.get("/getAllProfiles", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).send();
    }
    res.status(200).send(users);
  } catch (error) {}
});

profileRouter.get("/getSingleProfile", userAuthMiddleware, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//update user details
profileRouter.patch("/profile/edit", userAuthMiddleware,async (req, res) => {
  try {
    validateProfileEditDetails(req);
    const userId = req.user.id;
    const updatedData = req.body;
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true, // By default, it is false. It will return the old data.
      runValidators: true, // By default, it is false. It will not run the validators on the updated data.
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    return res.status(404).send(error.message);
  }
});

// Delete a user from database
profileRouter.patch("/profile/updatePassword", userAuthMiddleware, async (req, res) => {
    try {
        const userDetails  = req.user;
        const {oldPassword, newPassword} = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).send("Please provide old and new password");
        }
        if (oldPassword === newPassword) {
            return res.status(400).send("New password must be different from old password");
        }
        const checkPassword = await userDetails.checkPassword(oldPassword);
        if (!checkPassword) {
            return res.status(400).send("Old password is incorrect");
        }
        userDetails.password = newPassword;
        await userDetails.save();
        res.status(200).send("Password updated successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
})
profileRouter.delete("/profile", userAuthMiddleware,  async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error("User not found");
    }
    res.send("User deleted successfully");
  } catch (error) {
    res.status(401).send(error.message);
  }
});

module.exports = profileRouter;