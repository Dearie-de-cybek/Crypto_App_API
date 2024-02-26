const express = require("express");
const UserController = require("../controllers/user");
const useCatchErrors = require("../error/catchErrors");

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
