require("dotenv").config();
const ErrorCodes = require("../middleWare/ErrorCodes");
const { userConnect } = require("../model/User");
const hashing = require("bcrypt");
const JWT = require("jsonwebtoken");
const refreshTokens = require("../tokenStore");

async function userRegister(request, response) {
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
    const CyrptedPassword = await hashing.hash(Password, 10);

    const user = await userConnect.create({
      FirstName,
      LastName,
      Email,
      Password: CyrptedPassword,
      PhoneNumber,
      isPhoneVerified,
      DOB,
      Address,
      State,
      PostalCode,
      Country,
    });

    const Created_User = {
      firstName: user.FirstName,
      lastName: user.LastName,
      email: user.Email,
      phoneNumber: user.PhoneNumber,
      isphoneverified: user.isPhoneVerified,
      dob: user.DOB,
      address: user.Address,
      state: user.State,
      postalCode: user.PostalCode,
      country: user.Country,
      createdAt: user.createdAt,
    };

    if (user) {
      return response
        .status(201)
        .json({ success: true, Created_User: Created_User });
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
  const { email, password } = request.body;
  let Email = email;
  let Password = password;

  try {
    const ExistedUser = await userConnect
      .findOne({ Email })
      .select("+Password");

    if (!ExistedUser) {
      return response.status(ErrorCodes.Bad_Request).json({
        success: false,
        message: "User not found. Please register first.",
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
        email: ExistedUser.Email,
        firstName: ExistedUser.FirstName,
        lastName: ExistedUser.LastName,
        id: ExistedUser._id.toString(),
      },
      process.env.ACCESS_SECRET_TOKEN,
      { expiresIn: "15m" }
    );

    const refreshToken = JWT.sign(
      { id: ExistedUser._id.toString() },
      process.env.REFRESH_SECRET_TOKEN,
      { expiresIn: "7d" }
    );

    refreshTokens.add(refreshToken);

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response.status(200).json({
      success: true,
      message: "Login successful.",
      accessToken,
      refreshToken,
      user: {
        firstName: ExistedUser.FirstName,
        lastName: ExistedUser.LastName,
        email: ExistedUser.Email,
        phoneNumber: ExistedUser.PhoneNumber,
        dob: ExistedUser.DOB,
        address: ExistedUser.Address,
        state: ExistedUser.State,
        postalCode: ExistedUser.PostalCode,
        country: ExistedUser.Country,
        createdAt: ExistedUser.createdAt,
      },
    });
  } catch (error) {
    return response
      .status(ErrorCodes.Bad_Request)
      .json({ error: error.message });
  }
}

async function refreshTokenHandler(request, response) {
  try {
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      return response
        .status(ErrorCodes.Unauthorized)
        .json({ message: "Refresh token required" });
    }


    if (!refreshTokens.has(refreshToken)) {
      return response
        .status(ErrorCodes.Forbidden)
        .json({ message: "Refresh token not found in valid tokens" });
    }

    let decoded;
    try {
      decoded = JWT.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN);
    } catch (verifyError) {
      refreshTokens.delete(refreshToken);
      return response.status(ErrorCodes.Forbidden).json({
        message: "Invalid token signature",
        error: verifyError.message,
      });
    }

    // 4. User verification
    const user = await userConnect.findById(decoded.id);
    if (!user) {
      console.log("User not found for token");
      refreshTokens.delete(refreshToken);
      return response
        .status(ErrorCodes.Unauthorized)
        .json({ message: "User not found" });
    }

    // 5. Generate new access token
    const newAccessToken = JWT.sign(
      {
        id: user._id,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
      },
      process.env.ACCESS_SECRET_TOKEN,
      { expiresIn: "5m" }
    );

    return response.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    return response.status(ErrorCodes.Server_Error).json({
      message: "Internal server error during token refresh",
      error: err.message,
    });
  }
}

async function userLogout(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }

  res.clearCookie("refreshToken");
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

async function userProfile(request, response) {
  const User = await userConnect.findById(request.User.id);
  return response.status(200).json({ success: true, profile: User });
}

module.exports = {
  userRegister,
  userLogin,
  userProfile,
  refreshTokenHandler,
  userLogout,
};
