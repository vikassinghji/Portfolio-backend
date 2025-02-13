import userModel from "../models/userSchema.js";
import mailSender from "../config/mailSender.js";


export const auth = async (req, res, next) => {
    try{

        const {firstName, lastName, email} = req.body;
        if(!firstName || !lastName || !email){
            return res.json({
                success:false,
                message:"All fields are required"
            })
        }

        let user = await userModel.findOne({email:email});

        if(!user){
            user = new userModel({
                firstName,
                lastName,
                email
            })
        }

        await user.save();
        
        // return res.json({
        //     success:true,
        //     message:"Entry created successfully"
        // })
        
        next();

    } catch(error){
        return res.json({
            success:false,
            message:"Error in creating entry",
            error:error.message
        })
    }
}

export const sendOtp = async (req, res) => {
    try{
        const {email} = req.body;

        if(!email){
            return res.json({
                success:false,
                message:"email is required"
            })
        }

        const user = await userModel.findOne({email:email});

        if(!user){
            return res.json({
                success:false,
                message:"user is not find"
            })
        }
        
        const otp = String(Math.floor(100000 + Math.random() * 900000));;

        user.otp = otp;
        user.otpExpireTime = Date.now() + 5*60*1000;

        await user.save();

        //email

        const emailResult = await mailSender(
            user.email, 
            "Email Verification OTP", 
            `
              <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd;">
                <h2 style="color: #0b0c10;">Hello, ${user.firstName}!</h2>
                <p>Your OTP for email verification is:</p>
                <h1 style="background: #1f2833; color: #c5c6c7; padding: 10px; display: inline-block; border-radius: 5px;">
                  ${otp}
                </h1>
                <p>This OTP is valid for only 5 minutes. Do not share it with anyone.</p>
                <br/>
                <p>Best regards,</p>
                <p><strong>Vikas Portfolio</strong></p>
              </div>
            `, 
            'Vikas Portfolio'
          );
          
        // console.log("emailRes: ", emailResult);
        
        return res.json({
            success:true,
            message:"Otp has been sent successfully"
        })

    } catch(error){
        return res.json({
            success:false,
            message:"error in sending otp",
            error:error.message
        })
    }
}

export const verifyOtp = async (req, res) => {
    try{
        const {email, otp} = req.body;

        if(!otp || !email){
            return res.json({
                success:false,
                message:"All fields are required"
            })
        }

        const user = await userModel.findOne({email:email});

        if(!user){
            return res.json({
                success:false,
                message:"user is note present"
            })
        }


        if( user.otp=== '' || user.otp !== otp){
            return res.json({
                success:false,
                message:"Invalid otp"
            })
        }

        if(user.otpExpireTime < Date.now()){
            return res.json({
                success:false,
                message:"otp has been expired"
            })
        }
        
        user.otp='';
        user.otpExpireTime=0;
        user.isVarified=true;

        await user.save();

        return res.json({
            success:true,
            message:"otp has been verified"
        })

    } catch(error){
        return res.json({
            success:false,
            message:"error in otp verification",
            error:error.message
        })
    }
}


export const sendMessage = async (req, res) =>{
    try{
        const {email, message} = req.body;
        
        if(!email || !message){
            return res.json({
                success:false,
                message:"All fields are required"
            })
        }

        const user = await userModel.findOne({email:email});

        if(!user){
            return res.json({
                success:false,
                message:"User is not present"
            })
        }

        if(!user.isVarified){
            return res.json({
                success:false,
                message:"user is not verified"
            })
        }

        const emailResult = await mailSender(process.env.PORTFOLIO_OWNER, "Message from portfolio", message, email);

        if(!emailResult){
            return res.json({
                success:false,
                message:"error in sending email message"
            })
        }

        user.messageLimit=user.messageLimit+1;

        if(user.messageLimit>2){
            user.messageLimit=0;
            user.isVarified=false
        }

        await user.save();

        return res.json({
            success:true,
            message:"Message has been sent to vikas"
        })

        
    } catch(error){
        return res.json({
            success:false,
            message:"Error in sending message",
            error:error.message
        })
    }
}