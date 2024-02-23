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
    const { error } = UserSignupSchema.validate(payload);
    const payload = req.body;
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
    const user_id = genRandomIntId();

 
    const refreshToken = JwtTokenManager.genRefreshToken({
      user_id,
    });

    const createUser = prisma.user.create({
      data: {
        id: user_id,
        profile_pic: profilePic,
        pin: security_pin,
        password_hash: pwdHash,
        refresh_token: refreshToken,
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

//   async login(req, res) {
//     const payload = req.body;
//     const { error } = LoginSchema.validate(payload);
//     if (error) {
//       return this.error(res, error.message, 400);
//     }

//     const { email, password } = payload;

//     // check if user exists of not
//     const userExists = await prisma.user.findFirst({ where: { email } });

//     if (userExists === null) {
//       return this.error(res, "Account notfound.", 400);
//     }

//     // compare password
//     if (
//       passwordManager.comparePwd(password, userExists.password_hash) === false
//     ) {
//       this.error(res, "Credentials Missmatch", 400);
//       return;
//     }

//     const { id, org_id, first_name, last_name, is_admin } = userExists;

//     // resaon of generating this, is the auth_token would be used later when
//     // updating organization info
//     const refreshToken = JwtTokenManager.genRefreshToken({
//       user_id: id,
//       org_id,
//     });
//     const accessToken = JwtTokenManager.genRefreshToken({
//       user_id: id,
//       org_id,
//     });

//     // update refresh token
//     await prisma.user.update({
//       where: { id },
//       data: {
//         refresh_token: refreshToken,
//       },
//     });

//     // send response
//     this.success(res, "Successfully logged in", 201, {
//       access_token: accessToken,
//       refresh_token: refreshToken,
//       id,
//       name: `${first_name} ${last_name}`,
//       is_admin,
//     });
//   }
}

module.exports = AuthController;
