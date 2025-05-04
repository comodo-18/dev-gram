const express = require("express");
const connectionRequestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { userAuthMiddleware } = require("../middlewares/auth");

connectionRequestRouter.post(
  "/connectionRequest/send/:status/:receiverId",
  userAuthMiddleware,
  async (req, res) => {
    try {
      const senderId = req.user.id;
      const receiverId = req.params.receiverId;
      const status = req.params.status;
      if (!senderId || !receiverId || !status) {
        return res
          .status(400)
          .send("Please provide senderId, receiverId and status");
      }
      const ALLOWED_STATUSES = ["pass", "interested"];
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).send("Invalid status value");
      }
      const receiverUser = await User.findById(receiverId);
      if (!receiverUser) {
        return res.status(404).send("user not found");
      }
      const isRequestAlreadySent = await ConnectionRequest.findOne({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });
      if (isRequestAlreadySent) {
        return res.status(400).send("Connection request already sent");
      }
      const connectionRequestData = await ConnectionRequest.create({
        senderId,
        receiverId,
        status,
      });
      res.status(200).send(connectionRequestData);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

connectionRequestRouter.post(
  "/connectionRequest/review/:status/:reviewId",
  userAuthMiddleware,
  async (req, res) => {
    try {
      const reviewId = req.params.reviewId;
      const userId = req.user.id;
      const status = req.params.status;
      const ALLOWED_STATUSES = ["accepted", "rejected"];
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).send("Invalid status value");
      }
      const data = await ConnectionRequest.findOne({
        _id: reviewId,
        receiverId: userId,
        status: "interested",
      });
      if (!data) {
        return res
          .status(404)
          .send("Connection request not found or already reviewed");
      }
      data.status = status;
      const updatedData = await data.save();
      res.status(200).json({ message: "Connection request " + status, updatedData });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

module.exports = connectionRequestRouter;