import { Message } from '@/model/User.model';

export interface ApiResponse {
    success: boolean;
    message: string;
    status?: number;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>;  
}