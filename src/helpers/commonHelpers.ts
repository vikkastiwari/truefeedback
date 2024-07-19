import { ApiResponse } from "@/types/ApiResponse";

export function CustomResponse(res:ApiResponse) {
     const {success, message, status, ...otherValues} = res;

     return Response.json({
               success,
               message,
               ...otherValues
          },{ 
               status 
          }
     );
}