const mongoose = require("mongoose");
const { Schema } = mongoose;

const connecttionRequestSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: { 
        values: ["pass", "accepted", "rejected", "interested"],
        message: "{VALUE} is not a valid status"
     },
    },
  },
  { timestamps: true }
);

connecttionRequestSchema.pre("save", async function (next) {
  const connectionRequest = this;
  if (connectionRequest.isModified("status")) {
    if (!["pass", "accepted", "rejected","interested"].includes(connectionRequest.status)) {
      throw new Error("Invalid status value");
    }
  }
    if (connectionRequest.senderId === connectionRequest.receiverId) {
        throw new Error("Sender and receiver cannot be the same");
    }
  next();
});

module.exports = mongoose.model("ConnectionRequest", connecttionRequestSchema);
