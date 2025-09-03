require("dotenv").config();
const ErrorCodes = require("../middleWare/ErrorCodes");
const { userAccountModel } = require("../model/User");

async function TransferMiddleWare(request, response, next) {
  const { accountNumberFrom, accountNumberTo, amount } = request.body;
  console.log("in here 1");

  try {
    console.log("in try");

    if (!accountNumberFrom || !accountNumberTo || !amount) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        Message: `Transaction Need Details. Please Enter Them...`,
      });
    }

    const fromAccount = await userAccountModel.findOne({ accountNumber: accountNumberFrom });
    if (!fromAccount) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        Message: `The Account ${accountFrom} Does Not exist...`,
      });
    }

    if (amount < 1) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        Message: `To Transfer we need money...`,
      });
    }

    console.log("in here 2");

    next();
    console.log("gone into the controller");
  } catch (error) {
    console.log("in except", error);

    next(error);
  }
}

module.exports = { TransferMiddleWare };

/**
----------------------------------
 * Transfer (between accounts): 
               {
                   "transferType": "transfer",
                   "accountFrom": "0987654...09876",
                   "accountTo": "12345678...1234",
                   "amount": 100,
                   "narration": "Rent payment"
                }
----------------------------------
 */
