const App = require("./app");
const UserRoute = require("./routes/user");
const AuthRoute = require("./routes/auth");


const server = new App();
server.initializedRoutes([
  new UserRoute(),
  new AuthRoute(),
]);
server.listen();
