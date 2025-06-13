
import { IsString, IsEmail } from 'class-validator';
export class ConnectRequest {
    @IsString()
    @IsEmail()
    email: string;
    
    @IsString()
    password: string;
}
