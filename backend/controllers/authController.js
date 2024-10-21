import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { genrateTokenAndSetCookie } from "../utils/genrateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/email.js";
import { configDotenv } from "dotenv";

configDotenv();

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .send({ success: false, message: "User already exists." });
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const user = new User({
      email,
      password: hashPassword,
      name,
      verificationToken,
      verificationExpireAt: Date.now() + 3600000,
    });
    await user.save();
    // jwt
    genrateTokenAndSetCookie(res, user._id);

    // send verification email
    await sendVerificationEmail(user.email, verificationToken);

    // send response

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
    console.log("error in signup :", error);
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationExpireAt: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Verification failed",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail :", error);

    res.status(500).json({ success: false, message: "server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User does not exist." });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .send({ success: false, message: "Password is incorrect." });
    }
    genrateTokenAndSetCookie(res, user._id);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in login :", error);
    res.status(400).send({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    // generate  reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordExpireAt = Date.now() + 1 * 60 * 60 * 1000; //1hr

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpireAt = resetPasswordExpireAt;

    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res
      .status(200)
      .send({ success: true, message: "Verification email sent successfully" });
  } catch (error) {
    console.log("error in forgotPassword :", error);
    res.status(400).send({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpireAt: {
        $gt: Date.now(),
      },
    });
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid token or session expired" });
    }
    //   update password
    const hashPassword = await bcryptjs.hash(password, 10);

    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpireAt = undefined;
    await user.save();
    await sendResetSuccessEmail(user.email);
    res
      .status(200)
      .send({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log("error in resetPassword :", error);
    res.status(400).send({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User found", user: user });
  } catch (error) {
    console.log("error in checkAuth :", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
