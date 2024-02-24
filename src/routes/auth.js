const express = require("express");
const AuthController = require("../controller/auth");
const useCatchErrors = require("../error/catchErrors");
const UserController = require("../controllers/user");
const { verifyOTP } = require("../middlewares/auth");

class AuthRoute {
  router = express.Router();
  authController = new AuthController();
  userController = new UserController();

  path = "/auth";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
        `${this.path}/invite`,
        useCatchErrors(
          this.userController.createUserInvite.bind(
            this.userController
          )
        )
      );
    // test endpoint
    this.router.post(
      `${this.path}/user/signup`,
      verifyOTP,
      useCatchErrors(this.authController.userSignup.bind(this.authController))
    );
  }
}

module.exports = AuthRoute;
