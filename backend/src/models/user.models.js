import mongoose,{ Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullname: {
        type: String,
        trim: true,
        index: true
    },
    address: {
        type: String,
        required: true,
        lowercase: true
    },
     avatar: {
        type: String,  //cloudinary url
 
    },
    coverImage: {
        type: String,
    },
    cart: [
        {
            type: Schema.Types.ObjectId,
            ref: "product"
        }
    ],
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "product"
        }
    ],
    password: {
        type: String,
        required: true,
        
    },
    refershToken: {
        type: String,
    },

},{
    timestamps: true
})

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()

})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = async function() {
    // console.log(process.env.ACCESS_TOKEN_SECRET);
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {  
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            
        }

    )
    
}
userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {  
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            
        }

    )
    
}
export const User = mongoose.model("User",userSchema)