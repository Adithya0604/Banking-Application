const Express = require("express");

const AccountTranactionRouter = Express.Router();

const { UserAuth } = require("../middleWare/userAccountMiddleWare");

const { TransferMiddleWare } = require("../middleWare/userTransaction");

const { TransactionController } = require("../controller/Transaction");

// Routes

// # Transaction Deposit
AccountTranactionRouter.route("/Transaction/Transfer/").post(
  UserAuth,
  TransferMiddleWare,
  TransactionController
);

module.exports = { AccountTranactionRouter };
