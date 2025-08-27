import { z } from "zod";

export const validateSignUpSchema = z.object({
  fullname: z.string().min(3, {
    message: "Full name must be at least 3 characters long",
  }),
  email: z.email(),
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
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
  role: z.enum(["admin", "staff", "doctor", "nurse", "patient"]).optional(),
});

export const validateSignInSchema = z.object({
  email: z.email(),
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
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
});

export const validateAccountSchema = z.object({
  verifcationToken: z.string().min(6, {
    message: "Verification code must be at least 6 characters long",
  }),
});

export const validatePatientSchema = z.object({
  fullname: z.string().min(3, {
    message: "Full name must be at least 3 characters long",
  }),
  email: z.email(),
  phone: z.string().min(11, {
    message: "Phone number is incomplete",
  }),
  dateOfBirth: z.string().date(),
  address: z.string().min(3, {
    message: "Please include an address, must be at least 3 characters long",
  }),
  gender: z.enum(["male", "female", "other"]).refine((value) => value !== "", {
    message: "Gender is required",
  }),
  bloodGroup: z.string({
    message: "Blood group is required",
  }),
  emergencyContact: z.string().min(3, {
    message: "Emergency contact must be at least 3 characters long",
  }),
  emergencyContactPhone: z.string().min(11, {
    message: "Emergency contact phone must be at least 11 characters long",
  }),
  emergencyContactRelationship: z.string().min(3, {
    message:
      "Emergency contact relationship must be at least 3 characters long",
  }),
});

export const forgotPasswordSchema = z.object({
  email: z.email({
    message: "Email is required",
  }),
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
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
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
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
});


export const validateUserSchema = z.object({
  fullname: z.string().min(3, {
    message: "Full name must be at least 3 characters long",
  }),
  email: z.string().email(),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters long",
  }),
  dateOfBirth: z.string().date(),
});

export const updatePasswordSchema = z.object({
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
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
  newPassword: z
    .string()
    .min(8, {
      message: "New Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "New Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "New Password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "New Password must contain at least one special character",
    }),
  confirmPassword: z
    .string()
    .min(8, {
      message: "Confirm Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Confirm Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Confirm Password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Confirm Password must contain at least one special character",
    }),
});

export const validateUpdateUserRoleSchema = z.object({
  role: z
    .enum(["staff", "doctor", "admin", "nurse", "patient"])
    .refine((value) => value !== "", {
      message: "Role is required",
    }),
});



// my own code below, to be replaced on receiving the real dataSchema

export const updateHealthRecordSchema = z.object({
  allergies: z
    .string()
    .max(255, "Allergies must be 255 characters or less")
    .optional()
    .or(z.literal("")),
  bloodGroup: z
    .string()
    .max(5, "Blood group must be 5 characters or less")
    .regex(/^(A|B|AB|O)[+-]?$/, "Invalid blood group")
    .optional()
    .or(z.literal("")),
  medicalConditions: z
    .string()
    .max(255, "Medical conditions must be 255 characters or less")
    .optional()
    .or(z.literal("")),
});
