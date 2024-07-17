const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username should be unique"],
      unique: [true, "Already exist"],
    },
    password: {
      type: String,
      required: [true, "Password mandatory"],
      unique: false,
    },
    email: {
      type: String,
      required: [true, "email should be unique"],
      unique: [true, "Already exist"],
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    address: {
      type: String,
    },
    profile: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
