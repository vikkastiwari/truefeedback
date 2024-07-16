import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

/**
 * TODO: Refactor Response.json using factory functions
 */ 

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({email});
    // six digit passcode generation
    // This results in a random six-digit number between 100,000 and 999,999, inclusive.
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if(existingUserByEmail) {
      if(existingUserByEmail.isVerified) {
        return Response.json({
          success: false,
          message: "User already exist with this email",
        }, {status: 400})
      }else{
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hasedPassword = await bcrypt.hash(password,10);
      // Here const is updated as new Date() returns object which can be updated referentially
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        password: hasedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: []
      });

      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    if(!emailResponse.success) {
      return Response.json({
        success: false,
        message: emailResponse.message,
      }, {status: 500})
    }

    return Response.json({
      success: true,
      message: "User registered successfully. Please verify your email"
    }, {status: 200})

  } catch (error) {
    console.error('Error regsitering user', error);
    return Response.json({
      success: false,
      message: 'Error regsitering user'
    },{
      status: 500
    })
    
  }
}
