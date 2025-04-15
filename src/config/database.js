const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://jontyrhodes24:bN03kkgKQpogQsh7@devgram.bgizt.mongodb.net/Devgram"
  );
};

module.exports = connectDB;
