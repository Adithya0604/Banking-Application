const { decrypt } = require("dotenv");
const { userConnect } = require("../model/User");
const JWT = require("jsonwebtoken");
const ErrorCodes = require("./ErrorCodes");

async function userRegisterMiddleWareEmail(request, response, next) {
  const { Email } = request.body;

  try {
    const list = ["gmail", "hotmail", "yahoo", "email"];
    const Server = "Please enter your email first.";

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!Email || !pattern.test(Email)) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        EnterFirst: Server,
      });
    }

    next();
  } catch (error) {
    return next(error);
  }
}

async function userRegisterMiddleWare(request, response, next) {
  const { Name, Email, Password } = request.body;

  try {
    const MissingFields = "Please ensure all required fields are filled.";

    if (!Password || !Name) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        MissingFields: MissingFields,
      });
    }
    const ExistedUser = await userConnect.findOne({ Email });

    if (ExistedUser) {
      return response.status(ErrorCodes.Key_Duplicte).json({
        success: false,
        ExistedUser: "You are already registered.",
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
    const MissingFields = `Please make sure all requirmed fileds are entered`;

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
  userRegisterMiddleWareEmail,
  userLoginMiddleWare,
  userProfileMiddleWare,
};