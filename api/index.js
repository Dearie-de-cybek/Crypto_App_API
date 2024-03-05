// index.js
const App = require('../src/app');
const UserRoute = require('../src/routes/user');
const AuthRoute = require('../src/routes/auth');

const server = new App();
server.initializedRoutes([
  new UserRoute(),
  new AuthRoute(),
]); 

// Export the Express app for Vercel
module.exports = server.app;
