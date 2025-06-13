import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordRequest{
    @IsNotEmpty()
    @IsString()
    token: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}