const Express = require("express");
const { default: mongoose } = require("mongoose");

const userCreationSchema = mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
      maxlength: 50,
    },
    LastName: {
      type: String,
      maxlength: 50,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
      select: false, 
    },
    PhoneNumber: {
      type: String,
      required: true,
      unique: true,
      maxlength: 15,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    DOB: {
      type: Date,
      required: true,
    },
    Address: {
      type: String,
      required: true,
      maxlength: 255,
    },
    State: {
      type: String,
      required: true,
    },
    PostalCode: {
      type: String,
    },
    Country: {
      type: String,
      default: "India",
    },
  },
  { timestamps: true }
);

const userConnect = mongoose.model("userConnect", userCreationSchema);

module.exports = { userConnect };
