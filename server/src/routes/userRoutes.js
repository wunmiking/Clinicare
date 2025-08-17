import express from "express";
import {
  authenticateUser,
  login,
  register,
  // logoutUser,
  refreshAccessToken,
  verifyUserAccount,
  resendVerificationToken,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/userController.js";
import { validateFormData } from "../middlewares/validateForm.js";
import {
  validateSignInSchema,
  validateSignUpSchema,
  validateAccountSchema,
  validateForgotPasswordSchema,
  validateResetPasswordSchema,
} from "../utils/dataSchema.js";
import { verifyAuth } from "../middlewares/authenticate.js";
import { rateLimiter, refreshTokenLimit } from "../middlewares/rateLimit.js";
import { cacheMiddleware, clearCache } from "../middlewares/cache.js";

const router = express.Router();

router.post("/create", validateFormData(validateSignUpSchema), register); //you cannot get to register without first going through the validateFormData
router.post(
  "/login",
  rateLimiter,
  validateFormData(validateSignInSchema),
  login
);

router.get(
  "/user",
  verifyAuth,
  cacheMiddleware("auth_user", 3600),
  authenticateUser
);

// router.post("/logout", verifyAuth, clearCache("auth_user"), logoutUser);
router.post("/refresh-token", refreshTokenLimit, refreshAccessToken);

router.patch(
  "/verify-account",
  rateLimiter,
  verifyAuth,
  validateFormData(validateAccountSchema),
  clearCache("auth_user"),
  verifyUserAccount
);

router.post(
  "/resend/verify-token",
  rateLimiter,
  verifyAuth,
  resendVerificationToken
);

router.post(
  "/forgot-password",
  rateLimiter,
  validateFormData(validateForgotPasswordSchema),
  forgotPassword
);

router.patch(
  "/reset-password",
  rateLimiter,
  validateFormData(validateResetPasswordSchema),
  resetPassword
);

router.post("/logout", verifyAuth, clearCache("auth_user"), logout); //this clears the cache for the single uer. to clear all the cache we remover verifyAuth and write clearCache(null, clearAll: true)

export default router;
