import { z } from "zod";

export const validateSignUpSchema = z.object({
  fullname: z.string().min(3, {
    message: "Full name must be at least 3 characters long",
  }),
  email: z.email({ message: "Email is required" }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    })
    .regex(/[@$!%*$|#^<>.,-_/(){}[\]?&]/, {
      message: "Password must contain at least one special character",
    }),
  //   role: z.enum(["admin", "staff", "doctor", "nurse", "patient"]).optional(),
});

export const validateSignInSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    })
    .regex(/[@$!%*$|#^<>.,-_/(){}[\]?&]/, {
      message: "Password must contain at least one special character",
    }),
  role: z.enum(["admin", "staff", "doctor", "nurse", "patient"]).optional(),
});

export const validateForgotPasswordSchema = z.object({
  email: z.email("Enter a valid email"),
});

export const validateResetPasswordSchema = z.object({

  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    })
    .regex(/[@$!%*$|#^<>.,-_/(){}[\]?&]/, {
      message: "Password must contain at least one special character",
    }),

    confirmPassword: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number",
    })
    .regex(/[@$!%*$|#^<>.,-_/(){}[\]?&]/, {
      message: "Password must contain at least one special character",
    }),
});


export const validateAccountSchema = z.object({
  verificationToken: z
    .string()
    .min(6, { message: "Token must be 6 digits" })
    .max(6, { message: "Token must not exceed 6 digits" }),
});
