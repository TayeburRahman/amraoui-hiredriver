import bcrypt from "bcrypt";
import cron from "node-cron";
import httpStatus from "http-status";

import ApiError from "../../../errors/ApiError";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { logger } from "../../../shared/logger";
import Auth from "./auth.model";

import sendEmail from "../../../utils/sendEmail";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { sendResetEmail } from "./sendResetMails";
import { createActivationToken } from "../../../utils/createActivationToken";
import { registrationSuccessEmailBody } from "../../../mails/user.register";
import { driverActivationEmailBody } from "../../../mails/driver.emails";
import { resetEmailTemplate } from "../../../mails/reset.email";
import {
  ActivationPayload,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  IAuth,
  LoginPayload,
  ResetPasswordPayload,
} from "./auth.interface";
import config from "../../../config";

import Admin from "../admin/admin.model";
import Customers from "../customers/customers.model";
import Drivers from "../drivers/drivers.model";
import { RequestData } from "../../../interfaces/common";
import { ICustomers } from "../customers/customers.interface";
import { IAdmin } from "../admin/admin.interface";
import { IDrivers } from "../drivers/drivers.interface";

// ─────────────────────────────────────────────
//  REGISTRATION
// ─────────────────────────────────────────────
const registrationAccount = async (payload: IAuth) => {
  const { role, password, confirmPassword, email, ...other } = payload;

  if (!role || !Object.values(ENUM_USER_ROLE).includes(role as any)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Valid Role is required!");
  }

  if (!password || !confirmPassword || !email) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Email, Password, and Confirm Password are required!"
    );
  }
  if (password !== confirmPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password and Confirm Password didn't match"
    );
  }

  const existingAuth = await Auth.findOne({ email }).lean();
  if (existingAuth?.isActive) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists");
  }

  // Clean up incomplete previous registration
  if (existingAuth && !existingAuth.isActive) {
    await Promise.all([
      existingAuth.role === ENUM_USER_ROLE.CUSTOMERS &&
      Customers.deleteOne({ authId: existingAuth._id }),
      existingAuth.role === ENUM_USER_ROLE.DRIVER &&
      Drivers.deleteOne({ authId: existingAuth._id }),
      (existingAuth.role === ENUM_USER_ROLE.ADMIN ||
        existingAuth.role === ENUM_USER_ROLE.SUPER_ADMIN) &&
      Admin.deleteOne({ authId: existingAuth._id }),
      Auth.deleteOne({ email }),
    ]);
  }

  const { activationCode } = createActivationToken();
  const authData = {
    role,
    name: other.name,
    email,
    activationCode,
    password,
    expirationTime: Date.now() + 3 * 60 * 1000,
    isActive: (role === ENUM_USER_ROLE.ADMIN || role === ENUM_USER_ROLE.SUPER_ADMIN),
    profile_image: other.profile_image,
  };

  if (role === ENUM_USER_ROLE.CUSTOMERS) {
    sendEmail({
      email: authData.email,
      subject: "Activate Your Account",
      html: registrationSuccessEmailBody({
        user: { name: authData.name },
        activationCode,
      }),
    }).catch((error) => console.error("Failed to send email:", error.message));

    sendEmail({
      email: "partner@vehiqqo.com",
      subject: "New Customer Registration Pending Approval",
      html: `
        <h2>New Customer Registration</h2>
        <p>A new customer has registered and is awaiting approval.</p>
        <ul>
          <li><strong>Name:</strong> ${other.name}</li>
          <li><strong>Family Name:</strong> ${other.family_name || 'N/A'}</li>
          <li><strong>Company:</strong> ${other.company || 'N/A'}</li>
          <li><strong>Tax Number:</strong> ${other.tax_number || 'N/A'}</li>
          <li><strong>Phone Number:</strong> ${other.phone_number || 'N/A'}</li>
          <li><strong>Email:</strong> ${authData.email}</li>
          <li><strong>Message:</strong> ${other.message || 'N/A'}</li>
        </ul>
      `
    }).catch((error) => console.error("Failed to send partner email:", error.message));
  }

  if (role === ENUM_USER_ROLE.DRIVER) {
    sendEmail({
      email: authData.email,
      subject: "Verify Your Driver Account",
      html: driverActivationEmailBody({
        name: authData.name,
        activationCode,
      }),
    }).catch((error) => console.error("Failed to send driver activation email:", error.message));
  }

  const createAuth = await Auth.create(authData);
  if (!createAuth) {
    throw new ApiError(500, "Failed to create auth account");
  }

  other.authId = createAuth._id;
  other.email = email;

  // Role-based profile creation
  let result;
  switch (role) {
    case ENUM_USER_ROLE.CUSTOMERS:
      result = await Customers.create(other);
      break;
    case ENUM_USER_ROLE.DRIVER:
      // Driver accounts need admin approval — created with status=pending
      result = await Drivers.create({ ...other, status: "pending" });
      break;
    case ENUM_USER_ROLE.ADMIN:
    case ENUM_USER_ROLE.SUPER_ADMIN:
      result = await Admin.create(other);
      break;
    default:
      throw new ApiError(400, "Invalid role provided!");
  }

  const message =
    role === ENUM_USER_ROLE.CUSTOMERS
      ? "Please check your email for the activation OTP code."
      : role === ENUM_USER_ROLE.DRIVER
        ? "Please check your email for the verification OTP code."
        : "Your admin account is awaiting super admin approval.";

  return { result, role, message };
};

