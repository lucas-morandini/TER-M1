import { Exclude, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';


export class UserDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @Length(3, 50)
    name: string;

    @IsNotEmpty()
    @Length(3, 50)
    first_name: string;

    @IsNotEmpty()
    @Length(3, 50)
    username: string;

    @IsNotEmpty()
    @Length(3, 50)
    email: string;

    @IsNotEmpty()
    @IsDate()
    birth_date: Date;

    @IsString()
    tel: string;
    
    @IsString()
    sex: string;

    @IsNotEmpty()
    @IsNumber()
    solde: number;

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

    @Exclude()
    tokens: string;

    @Exclude()
    pwd: string;
}