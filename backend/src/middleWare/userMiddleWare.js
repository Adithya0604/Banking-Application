const { decrypt } = require("dotenv");
const { userConnect } = require("../model/User");
const JWT = require("jsonwebtoken");
const ErrorCodes = require("./ErrorCodes");

async function userRegisterMiddleWare(request, response, next) {
  const {
    FirstName,
    Email,
    Password,
    PhoneNumber,
    DOB,
    Address,
    State,
    Country,
  } = request.body;

  try {
    const MissingFields = "Please ensure all required fields are filled.";

    if (
      !FirstName ||
      !Email ||
      !Password ||
      !PhoneNumber ||
      !DOB ||
      !Address ||
      !State
    ) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        MissingFields: MissingFields,
      });
    }

    // Simple email regex validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(Email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email." });
    }

    // Basic phone number validation (digits only here; you can extend)
    const phonePattern = /^\d{7,15}$/;
    if (!phonePattern.test(PhoneNumber)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid phone number." });
    }

    const ExistedUserEmail = await userConnect.findOne({ Email });

    if (ExistedUserEmail) {
      return response.status(ErrorCodes.Key_Duplicte).json({
        success: false,
        ExistedUser: "Email is already registered.",
      });
    }
    const ExistedUserPhone = await userConnect.findOne({ PhoneNumber });

    if (ExistedUserPhone) {
      return response.status(ErrorCodes.Key_Duplicte).json({
        success: false,
        ExistedUser: "Phone Number is  already registered.",
      });
    }

    next();
  } catch (error) {
    return next(error);
  }
}

async function userLoginMiddleWare(request, response, next) {
  const { Email, Password } = request.body;

  try {
    const MissingFields = "Please make sure all requirmed fileds are entered";

    if (!Password || !Email) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        MissingFields: MissingFields,
      });
    }

    next();
  } catch (error) {
    return next(error);
  }
}

async function userProfileMiddleWare(request, response, next) {
  let AccessHeader = request.headers["authorization"];

  if (!AccessHeader || !AccessHeader.startsWith("Bearer")) {
    return response.status(401).json({ message: `No Token Provided` });
  }

  const accessToken = AccessHeader.split(" ")[1];

  try {
    const decrypted = JWT.verify(accessToken, process.env.ACCESS_SECRET_TOKEN);
    request.User = decrypted;
    next();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  userRegisterMiddleWare,
  userLoginMiddleWare,
  userProfileMiddleWare,
};
