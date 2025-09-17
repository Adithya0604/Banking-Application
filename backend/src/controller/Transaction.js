require("dotenv").config();
const mongoose = require("mongoose");
const ErrorCodes = require("../middleWare/ErrorCodes");
const {
  userConnect,
  userAccountModel,
  userTransactionModel,
} = require("../model/User");

async function TransactionController(request, response) {
  const {
    accountNumberFrom,
    accountNumberTo,
    amount,
    narration,
    ifscCode: receiverIFSC,
  } = request.body;

  await mongoose.connect(process.env.CONNECTION_URL);
  const session = await mongoose.startSession();
  session.startTransaction();

  let txnId = new mongoose.Types.ObjectId();

  try {
    // 1. Validate transfer amount
    if (amount <= 0)
      throw new Error("To transfer, we need a valid positive amount.");

    // 2. Sender account
    const fromAccount = await userAccountModel
      .findOne({ accountNumber: accountNumberFrom, userId: request.user.id })
      .session(session);

    if (!fromAccount)
      throw new Error("Not authorized to transfer from this account.");
    if (fromAccount.balance < amount) throw new Error("Insufficient balance.");

    // 3. Receiver account
    const toAccount = await userAccountModel
      .findOne({ accountNumber: accountNumberTo })
      .session(session);

    if (!toAccount) throw new Error("Receiver account does not exist.");

    // 4. Update balances
    const balanceBefore = fromAccount.balance;
    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await fromAccount.save({ session });
    await toAccount.save({ session });

    // 5. Create success transaction
    const txn = new userTransactionModel({
      _id: txnId,
      transferType: "transfer",
      accountFrom: fromAccount._id,
      accountTo: toAccount._id,
      accountNumberFrom: fromAccount.accountNumber,
      accountNumberTo: toAccount.accountNumber,
      amount,
      currency: fromAccount.currency,
      status: "Success",
      failureReason: null,
      userId: request.user.id,
      balanceBefore,
      balanceAfter: fromAccount.balance,
      narration: narration || "",
      relatedTranactionId: txnId, // self-reference
    });

    await txn.save({ session });

    await session.commitTransaction();

    return response.json({
      success: true,
      transaction: txn,
      senderAccount: {
        accountNumber: fromAccount.accountNumber,
        balance: fromAccount.balance,
      },
      receiverAccount: {
        accountNumber: toAccount.accountNumber,
        balance: toAccount.balance,
        ifscCode: receiverIFSC,
      },
    });
  } catch (error) {
    let failedTxn;
    try {
      failedTxn = new userTransactionModel({
        _id: txnId,
        transferType: "transfer",
        accountFrom: null,
        accountTo: null,
        accountNumberFrom,
        accountNumberTo,
        amount,
        currency: "INR",
        status: "Failed",
        failureReason: error.message,
        userId: request.user.id,
        balanceBefore: 0,
        balanceAfter: 0,
        narration: narration ? narration.trim() : "Not Mentioned",
        relatedTranactionId: txnId,
      });

      await failedTxn.save({ session });
    } catch (innerError) {
      console.error("Failed to log transaction error:", innerError);
    }

    await session.abortTransaction();

    return response.status(ErrorCodes.Bad_Request).json({
      success: false,
      message: error.message,
      transactionId: txnId,
    });
  } finally {
    session.endSession();
  }
}

async function ViewTransactionController(request, response) {
  try {
    const userId = request.user.id;

    const latestTransaction = await userTransactionModel
      .find({
        userId: userId,
      })
      .sort({ createdAt: 1 });

    if (!latestTransaction || latestTransaction.length === 0) {
      return response
        .status(ErrorCodes.Not_Found)
        .json({ success: false, message: "No transactions found." });
    }

    const Result = latestTransaction.map((txn, index) => ({
      Id: index + 1,
      Sender_Number: txn.accountNumberFrom,
      Reciver_Number: txn.accountNumberTo,
      Amount: txn.amount,
      Transaction_Status: txn.status,
    }));

    return response.json({ success: true, transaction: Result });
  } catch (error) {
    return response
      .status(ErrorCodes.Server_Error)
      .json({ success: false, message: "Server error", error });
  }
}

// async function TransactionController(request, response) {
//   const {
//     accountFrom,
//     accountTo: receiverAccountNumber,
//     amount,
//     narration,
//     ifscCode: receiverIFSC,
//   } = request.body;
//   const userId = request.user.id;
//   const session = await mongoose.startSession();

//   try {
//     let fromAccount, toAccount, txn;
//     await session.withTransaction(async () => {
//       // 1. Fetch sender's account
//       fromAccount = await userAccountModel.findOne({
//         accountNumber: accountFrom,
//         userId
//       }).session(session);