// ─────────────────────────────────────────────
//  ACTIVATE ACCOUNT (customers only via OTP)
// ─────────────────────────────────────────────
const activateAccount = async (payload: ActivationPayload) => {
  const { activation_code, userEmail } = payload;

  const existAuth = await Auth.findOne({ email: userEmail });
  if (!existAuth) {
    throw new ApiError(400, "User not found");
  }
  if (existAuth.activationCode !== activation_code) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Code didn't match!");
  }

  await Auth.findOneAndUpdate(
    { email: userEmail },
    { isActive: true },
    { new: true, runValidators: true }
  );

  let result: ICustomers | IAdmin | IDrivers | null = null;

  switch (existAuth.role) {
    case ENUM_USER_ROLE.CUSTOMERS:
      result = await Customers.findOne({ authId: existAuth._id });
      break;
    case ENUM_USER_ROLE.ADMIN:
    case ENUM_USER_ROLE.SUPER_ADMIN:
      result = await Admin.findOne({ authId: existAuth._id });
      break;
    case ENUM_USER_ROLE.DRIVER:
      result = await Drivers.findOne({ authId: existAuth._id });
      break;
    default:
      throw new ApiError(400, "Invalid role provided!");
  }

  if (!result) {
    throw new ApiError(404, "User details not found");
  }

  const isPendingCustomerOrDriver =
    (existAuth.role === ENUM_USER_ROLE.CUSTOMERS || existAuth.role === ENUM_USER_ROLE.DRIVER) &&
    (result as ICustomers | IDrivers).status === "pending";

  if (isPendingCustomerOrDriver) {
    return {
      message: existAuth.role === ENUM_USER_ROLE.CUSTOMERS
        ? "Email verified. Thanks for your message, we will contact you soon."
        : "Email verified. Your account is pending admin approval.",
      pending: true,
      user: result
    };
  }

  const accessToken = jwtHelpers.createToken(
    { authId: existAuth._id, role: existAuth.role, userId: result._id },
    config.jwt.secret as string,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    { authId: existAuth._id, userId: result._id, role: existAuth.role },
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string
  );

  return { accessToken, refreshToken, user: result };
};

