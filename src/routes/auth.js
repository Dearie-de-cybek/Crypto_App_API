const express = require("express");
const AuthController = require("../controllers/auth");
const useCatchErrors = require("../error/catchErrors");
const UserController = require("../controllers/user");

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
      useCatchErrors(this.authController.userSignup.bind(this.authController))
    );

    this.router.post(
      `${this.path}/login`,
      useCatchErrors(this.authController.login.bind(this.authController))
    );
  }
}

module.exports = AuthRoute;
