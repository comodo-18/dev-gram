const User = require("../models/user");

const jwt = require("jsonwebtoken");

const userAuthMiddleware = async (req,res,next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(401).send({error: "Authentication token not found"});
    }
    const decodedData = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { id } = decodedData;
    const userDetails = await User.findById(id);
    if (!userDetails) {
      throw new Error("User not found");
    }
    req.user = userDetails;
    next();
  } catch (error) {
    return res.status(401).send({error: error.message});
  }
};

module.exports = { userAuthMiddleware };