// ─────────────────────────────────────────────
//  LOGIN
// ─────────────────────────────────────────────
const loginAccount = async (payload: LoginPayload) => {
  const { email, password } = payload;

  const isAuth = await Auth.isAuthExist(email);
  if (!isAuth) {
    throw new ApiError(404, "User does not exist");
  }
  if (!isAuth.isActive) {
    throw new ApiError(401, "Please activate your account then try to login");
  }
  if (isAuth.is_block) {
    throw new ApiError(403, "You are blocked. Contact support");
  }
  if (isAuth.password && !(await Auth.isPasswordMatched(password, isAuth.password))) {
    throw new ApiError(401, "Password is incorrect");
  }

  const { _id: authId } = isAuth;
  let userDetails: any;
  let role: string;

  switch (isAuth.role) {
    case ENUM_USER_ROLE.CUSTOMERS:
      userDetails = await Customers.findOne({ authId: isAuth._id }).populate("authId");
      role = ENUM_USER_ROLE.CUSTOMERS;
      if (userDetails?.status === "pending") {
        throw new ApiError(403, "Your account is pending admin approval. Thanks for your message, we will contact you soon.");
      }
      break;
    case ENUM_USER_ROLE.DRIVER:
      userDetails = await Drivers.findOne({ authId: isAuth._id }).populate("authId");
      role = ENUM_USER_ROLE.DRIVER;
      if (userDetails?.status === "declined") {
        throw new ApiError(
          403,
          userDetails?.decline_reason
            ? `Your driver account was declined: ${userDetails.decline_reason}`
            : "Your driver account has been declined. Contact support."
        );
      }
      break;
    case ENUM_USER_ROLE.ADMIN:
      userDetails = await Admin.findOne({ authId: isAuth._id }).populate("authId");
      role = ENUM_USER_ROLE.ADMIN;
      break;
    case ENUM_USER_ROLE.SUPER_ADMIN:
      userDetails = await Admin.findOne({ authId: isAuth._id }).populate("authId");
      role = ENUM_USER_ROLE.SUPER_ADMIN;
      break;
    default:
      throw new ApiError(400, "Invalid role provided!");
  }

  if (!userDetails) {
    throw new ApiError(404, "User profile not found");
  }

  const accessToken = jwtHelpers.createToken(
    { authId, role, userId: userDetails._id },
    config.jwt.secret as string,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    { authId, role, userId: userDetails._id },
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string
  );

  return { accessToken, refreshToken, user: userDetails };
};

// ─────────────────────────────────────────────
//  FORGOT PASSWORD
// ─────────────────────────────────────────────
const forgotPass = async (payload: { email: string }) => {
  const user = (await Auth.findOne(
    { email: payload.email },
    { _id: 1, role: 1, email: 1, name: 1 }
  )) as IAuth;

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not exist!");
  }

  const verifyCode = createActivationToken().activationCode;
  const verifyExpire = new Date(Date.now() + 15 * 60 * 1000);
  user.verifyCode = verifyCode;
  user.verifyExpire = verifyExpire;
  await user.save();

  const data = {
    name: user.name,
    verifyCode,
    verifyExpire: Math.round(
      (verifyExpire.getTime() - Date.now()) / (60 * 1000)
    ),
  };

  try {
    await sendEmail({
      email: payload.email,
      subject: "Password reset code",
      html: resetEmailTemplate(data),
    });
  } catch (error: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

// ─────────────────────────────────────────────
//  VERIFY OTP FOR PASSWORD RESET
// ─────────────────────────────────────────────
const checkIsValidForgetActivationCode = async (payload: {
  email: string;
  code: string;
}) => {
  const account: any = (await Auth.findOne({
    email: payload.email,
  })) as IAuth;
  if (!account) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Account does not exist!");
  }
  if (account.verifyCode !== payload.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid reset code!");
  }
  const currentTime = new Date();
  if (currentTime > account.verifyExpire) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Reset code has expired!");
  }
  const update = await Auth.updateOne(
    { email: account.email },
    { codeVerify: true }
  );
  account.verifyCode = null;
  await account.save();
  return update;
};

// ─────────────────────────────────────────────
//  RESET PASSWORD
// ─────────────────────────────────────────────
const resetPassword = async (req: {
  query: { email: string };
  body: ResetPasswordPayload;
}) => {
  const { email } = req.query;
  const { newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Passwords do not match");
  }

  const auth = await Auth.findOne({ email }, { _id: 1, codeVerify: 1 });
  if (!auth) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }
  if (!auth.codeVerify) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Your OTP is not verified!");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );
  const result = await Auth.updateOne(
    { email },
    { password: hashedPassword, codeVerify: false }
  );
  return result;
};

