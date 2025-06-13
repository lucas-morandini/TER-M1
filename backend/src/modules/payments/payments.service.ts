import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { StripeHash } from './entities/stripe-hash.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { UserDto } from '../users/dto/user.dto';
import { User } from '../users/entities/user.entity';
import { Payment } from './entities/payment.entity';
import { PaymentDto } from './dto/payment.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PaymentsService {

    constructor(
            @InjectRepository(StripeHash)
            private readonly stripeHashRepository: Repository<StripeHash>,
            @InjectRepository(Payment)
            private readonly paymentRepository: Repository<Payment>,
            private readonly configService: ConfigService,
            @InjectRepository(User)
            private readonly userRepository: Repository<User>,
    ) {}

    async findStripeHashByHash(hash: string): Promise<StripeHash | null> {
        return this.stripeHashRepository.findOne({ where: { hash } });
    }

    async createStripeHash(hash: string): Promise<StripeHash> {
        const stripeHash = this.stripeHashRepository.create({ hash });
        return this.stripeHashRepository.save(stripeHash);
    }

    async createPayment(payment: Payment): Promise<Payment> {
        const newPayment = this.paymentRepository.create(payment);
        return this.paymentRepository.save(newPayment);
    }
        
    async createCheckoutSession(amount: number, domain: string): Promise<Stripe.Checkout.Session> {
        try {
            const stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') || '');
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Test payment',
                            },
                            unit_amount: amount,
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${domain}/payment/stripe/validation?hash={CHECKOUT_SESSION_ID}`,
                cancel_url: `${domain}/payment/stripe?hash={CHECKOUT_SESSION_ID}`,
                expand: ['payment_intent']
            });
            return session;
        } catch (error) {
            console.error('Error creating Stripe checkout session:', error);
            throw new InternalServerErrorException('Failed to create checkout session');
        }
    }

    async verifyStripePayment(hash: string, user: UserDto): Promise<{ code: boolean, message: string , solde: number}> {
        const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
        if (!stripeSecretKey) {
            throw new InternalServerErrorException('Stripe secret key not configured');
        }
        const stripe = new Stripe(stripeSecretKey);
        // userDto to User
        if (!user || !user.id) {
            throw new BadRequestException("User not found");
        }
        const userEntity = await this.userRepository.findOne({ where: { id: user.id } });
        if (!userEntity) {
            throw new NotFoundException("User not found");
        }
        if (!hash || hash === "") {
            throw new BadRequestException("Hash is required");
        }
        try {
            const stripeHash = await this.findStripeHashByHash(hash);
            if (stripeHash) {
                throw new Error("Hash already used");
            }
            const session = await stripe.checkout.sessions.retrieve(hash);
            if (session.payment_status === 'paid') {
                if (session.amount_total === null) {
                    throw new InternalServerErrorException("Payment amount not available");
                }
                userEntity.solde += session.amount_total / 100;
                await this.userRepository.save(userEntity);
                await this.createStripeHash(hash);
                const payment = new Payment();
                payment.user = userEntity;
                payment.amount = session.amount_total / 100; // Convert cents to dollars
                payment.type= 'deposit';
                payment.status = 'completed';
                await this.createPayment(payment);
                return { code : true, message: "Payment successful", solde: user.solde };
            } else {
                throw new BadRequestException("Payment not successful");
            }
        } catch (err) {
            console.log('stripe error', err);
            throw new BadRequestException("Payment verification failed: " + err.message);
        }
    }


    async findAllByUser(userId: number): Promise<number[]> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const payments = await this.paymentRepository.find({ where: { user : { id: userId } }, relations: ['user'] });

        return await Promise.all(payments.map(async payment => {
            return payment.id;
        }));
    }

    async findById(paymentId: number, userId: number): Promise<PaymentDto> {
        const payment = await this.paymentRepository.findOne({ where: { id: paymentId, user: { id: userId } }, relations: ['user'] });
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }
        return plainToInstance(PaymentDto, payment, { excludeExtraneousValues: false });
    }

    async createWithdrawalPayment(userId: number, amount : number, bankDetails: {iban : string, bic: string, accountHolderName: string}): Promise<PaymentDto> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user.solde < amount) {
            throw new BadRequestException('Insufficient balance');
        }
        const payment = new Payment();
        payment.user = user;
        payment.amount = amount;
        payment.type = 'withdrawal';
        payment.status = 'pending';
        payment.date = new Date();
        payment.iban = bankDetails.iban;
        payment.bic = bankDetails.bic;
        payment.accountHolderName = bankDetails.accountHolderName;
        try{
            const newPayment = await this.createPayment(payment);
            user.solde -= amount;
            await this.userRepository.save(user);
            return plainToInstance(PaymentDto, newPayment, { excludeExtraneousValues: false });
        }catch (error) {
            console.error('Error creating withdrawal payment:', error);
            throw new InternalServerErrorException('Failed to create withdrawal payment');
        }
    }
}
