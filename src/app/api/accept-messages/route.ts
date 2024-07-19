import { getServerSession } from "next-auth";
import { z } from "zod";
import { User } from 'next-auth';

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import { CustomResponse } from "@/helpers/commonHelpers";
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

//TODO: update schema correctly
const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function POST(request: Request) {
     await dbConnect();
     const session = await getServerSession(authOptions);
     const user:User = session?.user as User;

     if(!session || !user) {
          return CustomResponse({
               success: false,
               message: "Not authenticated",
               status: 401,
          });
     }

     const userId = user?._id;
     const {acceptMessages} = await request.json();

     try {
           // Update the user's message acceptance status
          const updatedUser = await UserModel.findByIdAndUpdate(
               userId,
               { isAcceptingMessages: acceptMessages },
               { new: true } // this returns the updated value
          );

          if (!updatedUser) {
               // User not found
               return CustomResponse({
                    success: false,
                    message: 'Unable to find user to update message acceptance status',
                    status: 404,
               });
          }

          // Successfully updated message acceptance status
          return CustomResponse({
               success: true,
               message: 'Message acceptance status updated successfully',
               status: 200,
               updatedUser, // TODO: test this
          });
          
     } catch (error) {
          console.error("Error updating message acceptance status:", error);
          return CustomResponse({
               success: false,
               message: "Error updating message acceptance status",
               status: 500,
          });
     }
}

export async function GET(request: Request) {
     // Connect to the database
     await dbConnect();

     // Get the user session
     const session = await getServerSession(authOptions);
     const user = session?.user;

     // Check if the user is authenticated
     if (!session || !user) {
          return CustomResponse({
               success: false,
               message: "Not authenticated",
               status: 401,
          });
     }

     try {
          // Retrieve the user from the database using the ID
          const foundUser = await UserModel.findById(user._id);
          if (!foundUser) {
               // User not found
               return CustomResponse({
                    success: false,
                    message: "User not found",
                    status: 400,
               });
          }

          // Return the user's message acceptance status
          return CustomResponse({
               success: true,
               message: "User's message acceptance status",
               status: 200, // TODO: Test this
               isAcceptingMessages:foundUser.isAcceptingMessages,
          });

     } catch (error) {
          console.error('Error retrieving message acceptance status:', error);
          return CustomResponse({
               success: false,
               message: "Error retrieving message acceptance status",
               status: 500,
          });
     }
}