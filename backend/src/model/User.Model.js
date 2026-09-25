import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    contact: {
      type: Number,
      required: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    avatar: {
      type: String, // external source like cloudnary
      default: "",
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
      required: true,
    },
    reFreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName

    }, process.env.ACCESS_SECRET_TOKEN,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}
userSchema.methods.generatereFreshToken = function () {
  return jwt.sign(
    {
      _id: this._id
    }, process.env.REFRESH_SECRET_TOKEN,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model("User", userSchema);
