const express = require("express");
const env = require("./config/env");
const logger = require("./config/logger.js");
const ENV = require("./config/env.js");
const { requestLogger } = require("./middlewares/logger.js");
const bodyParser = require("body-parser");
const HandleErrors = require("./middlewares/error.js");

class App {
  constructor() {
    this.app = express();
    this.env = env;
    this.port = process.env.PORT ?? 8080;
    this.initializeMiddlewares();
  }

  initDB() {}

  
  initializeMiddlewares() {
    // initialize server middlewares
    this.app.use(requestLogger);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  };

  listen() {
    this.initDB();
    this.app.listen(this.port, () => {
      logger.info("Server started at http://localhost:" + this.port);
    });
  }

  initializedRoutes(routes) {
    routes.forEach((route) => {
      this.app.use("/api", route.router);
    });

    this.app.all("*", (req, res) => {
      return res.status(404).json({
        errorStatus: true,
        code: "--route/route-not-found",
        message: "The requested route was not found.",
      });
    });
    this.app.use(HandleErrors);
  }
}

module.exports = App;
