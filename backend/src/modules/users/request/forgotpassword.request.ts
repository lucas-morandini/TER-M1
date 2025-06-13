
import { IsString, IsEmail } from 'class-validator';
export class ForgotPasswordRequest {
    @IsString()
    @IsEmail()
    email: string;
}
