import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    otp:{
        type:String,
        default:''
    },
    otpExpireTime:{
        type:Number,
        default:0
    },
    isVarified:{
        type:Boolean,
        default:false
    },
    messageLimit:{
        type:Number,
        default:0
    }
})

const userModel = mongoose.model("user", userSchema);

export default userModel