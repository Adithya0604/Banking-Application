const Express = require("express");

const UserRouter = Express.Router();

const { userRegister, userLogin, userProfile } = require("../controller/User");

const {
  userRegisterMiddleWare,
  userLoginMiddleWare,
  userProfileMiddleWare,
  userRegisterMiddleWareEmail,
} = require("../middleWare/userMiddleWare");


// Routes
// # User Register
UserRouter.route("/register").post(
  userRegisterMiddleWareEmail,
  userRegisterMiddleWare,
  userRegister
);

// # User Login
UserRouter.route("/login").post(
  userRegisterMiddleWareEmail,
  userLoginMiddleWare,
  userLogin
);

// # User Profile
UserRouter.route("/Profile").get(userProfileMiddleWare, userProfile);

module.exports = { UserRouter };