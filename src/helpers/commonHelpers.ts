import { ApiResponse } from "@/types/ApiResponse";

export function CustomResponse(res:ApiResponse) {
     const {success, message, status} = res;

     return Response.json({
               success,
               message
          },{ 
               status 
          }
     );
}