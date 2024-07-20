import UserModel, { Message } from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { CustomResponse } from "@/helpers/commonHelpers";

export async function POST(request: Request) {
     await dbConnect();

     const { username, content } = await request.json();
     try {
          const user = await UserModel.findOne({ username }).exec();

          if (!user) {
               return CustomResponse({
                    success: false,
                    message: "User not found",
                    status: 404,
               });
          }

          // Check if the user is accepting messages
          if (!user.isAcceptingMessages) {
               return CustomResponse({
                    success: false,
                    message: "User is not accepting messages",
                    status: 403, // 403 Forbidden status
               });
          }

          const newMessage = { content, createdAt: new Date() };

          // Push the new message to the user's messages array
          user.messages.push(newMessage as Message); // as Message is known as assertion - you guarantee that it has proper type
          await user.save();

          return CustomResponse({
               success: true,
               message: "Message sent successfully",
               status: 201, 
          });
         
     } catch (error) {
          console.error("Error adding message:", error);
          return CustomResponse({
               message: "Internal server error",
               success: false,
               status: 500, 
          });
     }
}
