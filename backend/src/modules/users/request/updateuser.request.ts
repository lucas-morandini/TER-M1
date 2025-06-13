import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserRequest {
    @IsNumber()
    @IsOptional()
    id: string;

    @IsString()
    @IsOptional()
    username: string;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    pwd: string;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    birth_date: Date;

    @IsString()
    @IsOptional()
    tel: string;

    @IsString()
    @IsOptional()
    sex: string;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    first_name: string;

    @IsNumber()
    @IsOptional()
    solde: string;

    @IsString()
    @IsOptional()
    tokens: string;
}