const User = require("../models/user");

const jwt = require("jsonwebtoken");

const userAuthMiddleware = async (req,res,next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }
    const decodedData = await jwt.verify(token, "DEVgram#123");
    const { id } = decodedData;
    const userDetails = await User.findById(id);
    if (!userDetails) {
      throw new Error("User not found");
    }
    req.user = userDetails;
    next();
  } catch (error) {
    res.status(401).send({error: error.message});
  }
};

module.exports = { userAuthMiddleware };
