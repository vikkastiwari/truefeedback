import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { CustomResponse } from "@/helpers/commonHelpers";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
     console.log(request);
     
     if(request.method !== 'GET') {
          return CustomResponse({
               success: false,
               message: "Method not allowed!",
               status: 405, // status 405 - the request's HTTP method is not supported on the server or the resource itself
          });
     }
     await dbConnect();

     try {
          const { searchParams } = new URL(request.url);
          const queryParams = {
               username: searchParams.get("username"),
          };

          // Validate with zod
          const result = UsernameQuerySchema.safeParse(queryParams);
          console.log(result);

          if (!result.success) {
               const usernameErrors = result.error.format().username?._errors || [];
               return CustomResponse({
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters",
                    status: 400,
               });
          }

          const { username } = result.data;

          const existingVerifiedUser = await UserModel.findOne({
               username,
               isVerified: true,
          });

          if (existingVerifiedUser) {
               return CustomResponse({
                    success: false,
                    message: "Username is already taken",
                    status: 200,
               });
          }
          return CustomResponse({
               success: true,
               message: "Username is unique",
               status: 200,
          });
     } catch (error) {
          console.error("Error checking username:", error);
          return CustomResponse({
               success: false,
               message: "Error checking username",
               status: 500,
          });
     }
}
