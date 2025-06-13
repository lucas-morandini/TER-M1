import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { UserDto } from './dto/user.dto';
import { AuthModule } from 'src/core/auth/auth.module';
import { plainToInstance } from 'class-transformer';
import * as path from 'path';
import * as fs from 'fs';
import { MailService } from '../mail/mail.service';
import { UpdateUserRequest } from './request/updateuser.request';
@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly authService: AuthService,
        private readonly mailService: MailService,
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async login(email: string, password: string): Promise<{ access_token: string, user: UserDto }> {
        const user: UserDto | null = await this.authService.validateUser(email, password);
        if (!user) {
            throw new BadRequestException("Invalid credentials");
        }
        const log = await this.authService.login(user);
        return {
            access_token: log.access_token,
            user: user,
        };
    }

    async register(username: string, email: string, pwd: string, birth_date: Date, tel: string, sex: string, name: string, first_name: string): Promise<{ access_token: string, user: UserDto }> {
        const existingUser = await this.findByEmail(email);
        if (existingUser) {
            throw new BadRequestException("User already exists");
        }
        const today: Date = new Date();
        let age: number = today.getFullYear() - birth_date.getFullYear();
        const m: number = today.getMonth() - birth_date.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth_date.getDate())) {
            age--;
        }
        if (age < 18) {
            throw new BadRequestException("You must be at least 18 years old to register");
        }
        const user = this.userRepository.create({
            username: username,
            email: email,
            birth_date: birth_date,
            tel: tel,
            sex: sex,
            name: name,
            first_name: first_name,
            pwd: await this.authService.hashPassword(pwd),
            solde: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await this.userRepository.save(user);
        const log = await this.authService.login(user);
        const userDto = plainToInstance(UserDto, user);
        return {
            access_token: log.access_token,
            user: userDto,
        };
    }

    async forgotPassword(email: string, origin: string): Promise<{ code: boolean, message: string, info: string }> {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const token = await this.authService.generateTokenByEmail(email);
        const subject: string = "Password recovery";
        const text: string = `Click on the following link to reset your password: ${origin}/reset-password/${token}`;

        const htmlTemplatePath = path.resolve(process.cwd(), 'src', 'ressources', 'template.html');
        let html = fs.readFileSync(htmlTemplatePath, 'utf8');
        html = html.replace(/{{reset_link}}/g, `${origin}/reset-password/${token}`);
        html = html.replace(/{{first_name}}/g, user.first_name);
        html = html.replace(/{{email}}/g, user.email);

        const result = await this.mailService.sendMail(
            user.email,
            subject,
            text,
            html,
        );
        if (!result.code) {
            throw new InternalServerErrorException("Error sending email");
        }
        return result;
    }


    async resetPassword(token: string, password: string): Promise<{ code: boolean, message: string }> {
        const decoded = await this.authService.decodeEmailToken(token);
        if (!decoded) {
            throw new BadRequestException("Invalid token");
        }
        const email = decoded.email;
        const user = await this.findByEmail(email);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const hashedPassword = await this.authService.hashPassword(password);
        user.pwd = hashedPassword;
        await this.userRepository.save(user);
        return {
            code: true,
            message: "Password reset successfully",
        }
    }

    async updateUser(id: number, data: UpdateUserRequest): Promise<UserDto> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        if (data.pwd && data.pwd !== "") {
            data.pwd = await this.authService.hashPassword(data.pwd);
        } else {
            data.pwd = user.pwd;
        }
        if (data.email) {
            const userWithEmail = await this.userRepository.findOne({ where: { email: data.email } });
            // Vérifie que l'email appartient à un autre utilisateur que celui qui fait la demande
            if (userWithEmail && userWithEmail.id !== user.id) {
                throw new BadRequestException("Email already exists");
            }
        }
        if (data.tel) {
            const userWithTel = await this.userRepository.findOne({ where: { tel: data.tel } });
            // Vérifie que le numéro de téléphone appartient à un autre utilisateur que celui qui fait la demande
            if (userWithTel && userWithTel.id !== id) {
                throw new BadRequestException("Phone number already exists");
            }
        }
        if (data.username) {
            const userWithUsername = await this.userRepository.findOne({ where: { username: data.username } });
            // Vérifie que le nom d'utilisateur appartient à un autre utilisateur que celui qui fait la demande
            if (userWithUsername && userWithUsername.id !== id) {
                throw new BadRequestException("Username already exists");
            }
        }
        if (data.birth_date) {
            const today = new Date();
            const birthDate = new Date(data.birth_date);
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                throw new BadRequestException("You must be at least 18 years old to register");
            }
        }

        // Met à jour les champs de l'utilisateur
        user.username = data.username || user.username;
        user.email = data.email || user.email;
        user.pwd = data.pwd || user.pwd;
        user.birth_date = data.birth_date || user.birth_date;
        user.tel = data.tel || user.tel;
        user.sex = data.sex || user.sex;
        user.name = data.name || user.name;
        user.first_name = data.first_name || user.first_name;
        user.solde = user.solde;
        user.tokens = user.tokens;
        user.updatedAt = new Date();
        user.createdAt = user.createdAt;
        await this.userRepository.save(user);
        const userDto = plainToInstance(UserDto, user);
        return userDto;
    }

    async findById(id: number): Promise<UserDto> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return plainToInstance(UserDto, user);
    }
}
