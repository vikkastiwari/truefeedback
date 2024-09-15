import { getServerSession } from "next-auth";
import { User } from 'next-auth';

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { CustomResponse } from "@/helpers/commonHelpers";
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function DELETE(request: Request, {params}:{params:{messageid:string}}) {
     const messageId = params.messageid
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

     try {
          const updatedResult = await UserModel.updateOne(
               {_id: user._id},
               {$pull: {messages: {_id:messageId}}}
          )
          if(updatedResult.modifiedCount == 0) {
               return CustomResponse({
                    success: true,
                    message: "Messages Deleted",
                    status: 200,
               });
          }
     } catch (error) {
          console.error('An unexpected error occurred:', error);
          return CustomResponse({
               success: false,
               message: "Error Deleting Message",
               status: 500,
          });
     }
     
}