const Express = require("express");
const { default: mongoose } = require("mongoose");

const userCreationSchema = mongoose.Schema(
  {
    Name: {
      type: String,
      required: [true],
    },
    Email: {
      type: String,
      required: [true],
      unique: true,
    },
    Password: {
      type: String,
      required: [true],
      select: false,
    },
  },
  { timestamps: true }
);

const userConnect = mongoose.model("userConnect", userCreationSchema);

module.exports = { userConnect };
