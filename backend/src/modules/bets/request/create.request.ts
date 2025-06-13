import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateRequest{
    @IsNotEmpty()
    @IsNumber()
    gamble_id: number;

    @IsNotEmpty()
    @IsNumber()
    stake: number;

    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsNumber()
    odds?: number;

    @IsOptional()
    win?: any;

    @IsOptional()
    @IsNumber()
    user_id?: number;

    @IsOptional()
    @IsBoolean()
    paid?: boolean;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    createdAt?: Date;
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    updatedAt?: Date;
}