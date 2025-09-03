const Express = require("express");

const UserAccountRouter = Express.Router();

const { userAccount, getUserAccounts } = require("../controller/Account");

const {
  userAccountMiddleWare,
  UserAuth,
} = require("../middleWare/userAccountMiddleWare");

// Routes

// # User Register
UserAccountRouter.route("/AccountCreation").post(
  userAccountMiddleWare,
  userAccount
);

// # User Profile
UserAccountRouter.route("/Accounts").get(UserAuth, getUserAccounts);

module.exports = { UserAccountRouter };
