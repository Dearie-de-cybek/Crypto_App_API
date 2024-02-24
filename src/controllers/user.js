const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const BaseController = require("./base");
const {
  userInvite,
  passwordResetSchema,
  ForgotPasswordSchema,
} = require("../helper/validate");
const sendEmail = require("../helper/sendMail");
const otpGenerator = require("otp-generator");
const { passwordManager } = require("../helper");

class UserController extends BaseController {
  constructor() {
    super();
  }

  async getUserProfile(req, res) {
    const { user_id } = req.user;

    const user = await prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      const errorData = {
        message: `User with id ${user_id} does not exist`,
      };
      this.error(res, "User Not Found", 404, errorData);
    } else {
      const userProfile = {
        data: {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phonenumber: user.phonenumber,
          profile_pic: user.profile_pic,
          lunch_credit_balance: user.lunch_credit_balance,
        },
      };
      this.success(res, "User data fetched successfully", 200, userProfile);
    }
  }

  
  


  async passwordReset(req, res) {
    const payload = req.body;

    const { error } = passwordResetSchema.validate(payload);
    if (error) {
      return this.error(res, error.message, 400);
    }

    const { new_password, otp_code } = payload;

    // verify otp_code
    const otpCodeInvite = await prisma.organizationInvite.findFirst({
      where: {
        token: otp_code,
        ttl: {
          gte: new Date(), // check if the expiration is Greater than or equal to current time
        },
      },
      select: { email: true, id: true },
    });

    if (!otpCodeInvite) {
      return this.error(res, "Invalid OTP code", 422);
    }

    const user = await prisma.user.findFirst({
      where: {
        AND: {
          email: otpCodeInvite.email,
          id: otpCodeInvite.id,
        },
      },
    });

    if (user === null) {
      return this.error(res, "Invalid OTP code, user don't exist", 422);
    }

    const hashedPasswword = passwordManager.hash(new_password);
    await prisma.user.update({
      where: { id: user.id },
      data: { password_hash: hashedPasswword },
    });
    // delete otp code
    await prisma.user.delete({
      where: {
        id: otpCodeInvite.id,
      },
    });

    this.success(res, "Password reset successfully", 200);
  }

  async forgotPassword(req, res) {
    const { error } = ForgotPasswordSchema.validate(req.body);
    if (error) {
      return this.error(res, error.message, 400);
    }

    const { email } = req.body;
    const user = await prisma.user.findFirst({ where: { email } });
    if (user === null) {
      return this.error(res, "User not found", 404);
    }

    // send password reset email
    const now = new Date();
    const fifteenMinutesLater = new Date(now.getTime() + 15 * 60 * 1000);
    const otpCode = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    const PasswordResetMail = `
    Password Reset - OTP Confirmation

    Dear ${user.email},

    You are receiving this email because a request to reset your password has been initiated. Please use the OTP (One-Time Password) below to confirm your password reset:

    <div style="background-color: #f0f0f0; padding: 15px; text-align: center; border-radius: 5px;">
        <h3>One-Time Password (OTP)</h3>
        <p style="font-size: 24px; font-weight: bold; color: #0070b7;">${otpCode}</p>
        <p style="font-size: 14px; color: #777;">This OTP is valid for the next 15 minutes. Please do not share it with anyone.</p>
    </div>

    If you didn't initiate this password reset request, please ignore this email. Your account remains secure.

    Note: This OTP is valid for 15 minutes only.
    `;

    await prisma.organizationInvite.create({
      data: {
        email,
        token: otpCode,
        ttl: fifteenMinutesLater,
        id: user?.id,
      },
    });

    await sendEmail({
      subject: "Password Reset",
      to: email,
      text: PasswordResetMail,
    });

    this.success(
      res,
      "Forgot password OTP sent",
      201,
      process.env.NODE_ENV !== "production" && otpCode
    );
  }

  async createUserInvite(req, res) {
    const { error } = userInvite.validate(req.body);

    if (error) {
      return this.error(res, error.message, 400);
    }
    const { email } = req.body;
    const { id } = req.user;

    const emailExists = await prisma.user.findFirst({
      where: { email },
    });
    if (emailExists !== null) {
      return this.error(res, "User already exists", 400);
    }
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    // check if token exists
    const otpExists = await prisma.user.findFirst({
      where: { email },
    });

    if (otpExists !== null) {
      // update otp
      await prisma.user.update({
        where: {
          id: otpExists?.id,
        },
        data: { token: otp, ttl: new Date() },
      });
    } else {
      // store token in database
      await prisma.organizationInvite.create({
        data: {
          id: genRandomIntId(),
          email,
          token: otp,
          ttl: new Date(),
          created_at: new Date(),
          id: id,
        },
      });
    }

    const subject = "Join Crypto App";
    const body = `
    <h1>OTP Code<h1/>
    
    <p>You've created an account </p>

    <p>Use the OTP below to verify the account:</p>
    <h1>${otp}</h1>.
    `;

    // Send email using helper function
    await sendEmail({ to: email, subject, text: body });
    return this.success(
      res,
      "success",
      200,
      process.env.NODE_ENV !== "production" && otp
    );
  }
}

module.exports = UserController;
