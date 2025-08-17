import axiosInstance from "@/utils/axiosInstance";
import { headers } from "@/utils/constants";

// register user
export const registerUser = async (formData) => {
  return await axiosInstance.post("/auth/create", formData);
};

// Login user
export const loginUser = async (formData) => {
  return await axiosInstance.post("/auth/login", formData);
};

// Get authenticated user (coded on 07/08/2025)
export const getAuthenticatedUser = async (accessToken) => {
  return await axiosInstance.get("/auth/user", headers(accessToken));
};

// refresh your accessToken
export const refreshAccessToken = async () => {
  return await axiosInstance.post("/auth/refresh-token", {
    withCredentials: true, //inject cookie value automatically to the server
  });
};

export const verifyAccount = async ({ verificationToken, accessToken }) => {
  return await axiosInstance.patch(
    "/auth/verify-account",
    { verificationToken },
    headers(accessToken)
  );
};

export const resendVerificationCode = async (accessToken) => {
  return await axiosInstance.post(
    "/auth/resend/verify-token",
    {},
    headers(accessToken)
  );
};

export const forgotPassword = async (email) => {
  return await axiosInstance.post("/auth/forgot-password", email);
};

// reset password after token verification
export const resetPassword = async (userData) => {
  return await axiosInstance.patch(
    `/auth/reset-password?email=${userData.email}&token=${userData.token}`,
    userData
  );
};

export const logout = async (accessToken) => {
  return await axiosInstance.post(
    "/auth/logout",
    {},  
    //use this {} if there's nothing passed in the body of the api,
    headers(accessToken),
    {
      withCredentials: true,
    }
  );
};

// Send password reset email
// export const sendPasswordResetEmail = async (email) => {
//   return await axiosInstance.post("/auth/reset-password", { email });
// };

// // Verify reset token (if using token-based reset link)
// export const verifyResetToken = async (token) => {
//   return await axiosInstance.post("/auth/verify-reset-token", { token });
// };

// // Update password after token verification
// export const updatePassword = async ({ token, newPassword }) => {
//   return await axiosInstance.post("/auth/update-password" {
//     token,
//     newPassword,
//   });
