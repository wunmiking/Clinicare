import userService from "../services/user.service.js";
import responseHandler from "../utils/responseHandler.js";
import { createSendToken } from "../utils/token.js";
import tryCatchFunction from "../utils/tryCatchFunction.js";
const { successResponse } = responseHandler;

export const register = tryCatchFunction(async (req, res, next) => {
  //   req.body handles form collection from the client
  // req.validatedData is the data that
  const user = await userService.register(req.body, next);
  if (!user) return; //this will ensure that if the user is not logged in there will be no further action teken
  // handle accessToken generation - we send the user to our createSendToken which extracts the id from jwt to sign
  const { accessToken, refreshToken, cookieOptions } = createSendToken(user);
  // send the cookie
  res.cookie("userRefreshToken", refreshToken, cookieOptions);
  return successResponse(res, { accessToken }, "Registration successful", 201);
});

export const login = tryCatchFunction(async (req, res, next) => {
  const user = await userService.login(req.body, next);
  if (!user) return; //this will ensure that if the user is not logged in there will be no further action teken
  const { accessToken, refreshToken, cookieOptions } = createSendToken(user);
  // send the cookie
  res.cookie("userRefreshToken", refreshToken, cookieOptions);
  return successResponse(res, { accessToken }, "Login successful", 200);
});

export const authenticateUser = tryCatchFunction(async (req, res, next) => {
  const { id: userId } = req.user; //extract user id from the request.user
  console.log(userId);
  
  const user = await userService.authenticateUser(userId, next);
  return successResponse(res, user, "User authenticated", 200);
});

// export const logoutUser = tryCatchFunction(async (req, res, next) => {
//   const user = await userService.logoutUser(req, res, next);
//   if (!user) return;
//   return successResponse(res, user, "logged out successfully", 200);
// });

export const refreshAccessToken = tryCatchFunction(async (req, res, next) => {
  // to get the refreshToken from the cookie
  const refreshToken = req.cookies?.userRefreshToken;
  const user = await userService.refreshAccessToken(refreshToken, next);
  if (!user) return;
  const tokenData = createSendToken(user);
  if (!tokenData) return;
  const { accessToken } = tokenData;
  return successResponse(
    res,
    { accessToken },
    "Access token refreshed successfully",
    200
  );
});

export const verifyUserAccount = tryCatchFunction(async (req, res, next) => {
  const { id: userId } = req.user;
  const data = await userService.verifyUserAccount(
    { userId, ...req.body },
    next
  );
  if (!data) return;
  return successResponse(res, data, "Account verified successfully", 200);
});

export const resendVerificationToken = tryCatchFunction(
  async (req, res, next) => {
    const { id: userId } = req.user;
    const user = await userService.resendVerificationToken(userId, next);
    if (!user) return;
    return successResponse(
      res,
      null,
      "Verification token sent to your email",
      200
    );
  }
);


export const forgotPassword = tryCatchFunction(async(req, res, next) => {
  const user = await userService.forgotPassword(req.body, next);
  if(!user) return;
  return successResponse(
    res, null, "Password reset link has been sent to your email",
    200
  );
});


export const resetPassword = tryCatchFunction(async (req, res, next) => {
  const email = req.query.email || "";
  const passwordResetToken = req.query.token || "";
  const responseData = await userService.resetPassword(
    { ...req.body, email, passwordResetToken },
    next
  );
  if(!responseData) return;
  return successResponse(res, null, "Password reset successfully", 200);
});

export const logout = tryCatchFunction(async(req, res, next) => {
  const responseData = await userService.logout(req, res, next);
  if(!responseData) return;
  return successResponse(res, responseData, "logged out successfully", 200);
});