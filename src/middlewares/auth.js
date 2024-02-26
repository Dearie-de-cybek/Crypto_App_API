// is authenticated
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const logger = require("../config/logger");
const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;






module.exports = {
  
};
