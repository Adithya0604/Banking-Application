const { text } = require("body-parser");
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

const userConnect = mongoose.model("userConnect", userCreationSchema, "users");

const accountSchema = mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    ifscCode: {
      type: String,
      required: true,
      immutable: true,
    },
    accountType: {
      type: String,
      required: true,
      index: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userConnect",
      required: true,
      index: true,
      immutable: true,
    },
    branch: {
      type: String,
      required: true,
    },
    accountStatus: {
      type: String,
      enum: ["active", "Inactive", "closed"],
      default: "active",
      index: true,
    },
    lastTransactionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const userAccountModel = mongoose.model(
  "userAccountModel",
  accountSchema,
  "usersAccounts"
);

const accountTransactions = mongoose.Schema(
  {
    transferType: {
      type: String,
      enum: ["deposit", "withdrawal", "transfer"],
      required: true,
    },
    accountFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userAccountModel",
      default: null,
    },
    accountNumberFrom: { type: String },
    accountNumberTo: { type: String },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Success", "Pending", "Failure"],
      default: "Pending",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userConnect",
      required: true,
    },
    balanceBefore: {
      type: Number,
    },
    balanceAfter: {
      type: Number,
    },
    narration: {
      type: String,
    },
    failureReason: {
      type: String,
      default: null,
    },
    relatedTranactionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "userTransactionModel",
    },
  },
  { timestamps: true }
);

const userTransactionModel = mongoose.model(
  "userTransactionModel",
  accountTransactions,
  "usersTransactions"
);

accountTransactions.index({ userId: 1, createdAt: -1 });
accountTransactions.index({ accountTo: 1, createdAt: -1 });

module.exports = { userConnect, userAccountModel, userTransactionModel };
