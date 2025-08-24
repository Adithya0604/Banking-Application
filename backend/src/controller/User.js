require("dotenv").config();
const ErrorCodes = require("../middleWare/ErrorCodes");
const { userConnect } = require("../model/User");
const hashing = require("bcrypt");
const JWT = require("jsonwebtoken");

async function userRegister(request, response) {
  const { Name, Email, Password } = request.body;
  try {
    const CyrptedPassword = await hashing.hash(Password, 10);

    const user = await userConnect.create({
      Name,
      Email,
      Password: CyrptedPassword,
    });

    if (user) {
      return response
        .status(200)
        .json({ success: true, Created_User: { Name, Email } });
    } else {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        Created_User: "Unable to create the user. Please try again.",
      });
    }
  } catch (error) {
    return response.status(ErrorCodes.Server_Error).json({
      Message:
        "There seems to be an internet connectivity issue. Please check your connection.",
    });
  }
}

async function userLogin(request, response) {
  const { Email, Password } = request.body;

  try {
    const ExistedUser = await userConnect
      .findOne({ Email })
      .select("+Password");

    if (!ExistedUser) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        ExistedUser:
          "User already exists. Please register with a different email.",
      });
    }
    const isValidPassword = await hashing.compare(
      Password,
      ExistedUser.Password
    );
    if (!isValidPassword) {
      return response.status(ErrorCodes.Unauthorized).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    const accessToken = JWT.sign(
      {
        Name: ExistedUser.Name,
        Email: ExistedUser.Email,
        id: ExistedUser.id,
      },
      process.env.ACCESS_SECRET_TOKEN,
      { expiresIn: "5m" }
    );

    return response.status(200).json({
      success: true,
      message: "Login successful.",
      token: accessToken,
    });
  } catch (error) {
    return response
      .status(ErrorCodes.Server_Error)
      .json({ error: error.message });
  }
}

async function userProfile(request, response) {
  const User = await userConnect.findById(request.User.id);
  return response.status(200).json({ success: true, profile: User });
}

module.exports = { userRegister, userLogin, userProfile };
