import 'next-auth';
import { DefaultSession } from 'next-auth';

// Redefine/modify default datatypes

// will need to use module inorder to define package's types
// It cannot be done using interface
declare module 'next-auth' {
     interface User {
          _id?: string,
          isVerified?:boolean
          isAcceptingMessages?:boolean
          username?:string
     }
     interface Session {
         user:{
          _id?: string,
          isVerified?:boolean
          isAcceptingMessages?:boolean
          username?:string
         } & DefaultSession['user']
     }
     // If you want to keep the default session user properties, you need to add them back into the newly declared interface:
     // DefaultSession - https://next-auth.js.org/getting-started/typescript#adapters
     // values inside user object is different story
}

// Other way to redefine/modify default datatypes by directly accessing them
declare module 'next-auth/jwt' {
     interface JWT {
          _id?: string,
          isVerified?:boolean
          isAcceptingMessages?:boolean
          username?:string
     }
}