import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler( async (req, _, next) => {
  try {
    const token = req.cookies?.accessToken
    // || req.header("Authorization")?.replace("Bearer ","")
    // console.log(req.cookies.accessToken);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    // console.log(token)
    // console.log(process.env.ACCESS_TOKEN_SECRET)
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    // console.log(decodedToken?._id)
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken") || await Admin.findById(decodedToken?._id).select("-password -refreshToken");
    
  
    if (!user) {
      throw new ApiError(401, "invalid access token");
    }
  
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid token")
  }
});
