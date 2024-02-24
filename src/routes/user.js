const express = require("express");
const UserController = require("../controller/user");
const useCatchErrors = require("../error/catchErrors");
const { isAuthenticated } = require("../middlewares/auth");

class UserRoute {
  router = express.Router();
  userController = new UserController();
  path = "/user";

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // route for getting user profile information

    this.router.get(
      `${this.path}/profile`,
      isAuthenticated,
      useCatchErrors(
        this.userController.getUserProfile.bind(this.userController)
      )
    );

    

    this.router.post(
      `${this.path}/reset-password`,
      useCatchErrors(
        this.userController.passwordReset.bind(this.userController)
      )
    );

    this.router.post(
      `${this.path}/forgot-password`,
      useCatchErrors(
        this.userController.forgotPassword.bind(this.userController)
      )
    );
  }
}

module.exports = UserRoute;
