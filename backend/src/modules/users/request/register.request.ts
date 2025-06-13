
import { Type } from 'class-transformer';
import { IsString, IsEmail, IsDate, IsOptional, IsNumber } from 'class-validator';
export class RegisterRequest {
    // const {username, email, pwd, birth_date, tel, sex, name, first_name } = body;
    @IsString()
    username: string;
    @IsString()
    @IsEmail()
    email: string;
    @IsString()
    pwd: string;
    @Type(() => Date)
    @IsDate()
    birth_date: Date;
    @IsString()
    tel: string;
    @IsString()
    sex: string;
    @IsString()
    name: string;
    @IsString()
    first_name: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    createdAt?: Date;
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    updatedAt?: Date;

    @IsOptional()
    @IsNumber()
    solde?: number;

    @IsOptional()
    @IsNumber()
    id?: number;
}
