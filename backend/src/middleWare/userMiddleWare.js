const { userConnect } = require("../model/User");
const JWT = require("jsonwebtoken");
const ErrorCodes = require("./ErrorCodes");

async function userRegisterMiddleWare(request, response, next) {
  const {
    FirstName,
    LastName,
    Email,
    Password,
    PhoneNumber,
    isPhoneVerified,
    DOB,
    Address,
    State,
    PostalCode,
    Country,
  } = request.body;

  try {
    function ValidateMissingFields(requiredFields, data) {
      for (let field of requiredFields) {
        if (!(field in data)) {
          console.log("❌ Missing field:", field);
          return `Field ${field} is Missing`;
        } else if (
          data[field] === null ||
          data[field] === undefined ||
          (typeof data[field] === "string" && data[field].trim() === "")
        ) {
          console.log("❌ Empty data for:", field);
          return `Data of ${field} is Missing.`;
        }
      }
      return null;
    }

    const MissingFields = [
      "FirstName",
      "LastName",
      "Email",
      "Password",
      "PhoneNumber",
      "DOB",
      "Address",
      "State",
      "PostalCode",
      "Country",
    ];

    const AllFields = ValidateMissingFields(MissingFields, request.body);

    console.log("👉 Validation result:", AllFields);

    if (AllFields) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        MissingFields: AllFields,
      });
    }

    // Simple email regex validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(Email)) {
      return response
        .status(400)
        .json({ success: false, message: `Invalid email.` });
    }

    // Basic phone number validation (digits only here; you can extend)
    const phonePattern = /^\d{7,15}$/;
    if (!phonePattern.test(PhoneNumber)) {
      return response
        .status(400)
        .json({ success: false, message: "Invalid phone number." });
    }

    const dobDate = new Date(DOB);
    if (isNaN(dobDate.getTime())) {
      return response.status(400).json({
        success: false,
        message: "Invalid date format for DOB. Use YYYY-MM-DD format",
      });
    }

    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(Password)) {
      return response.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and contain letters and numbers",
      });
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
  const { email, password } = request.body;
  let Email = email;
  let Password = password;
  console.log("preethi sharma");

  console.log(request.body);

  try {
    const MissingFields = "Please make sure all required fileds are entered";

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
