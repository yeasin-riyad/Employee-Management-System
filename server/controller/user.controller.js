import sendEmail from '../config/sendEmail.js';
import UsersModel from '../models/user.model.js';
import bcryptjs from 'bcryptjs' 
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import { generatedAccessToken } from '../utils/generatedAccessToken.js';
import { generatedRefreshToken } from '../utils/generatedRefreshToken.js';
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js';
import { generatedOTP } from '../utils/generatedOTP.js';
import { forgotPasswordEmailTemplate } from '../utils/forgotPasswordEmailTemplate.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';


export async function registerUserController(req,res){
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message: "Provide email, name,password",
                error: true,
                success: false,
            });
        }

        const userExist = await UsersModel.findOne({email});
        if(userExist){
            return res.status(400).json({
                message: "User already exist with this email",
                error: true,
                success: false,
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const payload = {
            name,
            email,
            password: hashedPassword,
            role:"employee"
        }
        // console.log(payload,"paylod....");

        const newUser = new UsersModel(payload);
        const result=await newUser.save();

        const verify_email_url=`${process.env.FRONTEND_URL}/verify-email?code=${result?._id}`
        await sendEmail({
            sendTo: email,
            subject: 'Email Verification From Employee Management System....',
            // text: `Click on the following link to verify your email: http://localhost:3000/api/auth/verify/${result._id}`,
            html: verifyEmailTemplate({name, url:verify_email_url})
        })

        return res.status(201).json({
            message: "User registered successfully",
            error: false,
            success: true,
            data: result,
        });


    } catch(error){
        return res.status(500).json({
            message: error.message || error,
            error:true,
            success: false,
        });
    }

}


export async function verifyEmailController(req,res){   
    try {
        const {code} = req.query;
        if(!code){
            return res.status(400).json({
                message: "No code provided",
                error: true,
                success: false,
            });
        }
        const user = await UsersModel.findOneAndUpdate({_id: code},{verified: true},{new: true});

        if(!user){
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }else{
            return res.status(200).json({
                message: "Email verified successfully",
                error: false,
                success: true,
            });
        }
    }catch(e){
        return res.status(500).json({
            message: e.message || e,
            error: true,
            success: false,
        });
    }
    
}


export async function loginUserController(req,res){
    try {
        const {email, password} = req.body;
        if(!email ||!password){
            return res.status(400).json({
                message: "Provide email and password",
                error: true,
                success: false,
            });
        }

        const user = await UsersModel.findOne({email});
        
        if(!user ||!bcryptjs.compareSync(password, user.password)){
            return res.status(401).json({
                message: "Invalid email or password",
                error: true,
                success: false,
            });
        }else{
            if(!user.verified){
                return res.status(403).json({
                    message: "User is not verified, please check your email.",
                    error: true,
                    success: false,
                });
            }
            const AccessToken=await generatedAccessToken(user._id);
            const RefreshToken=await generatedRefreshToken(user._id)

        await UsersModel.findOneAndUpdate( {email},{refreshToken:RefreshToken,
            last_login_date:Date.now()});


            const cookiesOptions={
                httpOnly: true,
                secure: true,
                sameSite:"None"
            }

             res.cookie('access_token',AccessToken, cookiesOptions);
             res.cookie('refresh_token',RefreshToken, cookiesOptions);

            return res.status(200).json({
                message: "Login successful",
                error: false,
                success: true,
                data:{
                    user,
                    access_token:AccessToken,
                    refresh_token:RefreshToken,
                }
                
            });
        }

    }catch(err){
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}


export async function logoutController(req, res){
    try {
        const userId=req.userId

        const cookiesOptions={
            httpOnly: true,
            secure: true,
            sameSite:"None"
        }

        // Clear the cookies here
        res.clearCookie('access_token',cookiesOptions);
        res.clearCookie('refresh_token',cookiesOptions);

        // Remove Refresh Token from Database
        await UsersModel.findByIdAndUpdate( userId,{refreshToken:""});
        return res.status(200).json({
            message: "Logout successful",
            error: false,
            success: true,
        });
    } catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}


export async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;
        const user = await UsersModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found with this email.",
                error: true,
                success: false,
            });
        }
        const otp=await generatedOTP()
        const expiresIn = new Date(Date.now() + 60 * 60 * 1000).toLocaleTimeString();

        const result = await UsersModel.findByIdAndUpdate(user?._id,{forgot_password_otp:otp,forgot_password_expiry:expiresIn});

       

        if (!result) {
            return res.status(500).json({
                message: "Error in updating forgot password otp.",
                error: true,
                success: false,
            });
        }

        await sendEmail({
            sendTo: email,
            subject: 'Forgot Password OTP from AIICT Next Generation E-Commerce Project....',
            // text: `Your OTP is: ${otp}`,
            html: forgotPasswordEmailTemplate({name:user.name, otp})
        })

      return res.json({
        message: "OTP sent successfully.Check your Email",
        error: false,
        success: true,
        // data: {
        //     otp,
        //     expiresIn,
        // }
      });
    } catch (err){
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}


