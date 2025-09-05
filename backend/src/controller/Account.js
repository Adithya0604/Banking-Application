require("dotenv").config();
const ErrorCodes = require("../middleWare/ErrorCodes");
const { userConnect, userAccountModel } = require("../model/User");

async function userAccount(request, response) {
  const {
    accountNumber,
    ifscCode,
    accountType,
    balance,
    currency,
    userId,
    branch,
    accountStatus,
    lastTransactionDate,
  } = request.body;

  try {
    const AccountCreate = {
      accountNumber,
      ifscCode,
      accountType,
      balance: balance ?? 0,
      currency: currency ?? "INR",
      userId,
      branch: branch ?? "Main",
      accountStatus: accountStatus ?? "active",
      lastTransactionDate: lastTransactionDate ?? new Date(),
    };

    const newAccount = new userAccountModel(AccountCreate);
    await newAccount.save();

    const result = accountNumber.slice(-6).padStart(accountNumber.length, "X");

    const Created_Account = {
      accountNumber: result,
      accountType: newAccount.accountType,
      branch: newAccount.branch,
      balance: AccountCreate.balance,
      currency: AccountCreate.currency,
      accountStatus: AccountCreate.status,
    };

    return response.status(201).json({
      success: true,
      message: "Account created successfully",
      Created_Account: Created_Account,
    });
  } catch (error) {
    return response.status(ErrorCodes.Server_Error).json({
      success: false,
      message: "Server error",
    });
  }
}

async function getUserAccounts(request, response) {
  try {
    const user = await userConnect.findById(request.user.id);

    if (!user) {
      return response
        .status(ErrorCodes.Not_Found)
        .json({ success: false, message: "User not found" });
    }

    const accounts = await userAccountModel
      .find({ userId: request.user.id })
      .select("accountNumber accountType userId ifscCode balance currency accountStatus branch lastTransactionDate");

    return response.status(200).json({ success: true, accounts });
  } catch (error) {
    return response
      .status(ErrorCodes.Server_Error)
      .json({ success: false, message: "Server error", error: error.message });
  }
}

module.exports = { userAccount, getUserAccounts };
