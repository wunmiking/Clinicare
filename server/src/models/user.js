import mongoose, { model, Schema } from "mongoose";
// import { date } from "zod";

// We use role as discriminator key to determine the user. Timestamps are also turned on for createdAt & updatedAt
const baseOptions = {
  discriminatorKey: "role",
  timestamps: true,
};

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [50, "Full name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, //this will make sure password is not shown to the user when you console.log or when client inspects in the browser
    },
    dateOfBirth: {
      type: Date,
    },
    phone: {
      type: String,
      maxlength: [15, "Phone number must not exceed 15 digits"],
    },
    avatar: {
      //this will be passed to cloudinary to turn the image to a link
      type: String,
      default: "",
    },
    avatarId: {
      //to track the avatar ID attached to the url to be able to find the image in cloudinary for deleting or modifying
      type: String,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "nurse", "staff", "admin"], //specifies predifined options that must be selected
      default: "patient",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpiry: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetTokenExpiry: {
      type: Date,
      select: false,
    },
    isCompletedOnboard: {
      type: Boolean,
      default: false,
      select: function () {
        return this.role === "patient";
      }, //show this field only if this user role is "patient"
    },
  },
  baseOptions
);

//this checks if a model named User already exists to prevent subsequent re-run of checks. If it doesn't exist then it creates it. It is useful when compiling your schema as changes are made
const User = mongoose.models.User || model("User", userSchema);

// const doctorSchema = new Schema(
//   {
//     specialty: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     availableDate: {
//       type: String,
//       required: true,
//     },

//     availableSlots: {
//       type: String,
//       required: true,
//     },
//   },
//   baseOptions
// );

// // register the Doctor discriminator
// const Doctor = User.discriminator("doctor", doctorSchema);

export default User 
