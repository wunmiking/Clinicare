import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/user.js";
import responseHandler from "../utils/responseHandler.js";
import mailService from "./email.service.js";
import { refreshTokenLimit } from "../middlewares/rateLimit.js";
import jwt from "jsonwebtoken";

const { errorResponse, notFoundResponse } = responseHandler;

const userService = {
  register: async (userData, next) => {
    // the next above will call the erroroResponse or notFoundResponse depending on what we specify
    // the below is to check if the email already exists
    const emailExists = await User.findOne({ email: userData.email });
    if (emailExists) {
      return next(errorResponse("Email already exists", 400));
    }
    // if it is a fresh userData email, then we proceed to creating our user
    // handle verificationCode to be sent to user email (we will use an inbuilt module from node to generate our code)
    const verificationCode = crypto.randomInt(100000, 999999).toString(); //this will generate six characters randomly
    const verificationCodeExpiry = new Date(Date.now() + 3600000); // function for 1 hour code expiry
    // the below handles password encryption, refer to npmjs documentation on bcryptjs
    const salt = await bcrypt.genSalt(10); //this determines the degree of encryption
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // proceed to creating our user - these below will be stored in our database
    const user = await User.create({
      ...userData,
      password: hashedPassword,
      verificationToken: verificationCode,
      verificationTokenExpiry: verificationCodeExpiry,
    });

    // we are going to use a process from node process.nextTick - this allows us to not block synchronous operations - the api response won't wait for the email to be sent , even if email fails it won't affect the creation of the user
    process.nextTick(() => {
      mailService.sendWelcomeMail(user).catch(console.error); //this will catch the email sending error
    });

    // if user could not be registered then we send a server error
    if (!user) {
      return next(errorResponse("User registration failed"));
    }
    return user; //send user to our controller
  },
  // this will login the user
  login: async (userData, next) => {
    // find user with email from the form
    const user = await User.findOne({ email: userData.email }).select(
      "+password"
    ); //select includes the field we want to have access to, in this case, the password
    if (!user) {
      return next(errorResponse("Account not found", 401));
    }
    // handle password
    const isPasswordCorrect = await bcrypt.compare(
      userData.password,
      user.password
    );
    // userData.password is from the form which will be checked against user.password which is the one saved about the user in the database
    if (!isPasswordCorrect) {
      return next(errorResponse("Incorrect email or password", 401));
    }
    return user;
  },
  authenticateUser: async (userId, next) => {
    // get userId from our jwt decoded token
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("User not found"));
    }
    return user;
  },
  // logoutUser: async (req, res, next) => {
  //   // reset the cookie maxAge value
  //   res.cookie("userRefreshToken", "", {
  //     maxAge: 0,
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //     sameSite: process.env.NODE_ENV === "production" ? "home" : "lax",
  //     path: "/",
  //   });
  //   return true;
  // },
  // get a new accessToken when current one expires
  refreshAccessToken: async (refreshToken, next) => {
    if (!refreshToken) {
      return next(errorResponse("Refresh token has expired", 401));
    }
    // verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return next(errorResponse("Refresh token is invalid", 401));
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(notFoundResponse("User account not found"));
    }
    return user;
  },
  verifyUserAccount: async (data, next) => {
    // destructure our data
    const { userId, verificationToken } = data;
    // find our user and get the verificationToken and verificationTokenExpiry attached/saved to this user
    const user = await User.findById(userId).select(
      "+verificationToken +verificationTokenExpiry"
    );
    if (!user) {
      return next(notFoundResponse("Account not found"));
    }
    // check if user is already verified
    if (user.isVerified) {
      return next(errorResponse("Account is already verified", 400));
    }
    // check if verificationToken saved matches the one received from the form
    if (user.verificationToken !== verificationToken) {
      return next(errorResponse("Invalid verification token", 400));
    }
    // check for token expiry
    if (user.verificationTokenExpiry < new Date()) {
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
      await user.save();
      return next(
        errorResponse(
          "Verification token has expired, please get a new token",
          400
        )
      );
    }
    // verify user if token has not expired
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();
    return user;
  },

  resendVerificationToken: async (userId, next) => {
    const user = await User.findById(userId).select(
      "+verificationToken +verificationTokenExpiry"
    );
    if (!user) {
      return next(notFoundResponse("Account not found"));
    }
    if (user.isVerified) {
      return next(notFoundResponse("Account already verified"));
    }
    const verificationCode = crypto.randomInt(10000, 999999).toString();
    const verificationCodeExpiry = new Date(Date.now() + 3600000); //1 hour
    user.verificationToken = verificationCode;
    user.verificationTokenExpiry = verificationCodeExpiry;
    await user.save();
    process.nextTick(() => {
      mailService.sendVerificationCode(user).catch(async (error) => {
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();
        console.error("Failed to send verification token", error);
      });
    });
    return user;
  },
  forgotPassword: async (userData, next) => {
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      return next(notFoundResponse("Account not found"));
    }
    // generate reset code
    const resetCode = crypto.randomInt(100000, 999999).toString();
    const resetCodeExpiry = new Date(Date.now() + 900000); //15 minutes
    user.passwordResetToken = resetCode;
    user.passwordResetTokenExpiry = resetCodeExpiry;
    await user.save();
    process.nextTick(() => {
      mailService.sendPasswordResetEmail(user).catch(async (error) => {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiry = undefined;
        await user.save();
        console.error("Failed to send password token", error);
      });
    });
    return user;
  },
  // generate new password
  resetPassword: async (userData, next) => {
    const { email, password, confirmPassword, passwordResetToken } = userData;
    if (password !== confirmPassword) {
      return next(errorResponse("Passwords do not match", 400));
    }
    const user = await User.findOne({ email }).select(
      "+password +passwordResetToken +passwordResetTokenExpiry"
    );
    if (!user) {
      return next(notFoundResponse("Account not found with that email"));
    }
    if (
      !user.passwordResetToken ||
      user.passwordResetToken !== passwordResetToken
    ) {
      return next(errorResponse("Password reset token not found", 400));
    }
    const isPasswordSame = await bcrypt.compare(password, user.password);
    if (isPasswordSame) {
      return next(
        errorResponse("New password must be different from old password", 400)
      );
    }
    if (user.passwordResetTokenExpiry < new Date()) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiry = undefined;
      await user.save();
      return next(errorResponse("Password reset token has expired", 400));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    await user.save();
    return user;
  },
  logout: async (req, res, next) => {
    res.cookie("userRefreshToken", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/api/v1/auth/refresh-token",
    });
    return true;
  },
};

export default userService;
