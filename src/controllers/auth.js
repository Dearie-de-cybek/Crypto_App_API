const prisma = require("../config/prisma");
const {
  passwordManager,
  JwtTokenManager,
  genRandomIntId,
} = require("../helper");
const {
  UserSignupSchema,
  LoginSchema,
  passwordResetSchema,
} = require("../helper/validate");
const BaseController = require("./base");

class AuthController extends BaseController {
  constructor() {
    super();
  }

  async userSignup(req, res) {
    const payload = req.body;
    const { error } = UserSignupSchema.validate(payload);
    if (error) {
      return this.error(res, error.message, 400);
    }

    const { email, password, security_pin } = payload;

    // check if user exists of not
    const userExists = await prisma.user.findMany({ where: { email } });

    if (userExists.length > 0) {
      return this.error(res, "user with this email already exists.", 400);
    }

    const profilePic = `https://api.dicebear.com/7.x/micah/svg?seed=${email}`;
    const pwdHash = passwordManager.hash(password);
    

    const createUser = prisma.user.create({
      data: {
        profile_pic: profilePic,
        security_pin,
        password_hash: pwdHash,
        email,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });



    

    await prisma.$transaction([
      createUser
    ]);

    this.success(res, "Successfully created user", 200);
  }

  async login(req, res) {
    const payload = req.body;
    const { error } = LoginSchema.validate(payload);
    if (error) {
      return this.error(res, error.message, 400);
    }

    const { email, password } = payload;

    // check if user exists of not
    const userExists = await prisma.user.findFirst({ where: { email } });

    if (userExists === null) {
      return this.error(res, "Account notfound.", 400);
    }

    // compare password
    if (
      passwordManager.comparePwd(password, userExists.password_hash) === false
    ) {
      this.error(res, "Credentials Missmatch", 400);
      return;
    }

    const { id } = userExists;

    const refreshToken = JwtTokenManager.genRefreshToken({
      user_id: id,
    });
    const accessToken = JwtTokenManager.genRefreshToken({
      user_id: id,
    });

    // update refresh token
    await prisma.user.update({
      where: { id },
      data: {
        refresh_token: refreshToken,
      },
    });

    // send response
    this.success(res, "Successfully logged in", 201, {
      access_token: accessToken,
      refresh_token: refreshToken,
      id,
      name: `${email}`,
    });
  }
}

module.exports = AuthController;
