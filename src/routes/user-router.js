const express = require("express");
const user = require("../models/user");
const userRouter = express.Router();
const { userAuthMiddleware } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const SAFE_DATA = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "profilePicture",
  "bio",
  "skills",
  "location",
]; // Can also be written as a string "firstName lastName age gender profilePicture bio skills location"

// api to get all connection requests with status as interested
userRouter.get(
  "/user/getInterestedConectionRequests",
  userAuthMiddleware,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const allRequests = await ConnectionRequest.find({
        status: "interested",
        receiverId: loggedInUserId,
      }).populate("senderId", SAFE_DATA);
      if (!allRequests) {
        return res.status(404).send("No connection requests found");
      }
      const allRequestsData = allRequests.map((request) => {
        request.receiverId;
      });
      res.status(200).json({
        message: `All connections of ${req.user.firstName} ${req.user.lastName}`,
        allRequestsData,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

// api to view details about the connected users
userRouter.get(
  "/user/viewConnectionDetails",
  userAuthMiddleware,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const allRequests = await ConnectionRequest.find({
        $or: [
          { senderId: loggedInUserId, status: "accepted" },
          { receiverId: loggedInUserId, status: "accepted" },
        ],
      })
        .populate("senderId", SAFE_DATA)
        .populate("receiverId", SAFE_DATA);

      if (!allRequests || allRequests.length === 0) {
        return res.status(404).send("No connection requests found");
      }
      const filterAllRequests = allRequests.map((request) => {
        if (request.senderId._id.toString() === loggedInUserId.toString()) {
          return request.receiverId;
        }
        return request.senderId;
      });

      res.status(200).json({
        message: `All connections of ${req.user.firstName} ${req.user.lastName}`,
        connections: filterAllRequests,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

//api to show all users in feed except connection requests and logged in user
userRouter.get("/user/feed", userAuthMiddleware, async (req, res) => {
  try {
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit = limit > 50 ? 50 : limit; // limit the number of users to 50
    const skip = (page - 1) * limit;
    const loggedInUserId = req.user._id;
    const hideenUsersFromFeed = await connectionRequest.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });
    const uniqueIds = new set();
    hideenUsersFromFeed.forEach((user) => {
      uniqueIds.add(user.senderId.toString());
      uniqueIds.add(user.receiverId.toString());
    });
    uniqueIds.add(loggedInUserId.toString()); // add logged in user id to the set
    const allusersOnFeed = await user
      .find({
        _id: { $nin: Array.from(uniqueIds) }
      })
      .select(SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      allusersOnFeed,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = userRouter;
