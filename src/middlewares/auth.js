// is authenticated
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const logger = require("../config/logger");
const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;




async function verifyOTP(req, res, next) {
  const payload = req.body;
  if (typeof payload?.otp_token === "undefined") {
    return res
      .status(404)
      .json({ message: "expected valid OTP code but got none." });
  }

  const OTP = payload.otp_token;

  // check if otp exists
  try {
    const otpExists = await prisma.organizationInvite.findFirst({
      where: { token: String(OTP) },
    });

    if (otpExists === null) {
      return res.status(404).json({ message: "Invalid OTP code." });
    }

    req.user = { id: otpExists?.id };
    next();
  } catch (e) {
    logger.error(`Invalid OTP code: ${e.message}`);
    res.status(500).json({ message: "Something went wrong verifying OTP" });
  }
}

module.exports = {
  verifyOTP,
};
