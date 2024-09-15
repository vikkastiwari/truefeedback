import { getServerSession } from "next-auth";
import { User } from 'next-auth';
import mongoose from "mongoose";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { CustomResponse } from "@/helpers/commonHelpers";
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(request: Request) {
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

     const userId = new mongoose.Types.ObjectId(user?._id);
     try {
          // mongodb aggregate pipeline
          const user = await UserModel.aggregate([
               { $match: { _id: userId } }, // match user with specified id
               { $unwind: '$messages' }, // array is opened to object
               { $sort: { 'messages.createdAt': -1 } }, // after unwind now we can sort objects 
               { $group: { _id: '$_id', messages: { $push: '$messages' } } }, // grouping all the documents
          ]).exec();
         
          if (!user || user.length === 0) {
               return CustomResponse({
                    success: false,
                    message: 'User not found',
                    status: 404,
               });
          }

          return CustomResponse({
               success: true,
               messages: user[0].messages,
               status: 200,
          });

     } catch (error) {
          console.error('An unexpected error occurred:', error);
          return CustomResponse({
               success: false,
               message: "Internal server error",
               status: 500,
          });
     }
}