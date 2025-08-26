const Express = require("express");

const UserRouter = Express.Router();

const {
  userRegister,
  userLogin,
  userProfile,
  refreshTokenHandler,
  userLogout,
} = require("../controller/User");

const {
  userRegisterMiddleWare,
  userLoginMiddleWare,
  userProfileMiddleWare,
} = require("../middleWare/userMiddleWare");

// Routes
// # User Register
UserRouter.route("/register").post(userRegisterMiddleWare, userRegister);

// # User Login
UserRouter.route("/login").post(userLoginMiddleWare, userLogin);

UserRouter.route("/refreshToken").post(refreshTokenHandler);

UserRouter.route("/logout").post(userLogout);

// # User Profile
UserRouter.route("/Profile").get(userProfileMiddleWare, userProfile);

module.exports = { UserRouter };
