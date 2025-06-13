import { Exclude } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';


export class NotificationDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @IsString()
    message: string;

    @IsNotEmpty()
    @IsNumber()
    soldeUpdate: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

    @Exclude()
    userId: number;

    @Exclude()
    isRead: boolean;
}