// ─────────────────────────────────────────────
//  CHANGE PASSWORD (authenticated)
// ─────────────────────────────────────────────
const changePassword = async (
  user: { authId: string },
  payload: ChangePasswordPayload
) => {
  const { authId } = user;
  const { oldPassword, newPassword, confirmPassword } = payload;

  if (newPassword !== confirmPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password and confirm password do not match"
    );
  }

  const isUserExist = await Auth.findById(authId).select("+password");
  if (!isUserExist) {
    throw new ApiError(404, "Account does not exist!");
  }
  if (
    isUserExist.password &&
    !(await Auth.isPasswordMatched(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(402, "Old password is incorrect");
  }

  isUserExist.password = newPassword;
  await isUserExist.save();

  return { message: "Password changed successfully" };
};

// ─────────────────────────────────────────────
//  RESEND ACTIVATION CODE
// ─────────────────────────────────────────────
const resendCodeActivationAccount = async (payload: { email: string }) => {
  const user = (await Auth.findOne({ email: payload.email })) as IAuth;
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email not found!");
  }

  const activationCode = createActivationToken().activationCode;
  const expiryTime = new Date(Date.now() + 3 * 60 * 1000);
  user.activationCode = activationCode;
  user.verifyExpire = expiryTime;
  await user.save();

  sendResetEmail(
    user.email,
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Activation Code</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; }
            p { color: #555; line-height: 1.5; }
            .footer { margin-top: 20px; font-size: 12px; color: #999; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Hello, ${user.name}</h1>
            <p>Your activation code is: <strong style="font-size: 24px; color: #007bff;">${activationCode}</strong></p>
            <p>Please use this code to activate your account. If you did not request this, please ignore this email.</p>
            <p>Thank you!</p>
            <div class="footer"><p>&copy; ${new Date().getFullYear()} Vehiqqo</p></div>
        </div>
    </body>
    </html>`
  );
};

// ─────────────────────────────────────────────
//  RESEND FORGOT PASSWORD CODE
// ─────────────────────────────────────────────
const resendCodeForgotAccount = async (payload: ForgotPasswordPayload) => {
  const { email } = payload;
  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email not found!");
  }
  const user = await Auth.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const verifyCode = createActivationToken().activationCode;
  const expiryTime = new Date(Date.now() + 3 * 60 * 1000);
  user.verifyCode = verifyCode;
  user.verifyExpire = expiryTime;
  await user.save();

  sendResetEmail(
    user.email,
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Code</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; }
            p { color: #555; line-height: 1.5; }
            .footer { margin-top: 20px; font-size: 12px; color: #999; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Hello, ${user.name}</h1>
            <p>Your password reset code is: <strong style="font-size: 24px; color: #007bff;">${verifyCode}</strong></p>
            <p>This code expires in 3 minutes. If you did not request this, please ignore this email.</p>
            <p>Thank you!</p>
            <div class="footer"><p>&copy; ${new Date().getFullYear()} Vehiqqo</p></div>
        </div>
    </body>
    </html>`
  );
};

// ─────────────────────────────────────────────
//  MY PROFILE
// ─────────────────────────────────────────────
const myProfile = async (user: { userId: string; role: string }) => {
  const { userId, role } = user;
  let result;
  switch (role) {
    case ENUM_USER_ROLE.CUSTOMERS:
      result = await Customers.findById(userId).populate("authId");
      break;
    case ENUM_USER_ROLE.DRIVER:
      result = await Drivers.findById(userId).populate("authId");
      break;
    case ENUM_USER_ROLE.ADMIN:
    case ENUM_USER_ROLE.SUPER_ADMIN:
      result = await Admin.findById(userId).populate("authId");
      break;
    default:
      throw new ApiError(400, "Invalid role provided!");
  }
  return result;
};

// ─────────────────────────────────────────────
//  DELETE MY ACCOUNT
// ─────────────────────────────────────────────
const deleteMyAccount = async (payload: { authId: string }) => {
  const { authId } = payload;
  const isUserExist = await Auth.findById(authId);
  if (!isUserExist) {
    throw new ApiError(404, "User does not exist");
  }

  let deletedUser = null;
  switch (isUserExist.role) {
    case ENUM_USER_ROLE.CUSTOMERS:
      deletedUser = await Customers.findOneAndDelete({ authId: isUserExist._id });
      break;
    case ENUM_USER_ROLE.DRIVER:
      deletedUser = await Drivers.findOneAndDelete({ authId: isUserExist._id });
      break;
    default:
      deletedUser = await Admin.findOneAndDelete({ authId: isUserExist._id });
  }

  if (!deletedUser) {
    throw new ApiError(404, "User profile not found");
  }

  const deletedAuth = await Auth.findByIdAndDelete(authId);
  return { message: "Account deleted successfully", deletedAuth };
};

// ─────────────────────────────────────────────
//  UPDATE MY PROFILE
// ─────────────────────────────────────────────
const updateMyProfile = async (req: RequestData) => {
  const { files, body: data } = req as any;
  const { userId, authId, role } = req.user;

  if (!Object.keys(data).length && (!files || !files.profile_image)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Data is missing in the request body!"
    );
  }

  // Parse nested objects if sent as strings via FormData
  if (data.notificationPrefs && typeof data.notificationPrefs === 'string') {
    try {
      data.notificationPrefs = JSON.parse(data.notificationPrefs);
    } catch (e) {
      // ignore
    }
  }

  const checkAuth = await Auth.findById(authId);
  if (!checkAuth?.isActive) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
  }

  let profile_image: string | undefined = undefined;
  if (files && files.profile_image) {
    profile_image = files.profile_image[0].path;
  }

  switch (role) {
    case ENUM_USER_ROLE.CUSTOMERS: {
      const customer = await Customers.findById(userId);
      if (!customer) throw new ApiError(httpStatus.NOT_FOUND, "Customer not found!");
      await Promise.all([
        Auth.findByIdAndUpdate(authId, { name: data.name, profile_image }, { new: true }),
        Customers.findByIdAndUpdate(userId, { profile_image, ...data }, { new: true }).populate("authId"),
      ]);
      return Customers.findById(userId).populate("authId") as unknown as ICustomers;
    }
    case ENUM_USER_ROLE.DRIVER: {
      const driver = await Drivers.findById(userId);
      if (!driver) throw new ApiError(httpStatus.NOT_FOUND, "Driver not found!");
      await Promise.all([
        Auth.findByIdAndUpdate(authId, { name: data.name, profile_image }, { new: true }),
        Drivers.findByIdAndUpdate(userId, { profile_image, ...data }, { new: true }).populate("authId"),
      ]);
      return Drivers.findById(userId).populate("authId") as unknown as IDrivers;
    }
    case ENUM_USER_ROLE.ADMIN:
    case ENUM_USER_ROLE.SUPER_ADMIN: {
      const admin = await Admin.findById(userId);
      if (!admin) throw new ApiError(httpStatus.NOT_FOUND, "Admin not found!");
      await Promise.all([
        Auth.findByIdAndUpdate(authId, { name: data.name, profile_image }, { new: true }),
        Admin.findByIdAndUpdate(userId, { profile_image, ...data }, { new: true }).populate("authId"),
      ]);
      return Admin.findById(userId).populate("authId") as unknown as IAdmin;
    }
    default:
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid role");
  }
};

