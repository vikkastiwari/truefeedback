import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';
import { GoogleGenerativeAI, GoogleGenerativeAIError, GoogleGenerativeAIFetchError } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import { SuggestMessagePrompt } from '@/constants/common.constant';

export async function POST(req: Request) {
      try {
          const prompt = SuggestMessagePrompt;
          const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY as string);
          const model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash" ,
                generationConfig: {
                    maxOutputTokens: 400, // controls length and complexity of the response
                    temperature: 0.4, // ramdomness of the generation
               },
          });
          const stream = await model.generateContentStream(prompt);

          return new StreamingTextResponse(GoogleGenerativeAIStream(stream));

     } catch (error) {
          // Gemini error handling
          if (error instanceof GoogleGenerativeAIError) {
               const { name, message } = error;
               return NextResponse.json({ name, status:400, message }, { status:400 });
          } else if (error instanceof GoogleGenerativeAIFetchError) {
               const { name, status, statusText, message } = error;
               return NextResponse.json({ name, status, statusText, message }, { status });
          } else {
               // General error handling
               console.error('An unexpected error occurred:', error);
               throw error;
          }
     }
}