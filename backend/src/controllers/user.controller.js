import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Product } from "../models/product.models.js";
import { Admin } from "../models/admin.model.js";

const generateAccessAndResponceTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        console.log(user._id)
        const accessToken = await user.generateAccessToken();
        // console.log(accessToken);
        const refreshToken = await user.generateRefreshToken()
        // console.log(accessToken + " " + refreshToken)

        user.refershToken = refreshToken;
        user.save({ validateBeforeSave: false })
        return {accessToken, refreshToken}
         
    } catch (error) {
        throw new ApiError(500, "some thing went wrong while generating at or rt")
    }
}

const registerUser = asyncHandler( async(req,res) => {
    const {fullname, email, username, password, address}= req.body
    console.log("email: ", email)
    console.log(username)

    if(
        [fullname, email, username, password].some((field) => field?.trim() === ""))
        {
        throw new ApiError(400,"full name is required")
    }


    const existedUser = await User.findOne({
        $or: [{email}, {username}]
    })
    
    if(existedUser) {
        throw new ApiError(409, "user with email or user name already user")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;

    // const coverLocalPath =  req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "avatar image is required")
    }
    let coverLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverLocalPath=req.files.coverImage[0].path
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverLocalPath);

    if(!avatar) {
        throw new ApiError(400, "avatar image is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username,
        address

    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshtoken"
    )

    if(!createdUser){
        throw new ApiError(500, "error while registering")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registeres successfully")
    )
})

const loginUser = asyncHandler( async(req,res) => {
        
    const {email,password,fullname} = req.body;

    if(!(email || fullname)) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{fullname},{email}]
    })
    // console.log(user)

    if(!user){
        throw new ApiError(404, "user does not exist")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if(!isPasswordCorrect){
        throw new ApiError(401, "invalid password")
    }

    const {accessToken, refreshToken} = await generateAccessAndResponceTokens(user._id)
    // console.log(accessToken + " " + refreshToken)
    const logedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: logedInUser, accessToken,
                refreshToken
            },
            "User logged in successfully"
        ) 
    )
})

const logoutUser = asyncHandler( async(req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refershToken : null
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))

})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refershToken

    if(!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user) {
            throw new ApiError(401, "invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or user")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndResponceTokens(user._id)
        
        return res.status(200)
        .cookie("accessToken",accessToken, options)
        .cookie("refreshToken",newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }
})

const changePassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword} = req.body;

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "invalid old password")
    }
    // console.log(oldPassword+ " "+ newPassword)
    user.password=newPassword
    await user.save({validateBeforeSave: false})

    return res.status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"))

})

const addToCart = asyncHandler(async(req,res)=>{
    const {productId} = req.body;

    if(!productId){
        throw new ApiError(400, invalidProduct)
    }

    const product = Product.findOne({productId})

    if(!product){
        throw new ApiError(404, "product not found")
    }

    const user = await User.findById(req.user._id)
    // console.log(user._id)

    const productIsPresent = user.cart.includes(productId)
    if(productIsPresent){
        throw new ApiError(400, "Product already excist")
    }
    user.cart.push(productId)
    user.save({validateBeforeSave: false})

    return res.status(200)
    .json(new ApiResponse(200, {}, "Added to cart successfully"))
    

})

const addOrders = asyncHandler(async(req,res)=>{
    const {productId} = req.body;

    if(!productId){
        throw new ApiError(400, invalidProduct)
    }

    const product = Product.findOne({productId})

    if(!product){
        throw new ApiError(404, "product not found")
    }

    const user = await User.findById(req.user._id)
    // console.log(user._id)

    user.orders.push(productId)
    user.save({validateBeforeSave: false})

    const admin = Admin.findById()

    return res.status(200)
    .json(new ApiResponse(200, {}, "Added to cart successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    addToCart,
    addOrders
}