// ─────────────────────────────────────────────
//  CRON JOBS
// ─────────────────────────────────────────────
// Remove expired, unused activation codes
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const result = await Auth.updateMany(
      {
        isActive: false,
        expirationTime: { $lte: now },
        activationCode: { $ne: null },
      },
      { $unset: { activationCode: "" } }
    );
    if (result.modifiedCount > 0) {
      logger.info(
        `Removed activation codes from ${result.modifiedCount} expired inactive users`
      );
    }
  } catch (error) {
    logger.error("Error removing activation codes from expired users:", error);
  }
});

// Reset codeVerify on expired forgot-password sessions
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const result = await Auth.updateMany(
      { verifyExpire: { $lte: now }, codeVerify: true },
      { $set: { codeVerify: false }, $unset: { verifyCode: "" } }
    );
    if (result.modifiedCount > 0) {
      logger.info(
        `Reset codeVerify for ${result.modifiedCount} expired reset sessions`
      );
    }
  } catch (error) {
    logger.error("Error resetting codeVerify on expired sessions:", error);
  }
});

export const AuthService = {
  registrationAccount,
  loginAccount,
  changePassword,
  forgotPass,
  resetPassword,
  activateAccount,
  checkIsValidForgetActivationCode,
  resendCodeActivationAccount,
  resendCodeForgotAccount,
  myProfile,
  deleteMyAccount,
  updateMyProfile,
};
