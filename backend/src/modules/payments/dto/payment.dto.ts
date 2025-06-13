import { Exclude, Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "src/modules/users/entities/user.entity";
import PaymentInterface from "src/shared/commons/interface/Payment.interface";

export class PaymentDto implements PaymentInterface{
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsEnum(['deposit', 'withdrawal'])
    type: 'deposit' | 'withdrawal';

    @IsNotEmpty()
    @IsEnum(['pending', 'completed', 'failed'])
    status: 'pending' | 'completed' | 'failed';

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    date: Date;

    @IsOptional()
    @IsString()
    iban?: string;

    @IsOptional()
    @IsString()
    bic?: string;

    @IsOptional()
    @IsString()
    accountHolderName?: string;

    @Exclude()
    createdAt: Date;
    @Exclude()
    updatedAt: Date;
}