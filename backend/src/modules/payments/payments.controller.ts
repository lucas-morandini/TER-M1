import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Req,
} from '@nestjs/common';

import {
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
  } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { Request } from 'express';
import { CurrentUser } from 'src/decorators/currentuser.decorator';
import { PaymentsService } from './payments.service';
import { UserDto } from '../users/dto/user.dto';
import Stripe from 'stripe';
import { VerifyPaymentResponse } from './response/verifypayment.response';
import { Payment } from './entities/payment.entity';
import { PaymentDto } from './dto/payment.dto';

@ApiTags('payments')
@Controller(['payment', 'payments'])
export class PaymentsController { 
    constructor(
        private readonly paymentService: PaymentsService,
    ){}

    @ApiOperation({ summary: 'Generate stripe checkout session' })
    @ApiOkResponse({ description: 'Stripe checkout session generated successfully' })
    @ApiNotFoundResponse({ description: 'Stripe checkout session not found' })
    @Post('create-checkout-session')
    async createCheckoutSession(@CurrentUser() user :UserDto, @Body() body : {amount : number}, @Req() req : Request) : Promise<Stripe.Checkout.Session>{
        const { amount } = body;
        if (!amount || amount <= 0) {
            throw new BadRequestException('Invalid amount');
        }
        const domain = req.headers.origin || 'http://localhost:4200';
        return await this.paymentService.createCheckoutSession(amount, domain);
    }

    @ApiOperation({ summary: 'Verify stripe payment by hash' })
    @ApiNotFoundResponse({ description: 'Payment not found' })
    @Get('validate/:hash')
    async verifyStripePayment(@CurrentUser() user : UserDto, @Param('hash') hash: string) : Promise<VerifyPaymentResponse>{
        return await this.paymentService.verifyStripePayment(hash, user);
    }


    @ApiOperation({ summary: 'Get all payments for a user' })
    @ApiOkResponse({ description: 'Payments fetched successfully' })
    @ApiNotFoundResponse({ description: 'Payments not found' })
    @Get('user/:userId')
    async getAllPayments(@CurrentUser() user: UserDto, @Param('userId') userId: number) : Promise<number[]> {
        if (user.id !== userId) {
            throw new BadRequestException('You can only fetch payments for your own account');
        }
        return await this.paymentService.findAllByUser(user.id);
    }

    @ApiOperation({ summary: 'Get payment by ID' })
    @ApiOkResponse({ description: 'Payment fetched successfully' })
    @ApiNotFoundResponse({ description: 'Payment not found' })
    @Get(':id')
    async getPaymentById(@CurrentUser() user: UserDto, @Param('id') id: number) : Promise<PaymentDto> {
        const payment = await this.paymentService.findById(id, user.id);
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }
        return payment;
    }


    @ApiOperation({ summary : 'Create a new withdrawal payment' })
    @ApiOkResponse({ description: 'Payment created successfully' })
    @ApiNotFoundResponse({ description: 'Payment not found' })
    @Post('withdraw')
    async createWithdrawalPayment(@CurrentUser() user: UserDto, @Body() body: {userId: number, amount : number, bankDetails: {iban : string, bic: string, accountHolderName: string}}): Promise<PaymentDto> {
        const { userId, amount, bankDetails } = body;
        return await this.paymentService.createWithdrawalPayment(user.id, amount, bankDetails);
    }
}