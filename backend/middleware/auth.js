import express from "express";
import { BadRequestException } from "../exceptions/badRequestException.js";
import { ErrorCodes } from "../exceptions/root.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { InternalException } from "../exceptions/internalException.js";
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return next(
        new BadRequestException("Unauthorized!", ErrorCodes.INVALID_CREDENTIAL)
      );
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      return next(
        new BadRequestException("Unauthorized!", ErrorCodes.INVALID_CREDENTIAL)
      );
    }
    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      return next(
        new BadRequestException("Unauthorized!", ErrorCodes.INVALID_CREDENTIAL)
      );
    }
    req.user = user;
    next();
  } catch (error) {
    return next(
      new InternalException(
        "Something went wrong!",
        error,
        ErrorCodes.INTERNAL_ERROR
      )
    );
  }
};
