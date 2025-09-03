require("dotenv").config();
const ErrorCodes = require("../middleWare/ErrorCodes");
const { userConnect, userAccountModel } = require("../model/User");
const JWT = require('jsonwebtoken');

async function userAccountMiddleWare(request, response, next) {
  const {
    accountNumber,
    ifscCode,
    accountType,
    balance,
    currency,
    userId,
    branch,
  } = request.body;

  try {
    const requiredField = [
      "accountNumber",
      "ifscCode",
      "accountType",
      "balance",
      "currency",
      "userId",
      "branch",
    ];

    for (let field of requiredField) {
      if (
        !(field in request.body) ||
        request.body[field] === "" ||
        request.body[field] == null
      ) {
        return response.status(ErrorCodes.Bad_Request).json({
          success: false,
          message: `Field ${field} is missing or empty`,
        });
      }
    }

    const validateAccountNumber = /^\d{16,20}$/;
    if (!validateAccountNumber.test(accountNumber)) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        message: "Invalid Account Number",
      });
    }

    const validateIfscCode = /^[A-Z]{4}0[0-9]{6}$/;
    if (!validateIfscCode.test(ifscCode)) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        message: "Invalid IFSC Code",
      });
    }

    const allowedType = ["savings", "current"];
    if (!allowedType.includes(accountType.toLowerCase())) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        message: "Account type must be 'savings' or 'current'",
      });
    }

    const existingAccount = await userAccountModel.findOne({ accountNumber });
    if (existingAccount) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        message: "Account Already Exist",
      });
    }

    const existedUser = await userConnect.findById(userId);
    if (!existedUser) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

async function UserAuth(request, response, next) {
  let AccessHeader = request.headers["authorization"];

  if (!AccessHeader || !AccessHeader.startsWith("Bearer")) {
    return response.status(401).json({ message: `No Token Provided` });
  }

  const accessToken = AccessHeader.split(" ")[1];

  try {
    const decrypted = JWT.verify(accessToken, process.env.ACCESS_SECRET_TOKEN);

     if (!decrypted || !decrypted.id) {
      return response.status(401).json({ message: "Invalid Token" });
    }

    request.user = decrypted;
    next();
  } catch (error) {
    return next(error);
  }
}

module.exports = { userAccountMiddleWare, UserAuth };
