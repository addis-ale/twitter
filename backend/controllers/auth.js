import User from "../models/user.js";
import { BadRequestException } from "../exceptions/badRequestException.js";
import { hashSync } from "bcryptjs";
import { signUpSchema } from "../validators/signUpSchema.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import { ErrorCodes } from "../exceptions/root.js";

export const signup = async (req, res, next) => {
  const validatedData = signUpSchema.parse(req.body);
  const { username, fullName, password, email } = validatedData;
  const existedUserName = await User.findOne({ username });
  if (existedUserName) {
    next(
      new BadRequestException(
        "Username alreay taken!",
        ErrorCodes.USER_NAME_ALREADY_EXIST
      )
    );
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    next(
      new BadRequestException(
        "User alreay exist try to login!",
        ErrorCodes.USER_ALREADY_EXIST
      )
    );
  }
  const newUser = new User({
    username,
    fullName,
    password: hashSync(password, 10),
    email,
  });
  if (newUser) {
    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);
    const { password, ...userData } = newUser._doc;
    res.status(201).json({ success: true, data: userData });
  } else {
    console.log("Invalid user Data");
  }
};
//hYkS2P1iKvhVWcfq