// Verify Otp
export async function resetPasswordOtpController(req, res) {
    try {
        const { otp,email } = req.body;
        // const { userId } = req;
        if(!otp){
            return res.status(400).json({
                message: "No OTP provided.",
                error: true,
                success: false,
            });
        }
        const user = await UsersModel.findOne({ email, forgot_password_otp: otp });
        if (!user) {
            return res.status(404).json({
                message: "User not found with this OTP.",
                error: true,
                success: false,
            });
        }

        if(otp !== user?.forgot_password_otp){
            return res.status(401).json({
                message: "Invalid OTP.",
                error: true,
                success: false,
            });
        }

        

         // Validate expiration time
         const currentTime = new Date(); // Current time as Date object
         const expiryTime = new Date(user.forgot_password_expiry); // Convert expiry to Date object
 
         if (expiryTime < currentTime) {
             return res.status(401).json({
                 message: "OTP expired.",
                 error: true,
                 success: false,
             });
         }

         await UsersModel.findOneAndUpdate({email},{forgot_password_otp:"",forgot_password_expiry:""})

        return res.json({
            message: "Verification successful",
            error: false,
            success: true,
        })



      


    } catch (err){
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        })
    }
}


//Update Password Controller
export async function updatePasswordController(req, res) {
    try {
        const { email,NewPassword , ConfirmNewPassword,OldPassword} = req.body;
        
        if(!NewPassword ||!ConfirmNewPassword){
           return res.status(404).json({
                message: "No new password provided.",
                error: true,
                success: false,
            })
        }

        if(NewPassword !== ConfirmNewPassword){
            return res.status(404).json({
                message: "Passwords do not match.",
                error: true,
                success: false,
            })
        }
        if(OldPassword){
            const checkPassword= await UsersModel.findOne({email})
            const match = await bcrypt.compare(OldPassword, checkPassword?.password);
            if(!match){
                return res.status(404).json({
                    message:" Wrong Old Password",
                    success:false,
                    error:true
                })
            }
            
        }
        const hashPassword = await bcryptjs.hash(NewPassword, 10);
        const user = await UsersModel.findOneAndUpdate({email}, { password: hashPassword }, { new: true });
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                error: true,
                success: false,
            });
        }
        return res.json({
            message: "Password updated successfully.",
            error: false,
            success: true,
        });
        
    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}


// get login user details
export async function getUserDetailsController(req,res){
    try {
        const userId=req.userId;
        const user=await UsersModel.findById(userId).select("-refreshToken -password");
        if(!user){
            return res.status(404).json({
                message: "User not found.",
                error: true,
                success: false,
            });
        }
        return res.json({
            message: "User details fetched successfully.",
            error: false,
            success: true,
            data: user
        })
        
    } catch (err){
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

//refresh token controller
export async function refreshTokenController(req,res){
    try {
        const refreshToken=req?.cookies?.refresh_token || req?.headers?.authorization?.split(' ')[1];
        console.log('Refresh token ',refreshToken);
        if(!refreshToken){
            return res.status(401).json({
                message: "No refresh token provided.",
                error: true,
                success: false,
            });
        }
        const verifyRefreshToken=jwt.verify(refreshToken,process.env.REFT_SECRET);
        if(!verifyRefreshToken){
            return res.status(401).json({
                message: "Invalid refresh token.",
                error: true,
                success: false,
            });
        }
    
        const user=await UsersModel.findOne({refreshToken});
        if(!user){
            return res.status(401).json({
                message: "Invalid refresh token.",
                error: true,
                success: false,
            });
        }
        const AccessToken=await generatedAccessToken(user?._id);
        // console.log(AccessToken,"......");
        // const refreshToken=generateRefreshToken(user._id);
        const cookiesOptions={
            httpOnly: true,
            secure: true,
            sameSite:"None"
        }

         res.cookie('access_token',AccessToken, cookiesOptions);
       return res.json({
            message: "Access token refreshed successfully.",
            error: false,
            success: true,
            data: {
                access_token:AccessToken,
                // refresh_token: refreshToken
            }
        })
        
    } catch (err){
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}