//       if (!fromAccount) {
//         throw { code: 403, message: "Not authorized to transfer from this account" };
//       }
//       if (fromAccount.balance < amount) {
//         throw { code: 400, message: "Insufficient balance" };
//       }

//       // 2. Fetch receiver's account
//       toAccount = await userAccountModel.findOne({
//         accountNumber: receiverAccountNumber,
//       }).session(session);

//       if (!toAccount) {
//         throw { code: 400, message: "Receiver account does not exist" };
//       }

//       // 3. Deduct sender
//       const balanceBefore = fromAccount.balance;
//       fromAccount.balance -= amount;
//       await fromAccount.save({ session });

//       // 4. Credit receiver
//       toAccount.balance += amount;
//       await toAccount.save({ session });

//       // 5. Create transaction record
//       txn = new Transaction({
//         transferType: "transfer",
//         accountFrom: fromAccount.accountNumber,
//         accountTo: receiverAccountNumber,
//         amount,
//         currency: fromAccount.currency,
//         status: "Success",
//         userId: userId,
//         balanceBefore: balanceBefore,
//         balanceAfter: fromAccount.balance,
//         receiverIFSC: receiverIFSC,
//         narration: narration || "",
//         failureReason: null,
//         relatedTranactionId: uuidv4(),
//       });

//       await txn.save({ session });

//       // Attach result for final response after commit
//       request.result = {
//         success: true,
//         transaction: txn,
//         senderAccount: {
//           accountNumber: fromAccount.accountNumber,
//           balance: fromAccount.balance,
//         },
//         receiverAccount: {
//           accountNumber: toAccount.accountNumber,
//           balance: toAccount.balance,
//         },
//       };
//     });

//     // Only respond after transaction commit
//     return response.json(request.result);

//   } catch (error) {
//     if (session.inTransaction()) {
//       await session.abortTransaction();
//     }
//     return response.status(error.code || 500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   } finally {
//     await session.endSession();
//   }
// }

// async function TransactionController(request, response) {
//   const {
//     accountNumberFrom,
//     accountNumberTo: receiverAccountNumber,
//     amount,
//     narration,
//     ifscCode: receiverIFSC,
//   } = request.body;

//   console.log("=== Entered TransactionController ===", request.body);

//   const session = await mongoose.startSession();
//   session.startTransaction();
//   console.log("done1");

//   try {
//     // req.user.id (auth id) = existence of the user (from users collection).
//     // _id (accountFrom) = the actual bank account in userAccounts.
//     console.log("started");

//     const fromAccount = await userAccountModel
//       .findOne({
//         accountNumber: accountNumberFrom,
//         userId: request.user.id,
//       })
//       .session(session);
//     console.log("in here 2");

//     if (!fromAccount) {
//       await session.abortTransaction();
//       session.endSession();
//       return response.status(ErrorCodes.Forbidden).json({
//         success: false,
//         message: "Not authorized to transfer from this account",
//       });
//     }
//     console.log("done11");
//     if (fromAccount.balance < amount) {
//       await session.abortTransaction();
//       session.endSession();
//       return response
//         .status(ErrorCodes.Bad_Request)
//         .json({ success: false, message: "Insufficient balance" });
//     }

//     console.log("done111");
//     const balancebefore = fromAccount.balance;
//     fromAccount.balance -= amount;
//     await fromAccount.save({ session });
//     const balanceAfter = fromAccount.balance;

//     console.log("done1111");
//     const txn = new Transaction({
//       transferType: "transfer",
//       accountFrom: fromAccount._id,
//       accountNumberFrom: fromAccount.accountNumberFrom,
//       accountNumberTo: receiverAccountNumber.accountNumberTo,
//       amount,
//       currency: fromAccount.currency,
//       status: "Success",
//       userId: request.user.id,
//       balanceBefore: balancebefore,
//       balanceAfter: balanceAfter,
//       receiverIFSC: receiverIFSC,
//       narration: narration || "",
//       failureReason: null,
//       relatedTranactionId: uuidv4(),
//     });

//     await txn.save({ session });

//     await session.commitTransaction();
//     session.endSession();
//     console.log("done2");

//     return response.json({
//       success: true,
//       transaction: txn,
//       senderAccount: {
//         accountNumber: fromAccount.accountNumber,
//         balance: fromAccount.balance,
//       },
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Transfer error:", error);
//     return response
//       .status(ErrorCodes.Server_Error)
//       .json({ success: false, message: "Internal server error" });
//   }
// }

module.exports = { TransactionController, ViewTransactionController };
